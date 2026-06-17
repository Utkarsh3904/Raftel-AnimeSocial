"use client"

import Link from "next/link"
import Image from "next/image"
import UserAvatar from "@/components/UserAvatar"

export default function Navbar({ user }) {
  if (!user) return null
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <nav className="flex items-center justify-between w-full gap-4 px-5 py-2 mx-auto max-w-7xl">
        <Link href="/feed" className="flex items-center gap-3">
          <Image
            src="/sailboat.png"
            alt="Raftel"
            width={36}
            height={36}
            className="object-cover h-9 w-9 rounded-xl"
          />
          <div className="leading-none">
            <div className="text-base font-extrabold tracking-tight text-white">Raftel</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full  px-3 py-1.5">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-xs font-medium text-zinc-200">{user.reputation} rep</span>
          </div>
          <UserAvatar user={user} />
        </div>
      </nav>
    </div>
  )
}
