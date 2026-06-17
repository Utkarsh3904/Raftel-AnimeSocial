"use client" 
import Link from "next/link"  

export default function Sidebar({ user }){

    if (!user) return null 
    const { username, avatar , reputation, top5Anime } = user

    return(

        <aside className="w-72 shrink-0">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={`${username}'s avatar`}
                className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-white">{username}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">Reputation: <span className="text-zinc-300">{reputation}</span></p>
              </div>
            </div>

            <nav className="mt-5">
              <ul className="space-y-1">
                <li>
                  <Link href="/feed" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-white bg-white/5 border border-white/10">
                    <span className="text-orange-400">⌂</span> Feed
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition">
                    <span className="text-zinc-500">⌕</span> Explore
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition">
                    <span className="text-zinc-500">✉</span> Messages
                  </Link>
                </li>
                <li>
                  <Link href={`/profile/${username}`} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition">
                    <span className="text-zinc-500">👤</span> Profile
                  </Link>
                </li>
              </ul>
            </nav>

            <Link
              href="/create"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-black shadow-[0_0_24px_rgba(249,115,22,0.25)] hover:bg-orange-400 transition"
            >
              <span className="text-lg leading-none">+</span> Create Post
            </Link>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Top 5 Anime</h3>
                <span className="text-[11px] text-zinc-500">{(top5Anime || []).length}/5</span>
              </div>

              <ul className="mt-3 space-y-2">
                {(top5Anime || []).slice(0, 5).map((anime, index) => (
                  <li key={index} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/5 text-[11px] font-bold text-zinc-300">
                      {index + 1}
                    </div>
                    <span className="truncate text-xs font-medium text-zinc-200">
                      {anime.title?.romaji || anime.title}
                    </span>
                  </li>
                ))}
                {(top5Anime || []).length === 0 && (
                  <li className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-zinc-500">
                    Pick your top anime in onboarding.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-4 px-2 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <span>© {new Date().getFullYear()} Raftel</span>
              <div className="flex gap-3">
                <Link href="/terms" className="hover:text-zinc-400">Terms</Link>
                <Link href="/privacy" className="hover:text-zinc-400">Privacy</Link>
              </div>
            </div>
          </div>
        </aside>
    )





}