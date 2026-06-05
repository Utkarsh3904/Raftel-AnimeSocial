"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function Navbar({ user }) {
    if (!user) return null 
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-zinc-950 border-b border-zinc-800">
      
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-orange-500">
        Raftel
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
          Feed
        </Link>
        <Link href="/chat" className="text-sm text-zinc-400 hover:text-white transition">
          Chat
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* reputation badge */}
        {user && (
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs text-zinc-300">{user.reputation} rep</span>
          </div>
        )}
        {/* Clerk avatar + sign out dropdown */}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>

    </nav>
  )
}