import React from "react"
import Image from "next/image"

function RightSidebar({ user }) {
  if (!user) return null
  const { username, avatar, reputation, top5Anime } = user

  return (
    <aside className="hidden w-72 shrink-0 lg:sticky lg:top-20 lg:block lg:self-start lg:h-[calc(100dvh-5rem)]">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt={`${username}'s avatar`}
            width={48}
            height={48}
            className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
          />
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-white">{username}</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Reputation: <span className="text-zinc-300">{reputation}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Top 5 Anime</h3>
            <span className="text-[11px] text-zinc-500">{(top5Anime || []).length}/5</span>
          </div>

          <div className="mt-3 flex flex-1 flex-col gap-2 overflow-hidden">
            {(top5Anime || []).slice(0, 5).map((anime, index) => (
              <div key={index} className="group relative flex gap-2 min-h-0">
                <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {anime.coverImage?.medium ? (
                    <Image
                      src={anime.coverImage.medium}
                      alt={anime.title?.romaji || "Anime"}
                      width={72}
                      height={72}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-500">{index + 1}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0.5 left-0.5 right-0.5">
                    <span className="text-[9px] font-bold text-white drop-shadow-lg">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-white truncate">{anime.title?.romaji || "Unknown"}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{anime.title?.english || ""}</span>
                </div>
              </div>
            ))}
          </div>

          {(top5Anime || []).length === 0 && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-zinc-500">
              Pick your top anime in onboarding.
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default React.memo(RightSidebar)
