import type { Metadata } from "next";
import Link from "next/link";
import {
  ErrorShell,
  primaryButtonClass,
  secondaryButtonClass,
} from "./components/ErrorShell";

export const metadata: Metadata = {
  title: "Page not found | Screenshot Maker",
};

export default function NotFound() {
  return (
    <ErrorShell
      eyebrow="404 · Page not found"
      title="Nothing here to capture."
      description="The page you asked for doesn't exist or has moved. Head back to the home page to build a screenshot request."
      status="404 Not Found. No page lives at this address."
      statusTone="amber"
    >
      <Link href="/" className={primaryButtonClass}>
        Back to home
      </Link>
      <Link href="/#builder" className={secondaryButtonClass}>
        Build a request
      </Link>
    </ErrorShell>
  );
}
