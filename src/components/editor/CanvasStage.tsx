"use client";

import type { TemplateDefinition } from "@/lib/templates/schema";
import { useEditorStore } from "@/lib/store/editorStore";

type Props = {
  template: TemplateDefinition;
};

export function CanvasStage({ template }: Props) {
  const textBlocks = useEditorStore((s) => s.textBlocks);
  const photos = useEditorStore((s) => s.photos);
  const slotAssignments = useEditorStore((s) => s.slotAssignments);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-200">
          Preview (layout summary)
        </p>
        <p className="text-[11px] text-slate-500">
          {template.aspectRatio} · {template.category}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 p-3">
        <div
          className="relative w-full max-w-[420px] overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950"
          style={{
            aspectRatio:
              template.aspectRatio === "4:5"
                ? "4 / 5"
                : template.aspectRatio === "9:16"
                  ? "9 / 16"
                  : template.aspectRatio === "16:9"
                    ? "16 / 9"
                    : "1 / 1"
          }}
        >
          {template.slots.map((slot) => {
            const assignment = slotAssignments.find((s) => s.slotId === slot.id);
            const photo = assignment
              ? photos.find((p) => p.id === assignment.photoId)
              : undefined;
            return (
              <div
                key={slot.id}
                className="absolute overflow-hidden rounded-md border border-slate-700 bg-slate-800"
                style={{
                  left: `${slot.x * 100}%`,
                  top: `${slot.y * 100}%`,
                  width: `${slot.width * 100}%`,
                  height: `${slot.height * 100}%`
                }}
              >
                {photo ? (
                  <img
                    src={photo.objectUrl}
                    alt={photo.fileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                    {slot.id}
                  </div>
                )}
              </div>
            );
          })}

          {template.textAreas.map((area) => {
            const value = textBlocks.find((b) => b.areaId === area.id)?.value ?? "";
            return (
              <div
                key={area.id}
                className="absolute text-white"
                style={{
                  left: `${area.x * 100}%`,
                  top: `${area.y * 100}%`,
                  width: `${area.maxWidth * 100}%`
                }}
              >
                <p className="line-clamp-4 text-xs font-semibold drop-shadow">
                  {value || area.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

