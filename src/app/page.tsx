import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="max-w-xl space-y-2">
        <h2 className="text-lg font-semibold">Start a new post</h2>
        <p className="text-sm text-slate-400">
          This web app will mirror your mobile experience: pick photos, choose
          a layout, tweak text and export ready-to-share images. We&apos;ll
          later add an AI assistant for caption ideas.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
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
    </div>
  );
}

