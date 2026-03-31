import Link from "next/link";
import { templates } from "@/lib/templates/catalog";

export default function HomePage() {
  const postTypes = [
    "Product promotions",
    "Quote cards",
    "Collage recap posts",
    "Carousel covers",
    "Announcements",
    "Event creatives"
  ];

  return (
    <div className="flex h-full flex-col gap-8">
      <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
        <div className="max-w-3xl space-y-3">
          <p className="inline-flex rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-200">
            Create scroll-stopping social content in minutes
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Design stunning posts with ready-made templates, smart captions, and one-click export
          </h2>
          <p className="text-sm text-slate-300">
            Pick a template, drop your images, customize text, generate captions, and export platform-ready creatives for your brand.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/editor"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-400"
          >
            Open editor
          </Link>
          <Link
            href="/templates"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800/60"
          >
            Browse templates
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">What you can create</h3>
          <p className="text-sm text-slate-400">
            Build different post formats for Instagram, LinkedIn, X, and more.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {postTypes.map((type) => (
            <div
              key={type}
              className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
            >
              {type}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Available templates</h3>
          <p className="text-sm text-slate-400">
            Start with these layouts and customize them inside the editor.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
                {template.aspectRatio} · {template.category}
              </div>
              <p className="text-sm font-medium text-slate-100">{template.name}</p>
              <p className="mt-1 text-xs text-slate-400">
                {template.description || "Customizable social media layout."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex">
        <Link
          href="/editor"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-400"
        >
          Start creating now
        </Link>
      </div>
    </div>
  );
}

