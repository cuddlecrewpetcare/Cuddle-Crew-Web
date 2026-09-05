'use client';
/* eslint-disable @next/next/no-html-link-for-pages */

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="shell">
        <section className="subhero fallback-page">
          <p className="eyebrow">Something went wrong</p>
          <h1>We couldn&apos;t load this page.</h1>
          <p className="lede">
            Please try again. If the problem continues, Lauren can help you find what you need.
          </p>

          <div className="actions">
            <button className="button" type="button" onClick={reset}>
              Try again
            </button>

            <a className="button secondary" href="/">
              Home
            </a>

            <a className="text-link" href="/contact">
              Contact Lauren →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
