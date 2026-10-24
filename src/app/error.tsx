"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ErrorShell,
  primaryButtonClass,
  secondaryButtonClass,
} from "./components/ErrorShell";

export default function ErrorPage({
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
    <ErrorShell
      eyebrow="Something went wrong"
      title="This page didn't render."
      description="We hit an unexpected problem loading this page. Try again, and if it keeps happening, head back to the home page."
      status={
        digest ? `500 Server Error. Reference: ${digest}` : "500 Server Error."
      }
      statusTone="rose"
    >
      <button
        type="button"
        onClick={() => retry()}
        className={primaryButtonClass}
      >
        Try again
      </button>
      <Link href="/" className={secondaryButtonClass}>
        Back to home
      </Link>
    </ErrorShell>
  );
}
