import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-display-2 font-medium">404</h1>
        <p className="text-lg text-foreground-muted">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

