import { SiteHeader } from "@/components/layout/site-header";

const capabilities = [
  { number: "01", title: "Know what is on hand", copy: "Maintain a dependable record of critical materials and every movement that changes their balance." },
  { number: "02", title: "Catch shortages early", copy: "Compare live quantities with reorder levels and suppress repeated alerts until stock recovers." },
  { number: "03", title: "Reach the right people", copy: "Use Africa's Talking SMS for manager alerts and supplier restock requests, even beyond the office Wi-Fi." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <SiteHeader />
      <main>
        <section className="border-b border-[var(--line)]">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.35fr_0.65fr] lg:px-10 lg:py-28">
            <div>
              <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Engineering foundation ready</div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Inventory intelligence for manufacturers.</h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">Track critical materials, detect shortages early, and notify the right people before production stops.</p>
              <div className="mt-10 flex flex-wrap gap-3"><a className="button-primary" href="#mvp">Explore the MVP</a><a className="button-secondary" href="/api/health">Check service health</a></div>
            </div>
            <aside className="self-end border-l-2 border-[var(--accent)] bg-white p-7 shadow-[0_18px_50px_rgba(18,24,22,0.07)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Build status</p><p className="mt-5 text-2xl font-semibold">Foundation</p>
              <p className="mt-2 leading-7 text-[var(--muted)]">The application shell, database design, integration boundaries, Docker image, and CI are established.</p>
              <div className="mt-6 border-t border-[var(--line)] pt-5 text-sm font-medium text-[var(--accent-dark)]">Next: inventory vertical slice →</div>
            </aside>
          </div>
        </section>
        <section id="mvp" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-12 max-w-2xl"><p className="eyebrow">Core operating loop</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">From stock movement to action</h2></div>
          <div className="grid border-y border-[var(--line)] md:grid-cols-3">
            {capabilities.map((capability) => <article key={capability.number} className="border-b border-[var(--line)] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><p className="font-mono text-xs text-[var(--accent-dark)]">{capability.number}</p><h3 className="mt-6 text-xl font-semibold">{capability.title}</h3><p className="mt-3 leading-7 text-[var(--muted)]">{capability.copy}</p></article>)}
          </div>
          <div className="mt-14 flex flex-col justify-between gap-6 bg-[var(--ink)] px-7 py-8 text-white sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Designed for the floor</p><p className="mt-2 max-w-2xl text-xl font-medium">SMS first. USSD next. Clear operations on the devices teams already use.</p></div><span className="whitespace-nowrap text-sm text-zinc-400">Africa&apos;s Talking + Supabase</span></div>
        </section>
      </main>
      <footer className="border-t border-[var(--line)] px-6 py-8 text-sm text-[var(--muted)] lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row"><span>StockSignal</span><span>Manufacturing inventory communication</span></div></footer>
    </div>
  );
}
