"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <Link
            href="/"
            className={`text-sm font-semibold text-black transition-colors ${
              isActive("/")
                ? "text-black underline"
                : "text-black hover:underline"
            }`}
          >
            Event Types
          </Link>
          <Link
            href="/bookings"
            className={`text-sm font-semibold text-black transition-colors ${
              isActive("/bookings")
                ? "text-black underline"
                : "text-black hover:underline"
            }`}
          >
            Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}
