interface EmptyStateProps {
  title: string;
  body: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-[var(--line)] bg-white px-6 py-12" role="status">
      <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 max-w-xl leading-7 text-[var(--muted)]">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
