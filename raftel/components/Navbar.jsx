"use client"

import Link from "next/link"
import UserAvatar from "@/components/UserAvatar"

export default function Navbar({ user }) {
  if (!user) return null
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/feed" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/30">
            <span className="text-orange-400 font-extrabold">R</span>
          </div>
          <div className="leading-none">
            <div className="text-base font-extrabold tracking-tight text-white">Raftel</div>
            <div className="mt-1 text-[11px] font-medium text-zinc-500">Your anime taste. Your identity.</div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <span className="text-sm">⌕</span>
            </div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
              placeholder="Search users, polls or anime..."
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
              ⌘ K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xs font-medium text-zinc-200">{user.reputation} rep</span>
          </div>
          <UserAvatar user={user} />
        </div>
      </nav>
    </div>
  )
}
