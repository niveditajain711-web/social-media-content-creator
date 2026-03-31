"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { templates } from "@/lib/templates/catalog";
import { useEditorStore } from "@/lib/store/editorStore";
import { getTemplateById } from "@/lib/templates/catalog";

export default function TemplatesPage() {
  const router = useRouter();
  const loadFromTemplate = useEditorStore((s) => s.loadFromTemplate);

  const handleUseTemplate = (id: string) => {
    const template = getTemplateById(id);
    if (!template) return;
    loadFromTemplate(template);
    router.push("/editor");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Browse templates</h2>
          <p className="text-sm text-slate-400">
            Pick a layout to start designing. You can still tweak text, photos,
            and captions later.
          </p>
        </div>
        <Link
          href="/editor"
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/60"
        >
          Go to editor
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => handleUseTemplate(tpl.id)}
            className="group flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-sky-500/70 hover:bg-slate-900"
          >
            <div className="mb-2 flex h-28 items-center justify-center rounded-md bg-slate-800/70 text-[10px] uppercase tracking-wide text-slate-400">
              {tpl.aspectRatio} · {tpl.category}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-50">
                  {tpl.name}
                </p>
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                  {tpl.tags[0]}
                </span>
              </div>
              {tpl.description && (
                <p className="line-clamp-2 text-xs text-slate-400">
                  {tpl.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

