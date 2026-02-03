"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <Heart className="w-6 h-6 fill-brand-500" />
          starboard
        </Link>
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />
          ) : session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
              >
                My Account
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
