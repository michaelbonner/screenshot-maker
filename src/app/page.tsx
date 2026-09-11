import Link from "next/link";
import { Logo } from "./components/Logo";
import { UrlBuilderForm } from "./components/UrlBuilderForm";

const args = [
  ["url", "string", "—", "The page you want to capture. Required."],
  ["width", "number", "1512", "Viewport width in pixels."],
  ["height", "number", "982", "Viewport height in pixels."],
  ["scale", "number", "0.25", "Output scale, up to 1."],
  ["quality", "number", "50", "Image quality from 1–100."],
  ["fullPage", "boolean", "false", "Capture the complete page."],
  ["type", "png | jpeg | webp | avif", "webp", "The image format to return."],
  ["key", "string", "—", "Your API key, if enabled."],
];

const exampleUrl = new URL("https://screenshot-maker.bootpack.dev/api/screenshot");
exampleUrl.searchParams.append("url", "https://bootpackdigital.com");

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
    <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f7fb] text-slate-950">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_15%_0%,#e0e7ff_0,transparent_32%),radial-gradient(circle_at_80%_8%,#dbeafe_0,transparent_29%)]" />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3 font-semibold tracking-tight"><Logo className="size-9 text-indigo-600" /><span>Screenshot Maker</span></a>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600"><a className="hidden transition hover:text-slate-950 sm:block" href="#how-it-works">How it works</a><a className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-indigo-700" href="#builder">Create a screenshot</a></nav>
        </header>
        <main id="top">
          <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-20">
            <div className="max-w-2xl"><p className="mb-6 inline-flex rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm">A screenshot API for the everyday web</p><h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">Turn any URL into a polished image.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Capture web pages at exactly the dimensions, format, and quality your workflow needs—using one simple request.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#builder" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">Build a request <Arrow /></a><a href="#how-it-works" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">See how it works <Arrow /></a></div></div>
            <div className="relative rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-indigo-950/10"><div className="overflow-hidden rounded-[1.45rem] border border-slate-200 bg-slate-950 p-4 text-sm shadow-inner"><div className="mb-8 flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-300" /><span className="size-2.5 rounded-full bg-emerald-400" /></div><p className="font-mono text-slate-400">GET <span className="text-indigo-300">/api/screenshot</span></p><div className="mt-5 space-y-2 font-mono text-xs leading-6 sm:text-sm"><p><span className="text-cyan-300">url</span><span className="text-slate-500">=</span><span className="text-amber-200">https://your-site.com</span></p><p><span className="text-cyan-300">width</span><span className="text-slate-500">=</span><span className="text-amber-200">1512</span> <span className="text-slate-600">&amp;</span> <span className="text-cyan-300">height</span><span className="text-slate-500">=</span><span className="text-amber-200">982</span></p><p><span className="text-cyan-300">type</span><span className="text-slate-500">=</span><span className="text-amber-200">webp</span></p></div><div className="mt-8 flex items-center gap-3 rounded-xl bg-emerald-400/10 p-3 text-xs text-emerald-200"><span className="size-2 rounded-full bg-emerald-400" /> Returns an image, ready to use.</div></div></div>
          </section>
          <section id="how-it-works" className="border-y border-slate-200 bg-white py-20 sm:py-24"><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="max-w-xl"><p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">How it works</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From URL to image in three small steps.</h2></div><div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-7">{[["01", "Choose a page", "Pass the address of the site you want to capture."], ["02", "Set the frame", "Optionally tune the viewport, full-page capture, format, and quality."], ["03", "Use the image", "Open the generated URL anywhere you need a fresh screenshot."]].map(([number, title, text]) => <div key={number} className="border-t border-slate-200 pt-5 md:pr-7"><span className="font-mono text-sm text-indigo-600">{number}</span><h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></div>)}</div></div></section>
          <section id="builder" className="mx-auto max-w-6xl px-6 py-20 sm:py-28 lg:px-8"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">Request builder</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Make your first capture.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">Your settings become a shareable API URL. Open it to generate the image.</p></div><UrlBuilderForm /></section>
          <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-8"><div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-9"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">A simple starting point</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">Use a request URL directly.</h2></div><Link href={exampleUrl.toString()} target="_blank" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Try the example <Arrow /></Link></div><code className="mt-7 block overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6 text-indigo-100 sm:text-sm">{exampleUrl.toString()}</code><details className="group mt-8 border-t border-slate-200 pt-5"><summary className="cursor-pointer list-none text-sm font-semibold text-slate-800"><span className="flex items-center justify-between">API parameters <span className="text-indigo-600 transition group-open:rotate-45">+</span></span></summary><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="pb-3 font-medium">Name</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Default</th><th className="pb-3 font-medium">Description</th></tr></thead><tbody>{args.map(([name, type, defaultValue, description]) => <tr className="border-b border-slate-100 last:border-0" key={name}><td className="py-3 font-mono text-indigo-700">{name}</td><td className="py-3 font-mono text-xs text-slate-500">{type}</td><td className="py-3 font-mono text-xs text-slate-500">{defaultValue}</td><td className="py-3 text-slate-600">{description}</td></tr>)}</tbody></table></div></details></div></section>
        </main>
      </div>
      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>©2023–{new Date().getFullYear()} Bootpack Digital</span><a className="font-medium text-slate-700 hover:text-indigo-700" href="https://github.com/michaelbonner/screenshot-maker">View on GitHub</a></div></footer>
    </div>
  );
}
