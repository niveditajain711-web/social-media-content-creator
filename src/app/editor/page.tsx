"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { templates, getTemplateById } from "@/lib/templates/catalog";
import {
  loadEditorStateFromStorage,
  saveEditorStateToStorage,
  useEditorStore,
  type UploadedPhoto
} from "@/lib/store/editorStore";

const CanvasStage = dynamic(
  () => import("@/components/editor/CanvasStage").then((m) => m.CanvasStage),
  { ssr: false }
);

export default function EditorPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const state = useEditorStore((s) => s);
  const loadFromTemplate = useEditorStore((s) => s.loadFromTemplate);
  const addUploadedPhotos = useEditorStore((s) => s.addUploadedPhotos);
  const updateText = useEditorStore((s) => s.updateText);
  const assignPhotoToSlot = useEditorStore((s) => s.assignPhotoToSlot);
  const exportFormat = useEditorStore((s) => s.exportFormat);
  const slotAssignments = useEditorStore((s) => s.slotAssignments);
  const setExportFormat = useEditorStore((s) => s.setExportFormat);
  const aiPlatform = useEditorStore((s) => s.aiPlatform);
  const aiTone = useEditorStore((s) => s.aiTone);
  const aiLength = useEditorStore((s) => s.aiLength);
  const aiProvider = useEditorStore((s) => s.aiProvider);
  const aiTopic = useEditorStore((s) => s.aiTopic);
  const aiLoading = useEditorStore((s) => s.aiLoading);
  const aiSuggestions = useEditorStore((s) => s.aiSuggestions);
  const setAiConfig = useEditorStore((s) => s.setAiConfig);
  const setAiLoading = useEditorStore((s) => s.setAiLoading);
  const setAiSuggestions = useEditorStore((s) => s.setAiSuggestions);
  const applyCaptionSuggestion = useEditorStore((s) => s.applyCaptionSuggestion);

  const selectedTemplate = useMemo(
    () => getTemplateById(state.selectedTemplateId),
    [state.selectedTemplateId]
  );

  useEffect(() => {
    const current = useEditorStore.getState();

    // If template is already selected (e.g. from /templates click), keep it.
    if (current.selectedTemplateId) {
      setIsHydrated(true);
      return;
    }

    const stored = loadEditorStateFromStorage();
    if (stored?.selectedTemplateId) {
      useEditorStore.getState().hydrate(stored);
    } else if (templates[0]) {
      loadFromTemplate(templates[0]);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const id = window.setTimeout(() => {
      saveEditorStateToStorage(state);
    }, 400);
    return () => window.clearTimeout(id);
  }, [state, isHydrated]);

  if (!selectedTemplate) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-sm text-slate-300">
          No template selected yet. Pick one to start designing.
        </p>
        <button
          type="button"
          onClick={() => router.push("/templates")}
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-400"
        >
          Browse templates
        </button>
      </div>
    );
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const uploads: UploadedPhoto[] = await Promise.all(
      Array.from(files).map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        fileName: file.name,
        objectUrl: URL.createObjectURL(file),
        dataUrl: await readFileAsDataUrl(file)
      }))
    );
    addUploadedPhotos(uploads);

    // Auto-fill unassigned slots with newly uploaded photos.
    const currentAssignments = useEditorStore.getState().slotAssignments;
    const assignedSlotIds = new Set(currentAssignments.map((a) => a.slotId));
    let nextPhotoIdx = 0;
    for (const slot of selectedTemplate.slots) {
      if (assignedSlotIds.has(slot.id)) continue;
      const photo = uploads[nextPhotoIdx++];
      if (!photo) break;
      assignPhotoToSlot(slot, photo.id);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          exportFormat: state.exportFormat,
          slotAssignments: state.slotAssignments,
          textBlocks: state.textBlocks,
          photos: state.photos
        })
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `social-post.${exportFormat === "png" ? "png" : "jpg"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed, please try again.");
    }
  };

  const handleGenerateCaptions = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: aiProvider,
          platform: aiPlatform,
          tone: aiTone,
          length: aiLength,
          topic: aiTopic
        })
      });
      if (!response.ok) {
        throw new Error("Failed");
      }
      const json = (await response.json()) as { suggestions: { id: string; caption: string; hashtags?: string[] }[] };
      setAiSuggestions(json.suggestions);
    } catch {
      alert("Caption generation failed. Check your selected AI provider key and try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Editor</h2>
          <p className="text-sm text-slate-400">
            Upload photos, tweak text, and export a ready-to-share image.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-400"
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid h-full gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)_minmax(0,1.5fr)]">
        <div className="flex min-h-[260px] flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-200">Templates</p>
            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="text-[11px] font-medium text-sky-300 hover:underline"
            >
              Browse all
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Currently using: <span className="font-medium">{selectedTemplate.name}</span>
          </p>

          <div className="mt-2 space-y-2">
            <p className="text-xs font-medium text-slate-200">Upload photos</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="block w-full cursor-pointer text-xs text-slate-300 file:mr-2 file:rounded-md file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-xs file:font-medium file:text-slate-50 hover:file:bg-slate-600"
            />
            <div className="mt-1 flex flex-wrap gap-1.5">
              {state.photos.map((photo) => (
                <span
                  key={photo.id}
                  className="truncate rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300"
                >
                  {photo.fileName}
                </span>
              ))}
              {state.photos.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No photos yet. Upload to assign them to slots.
                </p>
              )}
            </div>
          </div>

          {selectedTemplate.slots.length > 0 && (
            <div className="mt-2 space-y-2 border-t border-slate-800 pt-2">
              <p className="text-xs font-medium text-slate-200">Assign photos to slots</p>
              {selectedTemplate.slots.map((slot) => {
                const assigned = slotAssignments.find((a) => a.slotId === slot.id);
                return (
                  <label key={slot.id} className="block space-y-1">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      {slot.id}
                    </span>
                    <select
                      value={assigned?.photoId ?? ""}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        assignPhotoToSlot(slot, e.target.value);
                      }}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100"
                    >
                      <option value="">Select photo</option>
                      {state.photos.map((photo) => (
                        <option key={photo.id} value={photo.id}>
                          {photo.fileName}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <CanvasStage template={selectedTemplate} />
        </div>

        <div className="flex min-h-[260px] flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div>
            <p className="text-xs font-medium text-slate-200">Text areas</p>
            <p className="text-[11px] text-slate-500">
              Edit the text that appears on the canvas. Use AI to help with captions below.
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto pr-1">
            {selectedTemplate.textAreas.map((area) => {
              const current =
                state.textBlocks.find((b) => b.areaId === area.id)?.value ?? "";
              return (
                <label key={area.id} className="block space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
                    {area.label}
                  </span>
                  <textarea
                    value={current}
                    onChange={(e) => updateText(area, e.target.value)}
                    rows={area.label.toLowerCase().includes("caption") ? 4 : 2}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-500 focus:ring-1"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-2 space-y-2 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-200">AI captions</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                  Platform
                </span>
                <select
                  value={aiPlatform}
                  onChange={(e) =>
                    setAiConfig({ aiPlatform: e.target.value as typeof aiPlatform })
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                  AI Provider
                </span>
                <select
                  value={aiProvider}
                  onChange={(e) =>
                    setAiConfig({ aiProvider: e.target.value as typeof aiProvider })
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100"
                >
                  <option value="auto">Auto (fallback)</option>
                  <option value="gemini">Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="mock">Mock (offline)</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                  Tone
                </span>
                <select
                  value={aiTone}
                  onChange={(e) =>
                    setAiConfig({ aiTone: e.target.value as typeof aiTone })
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100"
                >
                  <option value="professional">Professional</option>
                  <option value="playful">Playful</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                  Length
                </span>
                <select
                  value={aiLength}
                  onChange={(e) =>
                    setAiConfig({ aiLength: e.target.value as typeof aiLength })
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1 text-[11px] text-slate-100"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                  Topic / keywords
                </span>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiConfig({ aiTopic: e.target.value })}
                  placeholder="e.g. new product launch"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100"
                />
              </div>
            </div>
            <button
              type="button"
              disabled={aiLoading}
              onClick={handleGenerateCaptions}
              className="mt-1 inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {aiLoading ? "Generating…" : "Generate captions"}
            </button>

            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
              {aiSuggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => applyCaptionSuggestion(s)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-[11px] text-slate-100 hover:border-sky-500/70 hover:bg-slate-900"
                >
                  <p>{s.caption}</p>
                  {s.hashtags && s.hashtags.length > 0 && (
                    <p className="mt-1 text-[10px] text-slate-400">
                      {s.hashtags.map((h) => `#${h}`).join(" ")}
                    </p>
                  )}
                </button>
              ))}
              {!aiLoading && aiSuggestions.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No suggestions yet. Describe your post and generate ideas.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

