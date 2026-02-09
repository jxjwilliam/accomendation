/**
 * Loading UI for locale routes. Shown during navigation or initial load.
 */
export default function LocaleLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6" role="status" aria-label="Loading">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
