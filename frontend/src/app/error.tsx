"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error telemetry
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
      <div className="space-y-4 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          System Exception
        </h1>
        <p className="text-zinc-400">
          An unexpected error occurred while executing analytics computations or
          rendering layout views.
        </p>
        {error.message && (
          <pre className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-left text-xs font-mono text-zinc-500 overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-semibold transition"
          >
            Retry Operation
          </button>
        </div>
      </div>
    </div>
  );
}
