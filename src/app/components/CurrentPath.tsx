"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Read the path from the browser after hydration. The 404 page is prerendered
// once and served for every missing URL, so the server can't know the path.
export const CurrentPath = () => {
  const path = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  );
  return <>{path}</>;
};
