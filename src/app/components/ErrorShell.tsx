import Link from "next/link";
import type { ReactNode } from "react";
import { CurrentPath } from "./CurrentPath";
import { Logo } from "./Logo";

// Shared frame for not-found.tsx and error.tsx so both keep the landing page's
// header, background wash, and "request card" look.
export const ErrorShell = ({
  eyebrow,
  title,
  description,
  status,
  statusTone,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  statusTone: "amber" | "rose";
  children: ReactNode;
}) => (
  <div className="flex min-h-screen flex-col overflow-hidden bg-[#f7f7fb] text-slate-950">
    <div className="relative isolate flex flex-1 flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_15%_0%,#e0e7ff_0,transparent_32%),radial-gradient(circle_at_80%_8%,#dbeafe_0,transparent_29%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <Logo className="size-9 text-indigo-600" />
          <span>Screenshot Maker</span>
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">{children}</div>
        </div>
        <div className="relative rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-indigo-950/10">
          <div className="overflow-hidden rounded-[1.45rem] border border-slate-200 bg-slate-950 p-4 text-sm shadow-inner">
            <div className="mb-8 flex gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-300" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <p className="break-all font-mono text-slate-400">
              GET{" "}
              <span className="text-indigo-300">
                <CurrentPath />
              </span>
            </p>
            <div
              className={`mt-8 flex items-center gap-3 rounded-xl p-3 text-xs ${
                statusTone === "amber"
                  ? "bg-amber-400/10 text-amber-200"
                  : "bg-rose-400/10 text-rose-200"
              }`}
            >
              <span
                className={`size-2 shrink-0 rounded-full ${
                  statusTone === "amber" ? "bg-amber-400" : "bg-rose-400"
                }`}
              />
              {status}
            </div>
          </div>
        </div>
      </main>
    </div>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500 lg:px-8">
        ©2023–{new Date().getFullYear()} Bootpack Digital
      </div>
    </footer>
  </div>
);

export const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700";

export const secondaryButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400";
