import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Social Media Generator Web",
  description: "Create beautiful social media posts from your browser."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Social Media Generator
              </h1>
              <p className="text-sm text-slate-400">
                Web editor for templates, captions and exports.
              </p>
            </div>
          </header>
          <section className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}

