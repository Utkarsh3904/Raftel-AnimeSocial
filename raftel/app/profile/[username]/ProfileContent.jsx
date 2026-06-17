"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import FeedCard from "@/components/FeedCard"
import { getBadge, BADGES } from "@/lib/badges"
import { timeAgo } from "@/lib/timeago"

export default function ProfileContent({ profileUser, currentUser, isOwner, initialPosts }) {
  const [posts, setPosts] = useState(initialPosts)
  const [pollsPrivate, setPollsPrivate] = useState(profileUser.pollsPrivate || false)
  const [showBadgeInfo, setShowBadgeInfo] = useState(false)

  const badge = getBadge(profileUser.reputation || 0)

  const togglePrivacy = async () => {
    const newVal = !pollsPrivate
    setPollsPrivate(newVal)
    try {
      const res = await fetch(`/api/users/${profileUser.username}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollsPrivate: newVal }),
      })
      if (!res.ok) setPollsPrivate(!newVal)
    } catch {
      setPollsPrivate(!newVal)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-start gap-5">
          <Image
            src={profileUser.avatar}
            alt={profileUser.username}
            width={80}
            height={80}
            className="h-20 w-20 rounded-3xl object-cover ring-2 ring-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">{profileUser.username}</h1>
              {isOwner && (
                <Link
                  href={`/chat/${currentUser._id}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 transition"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            <div className="relative inline-flex items-center gap-1.5 mt-2">
              <span className="text-sm font-semibold text-orange-400">{badge.title}</span>
              <button
                onClick={() => setShowBadgeInfo(!showBadgeInfo)}
                className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white/10 text-[10px] text-zinc-400 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                i
              </button>
              {showBadgeInfo && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-2xl">
                  <p className="text-xs font-semibold text-zinc-300 mb-3">Reputation Levels</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {BADGES.map((b) => (
                      <div key={b.level} className="flex items-center justify-between text-xs">
                        <span className={profileUser.reputation >= b.minRep ? "text-orange-400 font-medium" : "text-zinc-500"}>
                          {b.title}
                        </span>
                        <span className="text-zinc-500">{b.minRep.toLocaleString()} RP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span>{profileUser.reputation} Reputation</span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>Joined {timeAgo(profileUser.createdAt)}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Private Profile</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {pollsPrivate
                  ? "Your posts are hidden from other users"
                  : "Your posts are visible to everyone"}
              </p>
            </div>
            <button
              onClick={togglePrivacy}
              className={`relative h-7 w-12 rounded-full transition ${
                pollsPrivate ? "bg-zinc-700" : "bg-orange-500"
              }`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  pollsPrivate ? "left-0.5" : "left-[1.35rem]"
                }`}
              />
            </button>
          </div>
        )}

        {!isOwner && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <Link
              href={`/chat/${profileUser._id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-orange-400 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>{posts.length} posts</span>
        {pollsPrivate && isOwner && (
          <span className="text-xs text-zinc-600">(hidden from others)</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-10 text-center backdrop-blur-xl">
            <p className="text-zinc-400">
              {isOwner
                ? pollsPrivate
                  ? "Your posts are private. Toggle the switch above to share them."
                  : "You haven't posted anything yet."
                : "No posts yet."}
            </p>
          </div>
        ) : (
          posts.map((post) => <FeedCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  )
}
