"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

function LeftSidebar({ user }) {
  const pathname = usePathname()
  if (!user) return null

  const links = [
    { href: "/feed", label: "Feed" },
    { href: "/explore", label: "Explore"},
    { href: "/chat", label: "Messages"},
    { href: `/profile/${user.username}`, label: "Profile"},
  ]

  return (
    <aside className="hidden w-64 shrink-0 lg:sticky lg:top-20 lg:block lg:self-start lg:h-[calc(100dvh-5rem)]">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="flex-1 min-h-0 pr-1 space-y-6 overflow-x-hidden overflow-y-auto">
          <nav>
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href) && link.href !== "/feed")
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border border-white/10 bg-white/5 text-white"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className={isActive ? "text-orange-400" : "text-zinc-500"}>{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

        </div>

        <Link
          href="/create"
          className="mt-5 flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(249,115,22,0.25)] transition hover:bg-orange-400"
        >
          <span className="text-lg leading-none">+</span> Create Post
        </Link>
      </div>
    </aside>
  )
}

export default React.memo(LeftSidebar)
