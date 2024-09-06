// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
