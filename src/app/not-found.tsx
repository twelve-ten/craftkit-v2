import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-foreground px-4 py-2 text-background transition hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
