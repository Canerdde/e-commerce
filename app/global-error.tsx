"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-6 bg-background">
          <div className="text-center max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="text-display-3 font-light tracking-[-0.02em]">Something went wrong</h1>
              <p className="text-base text-foreground-muted leading-relaxed font-light">
                We encountered an unexpected error. Please try again.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground/10 text-xs font-medium tracking-wider uppercase hover:bg-background-secondary transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

