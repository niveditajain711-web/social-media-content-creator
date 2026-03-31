import { NextResponse } from "next/server";

type CaptionRequestBody = {
  provider?: "auto" | "gemini" | "openrouter" | "mock";
  platform: "instagram" | "linkedin" | "twitter" | "facebook";
  tone: "professional" | "playful" | "bold";
  length: "short" | "medium" | "long";
  topic: string;
};

const GEMINI_MODEL_CANDIDATES = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest"
];
const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
type Suggestion = { id: string; caption: string; hashtags: string[] };

function extractJsonObject(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeFenceMatch?.[1]) {
    return codeFenceMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CaptionRequestBody;

    const toneLabel =
      body.tone === "professional"
        ? "professional"
        : body.tone === "playful"
        ? "playful and friendly"
        : "bold and attention-grabbing";

    const prompt = `You generate social media captions and hashtags.
Return ONLY valid JSON with this exact shape:
{
  "suggestions": [
    { "id": "sugg-1", "caption": "string", "hashtags": ["string"] }
  ]
}

Rules:
- 4 suggestions total
- Keep content safe and non-harmful
- Platform: ${body.platform}
- Tone: ${toneLabel}
- Length: ${body.length}
- Topic/keywords: ${body.topic || "general social post"}
- hashtags should be plain words without '#'`;

    const errors: string[] = [];
    const selectedProvider = body.provider ?? "auto";
    const geminiKey = process.env.GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (selectedProvider === "mock") {
      return NextResponse.json({ suggestions: buildMockSuggestions(body) });
    }

    const shouldTryGemini =
      selectedProvider === "auto" || selectedProvider === "gemini";
    const shouldTryOpenRouter =
      selectedProvider === "auto" || selectedProvider === "openrouter";

    if (shouldTryGemini && geminiKey) {
      const geminiResult = await generateWithGemini(geminiKey, prompt);
      if (geminiResult.ok) {
        return NextResponse.json({ suggestions: geminiResult.suggestions });
      }
      errors.push(`Gemini failed: ${geminiResult.error}`);
    } else if (shouldTryGemini) {
      errors.push("Gemini skipped: GEMINI_API_KEY missing");
    }

    if (shouldTryOpenRouter && openRouterKey) {
      const openRouterResult = await generateWithOpenRouter(openRouterKey, prompt);
      if (openRouterResult.ok) {
        return NextResponse.json({ suggestions: openRouterResult.suggestions });
      }
      errors.push(`OpenRouter failed: ${openRouterResult.error}`);
    } else if (shouldTryOpenRouter) {
      errors.push("OpenRouter skipped: OPENROUTER_API_KEY missing");
    }

    const mockSuggestions = buildMockSuggestions(body);
    return NextResponse.json(
      {
        suggestions: mockSuggestions,
        warning: "AI providers unavailable. Returning local mock suggestions.",
        debug: errors
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI caption error", error);
    return NextResponse.json({ error: "Caption generation failed" }, { status: 500 });
  }
}

function normalizeSuggestions(rawText: string): Suggestion[] {
  const parsedText = extractJsonObject(rawText);
  const parsed = JSON.parse(parsedText) as {
    suggestions?: { id?: string; caption?: string; hashtags?: string[] }[];
  };
  return (
    parsed.suggestions?.map((s, index) => ({
      id: s.id || `sugg-${index + 1}`,
      caption: (s.caption ?? "").trim(),
      hashtags: (s.hashtags ?? []).slice(0, 10)
    }))
      .filter((s) => s.caption.length > 0)
      .slice(0, 6) ?? []
  );
}

async function generateWithGemini(
  apiKey: string,
  prompt: string
): Promise<
  | { ok: true; suggestions: Suggestion[] }
  | { ok: false; error: string }
> {
  let lastError = "unknown error";
  for (const model of GEMINI_MODEL_CANDIDATES) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 500 }
        })
      }
    );

    if (!response.ok) {
      lastError = `${response.status}: ${await response.text()}`;
      if (response.status === 404) continue;
      return { ok: false, error: lastError };
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const raw =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("\n")
        .trim() ?? "";
    if (!raw) return { ok: false, error: "empty response content" };

    try {
      const suggestions = normalizeSuggestions(raw);
      if (suggestions.length === 0) return { ok: false, error: "no suggestions parsed" };
      return { ok: true, suggestions };
    } catch (err) {
      return { ok: false, error: `invalid JSON: ${String(err)}` };
    }
  }

  return { ok: false, error: lastError };
}

async function generateWithOpenRouter(
  apiKey: string,
  prompt: string
): Promise<
  | { ok: true; suggestions: Suggestion[] }
  | { ok: false; error: string }
> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: "Return only JSON for the requested schema." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    return { ok: false, error: `${response.status}: ${await response.text()}` };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!raw) return { ok: false, error: "empty response content" };

  try {
    const suggestions = normalizeSuggestions(raw);
    if (suggestions.length === 0) return { ok: false, error: "no suggestions parsed" };
    return { ok: true, suggestions };
  } catch (err) {
    return { ok: false, error: `invalid JSON: ${String(err)}` };
  }
}

function buildMockSuggestions(body: CaptionRequestBody): Suggestion[] {
  const topic = body.topic?.trim() || "your latest update";
  const platformTag =
    body.platform === "linkedin" ? "professional insight" : "community moment";
  return [
    {
      id: "mock-1",
      caption: `Big update on ${topic}. Here is what changed and why it matters for our audience.`,
      hashtags: ["update", "socialmedia", "content"]
    },
    {
      id: "mock-2",
      caption: `A quick ${platformTag} about ${topic}. Save this for later and share your take.`,
      hashtags: ["creator", "marketing", "growth"]
    },
    {
      id: "mock-3",
      caption: `Behind the scenes of ${topic} today. What should we build next?`,
      hashtags: ["behindthescenes", "buildinpublic", "community"]
    },
    {
      id: "mock-4",
      caption: `If you care about ${topic}, this is for you. Drop a comment and we will send more tips.`,
      hashtags: ["tips", "digital", "engagement"]
    }
  ];
}

