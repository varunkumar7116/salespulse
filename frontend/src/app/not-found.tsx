"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-8xl font-black tracking-tighter text-blue-500">
          404
        </h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-zinc-400 max-w-sm mx-auto">
          The analytics report or section you are looking for does not exist or
          has been relocated.
        </p>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <MoveLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
