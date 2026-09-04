import Link from "next/link";
const navigation = ["Dashboard", "Inventory", "Notifications"];
export function SiteHeader() {
  return <header className="border-b border-[var(--line)] bg-[var(--surface)]"><div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10"><Link className="flex items-center gap-3 font-semibold tracking-[-0.02em]" href="/"><span className="grid h-8 w-8 place-items-center bg-[var(--ink)] text-sm text-white">S</span> StockSignal</Link><nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm text-[var(--muted)] sm:flex">{navigation.map((item) => <span className="cursor-not-allowed" key={item} title="Planned MVP route">{item}</span>)}</nav><span className="border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--muted)]">Foundation</span></div></header>;
}
