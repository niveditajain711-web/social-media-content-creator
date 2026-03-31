import sharp from "sharp";
import { NextResponse } from "next/server";
import { getTemplateById } from "@/lib/templates/catalog";

type ExportRequestBody = {
  templateId: string;
  exportFormat: "png" | "jpeg";
  slotAssignments: {
    slotId: string;
    photoId: string;
    offsetX: number;
    offsetY: number;
    scale: number;
  }[];
  textBlocks: {
    areaId: string;
    value: string;
  }[];
  photos: {
    id: string;
    objectUrl: string;
    dataUrl?: string;
    fileName: string;
  }[];
};

const CANVAS_SIZE = 1080;
const SVG_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (ch) => SVG_ESCAPE[ch] ?? ch);
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return Buffer.from(match[2], "base64");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExportRequestBody;

    const template = getTemplateById(body.templateId);
    if (!template) {
      return NextResponse.json({ error: "Unknown template" }, { status: 400 });
    }

    const format = body.exportFormat === "jpeg" ? "jpeg" : "png";

    const base = sharp({
      create: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        channels: 4,
        background: { r: 12, g: 18, b: 36, alpha: 1 }
      }
    });

    const composites: sharp.OverlayOptions[] = [];

    for (const assignment of body.slotAssignments) {
      const slot = template.slots.find((s) => s.id === assignment.slotId);
      if (!slot) continue;
      const photo = body.photos.find((p) => p.id === assignment.photoId);
      if (!photo) continue;

      const slotWidth = Math.round(slot.width * CANVAS_SIZE);
      const slotHeight = Math.round(slot.height * CANVAS_SIZE);
      const left = Math.round(slot.x * CANVAS_SIZE);
      const top = Math.round(slot.y * CANVAS_SIZE);

      const source = photo.dataUrl ? parseDataUrl(photo.dataUrl) : null;
      if (!source) {
        const placeholder = sharp({
          create: {
            width: slotWidth,
            height: slotHeight,
            channels: 4,
            background: { r: 30, g: 41, b: 59, alpha: 1 }
          }
        });
        composites.push({ input: await placeholder.png().toBuffer(), left, top });
        continue;
      }

      const fitted = await sharp(source)
        .resize(slotWidth, slotHeight, { fit: "cover", position: "centre" })
        .png()
        .toBuffer();
      composites.push({ input: fitted, left, top });
    }

    const textOverlays = template.textAreas
      .map((area, index) => {
        const text = body.textBlocks.find((t) => t.areaId === area.id)?.value?.trim() ?? "";
        if (!text) return "";
        const x = Math.round(area.x * CANVAS_SIZE);
        const y = Math.round(area.y * CANVAS_SIZE) + 40;
        const safeText = escapeHtml(text);
        return `<text x="${x}" y="${y}" fill="#f8fafc" font-size="${index === 0 ? 54 : 42}" font-family="Arial, sans-serif" font-weight="700">
  <tspan x="${x}" dy="0">${safeText}</tspan>
</text>`;
      })
      .join("");

    if (textOverlays) {
      const svg = Buffer.from(
        `<svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
<defs><style>.shadow{paint-order:stroke;stroke:#020617;stroke-width:2;}</style></defs>
${textOverlays.replace(/<text /g, '<text class="shadow" ')}
</svg>`
      );
      composites.push({ input: svg, left: 0, top: 0 });
    }

    const final = await base.composite(composites).toFormat(format).toBuffer();

    return new NextResponse(final, {
      status: 200,
      headers: {
        "Content-Type": format === "png" ? "image/png" : "image/jpeg",
        "Content-Disposition": `attachment; filename="social-post.${format === "png" ? "png" : "jpg"}"`
      }
    });
  } catch (error) {
    console.error("Export error", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

