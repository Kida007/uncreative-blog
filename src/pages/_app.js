import Link from "next/link";

import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { buttonVariants } from "@/components/ui/button";
import { Providers } from "@/components/ui/theme-provider";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
