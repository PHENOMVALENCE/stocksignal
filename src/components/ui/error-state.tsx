interface ErrorStateProps {
  title?: string;
  body: string;
}

export function ErrorState({ title = "Something went wrong", body }: ErrorStateProps) {
  return (
    <div className="border border-red-800 bg-red-50 px-6 py-5 text-red-950" role="alert">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 leading-7">{body}</p>
    </div>
  );
}
