"use client";

import { useEffect } from "react";
import { Logo } from "./components/Logo";

// Replaces the root layout when it fails, so nothing from layout.tsx (fonts,
// globals.css, Tailwind) is available here. Styles are inline on purpose.
const fontStack =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string"
      ? error.digest
      : undefined;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily: fontStack,
          color: "#020617",
          background:
            "radial-gradient(circle at 15% 0%, #e0e7ff 0, transparent 32%), radial-gradient(circle at 80% 8%, #dbeafe 0, transparent 29%), #f7f7fb",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <title>Something went wrong | Screenshot Maker</title>
        <main
          style={{
            width: "100%",
            maxWidth: "32rem",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "1.5rem",
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(30, 27, 75, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                display: "block",
                width: 36,
                height: 36,
                color: "#4f46e5",
              }}
            >
              <Logo />
            </span>
            <span>Screenshot Maker</span>
          </div>
          <h1
            style={{
              margin: "2rem 0 0",
              fontSize: "2rem",
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              fontWeight: 600,
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              margin: "1rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#475569",
            }}
          >
            The app hit an unexpected problem and couldn&apos;t load. Try again,
            or reload the home page.
          </p>
          {digest ? (
            <p
              style={{
                margin: "1.25rem 0 0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.75rem",
                color: "#64748b",
              }}
            >
              Reference: {digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                cursor: "pointer",
                border: 0,
                borderRadius: "9999px",
                background: "#4f46e5",
                color: "#fff",
                padding: "0.75rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              Try again
            </button>
            {/* A plain anchor forces a full reload, which re-runs the root layout. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#334155",
                padding: "0.75rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
