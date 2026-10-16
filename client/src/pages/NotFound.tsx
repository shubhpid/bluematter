import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-5 text-center text-paper">
      <div className="flex max-w-lg flex-col items-center gap-6 rounded-lg border border-ink-line bg-ink-raised p-8">
        <AlertCircle className="size-12 text-signal" aria-hidden="true" />
        <h1 className="type-h2 text-4xl">Page not found</h1>
        <p className="text-slate-light">
          The page you are looking for may have moved or no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-semibold text-ink"
        >
          <Home className="size-4" aria-hidden="true" />
          Go home
        </Link>
      </div>
    </main>
  );
}
