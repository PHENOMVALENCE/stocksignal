import Link from "next/link";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/notifications", label: "Notifications" },
];

interface AppShellProps {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, eyebrow, title, description, actions }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-8 px-6 lg:px-10">
          <Link className="flex items-center gap-3 font-semibold tracking-[-0.02em]" href="/">
            <span className="grid h-8 w-8 place-items-center bg-[var(--ink)] text-sm text-white">S</span>
            StockSignal
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm sm:flex">
            {navigation.map((item) => (
              <Link className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--muted)]">
            Operations
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p> : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
