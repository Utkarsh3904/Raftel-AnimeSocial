"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { timeAgo } from "@/lib/timeago"

function DiscussionCard({ post }) {
  const router = useRouter()
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)
  const [votedUp, setVotedUp] = useState(post.userVote === "up")

  useEffect(() => {
    fetch(`/api/comments?pollId=${post._id}`)
      .then((res) => res.json())
      .then((data) => setCommentCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {})
  }, [post._id])

  const handleUpvote = async (e) => {
    e.stopPropagation()
    const newState = votedUp ? "none" : "up"
    const prev = votedUp
    setVotedUp(!votedUp)
    setUpvotes((n) => (prev ? n - 1 : n + 1))
    try {
      const res = await fetch(`/api/posts/${post._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType: newState }),
      })
      const data = await res.json()
      if (res.ok && data.post) setUpvotes(data.post.upvotes)
    } catch {
      setVotedUp(prev)
      setUpvotes((n) => (prev ? n + 1 : n - 1))
    }
  }

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return
    router.push(`/post/${post._id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="rounded-3xl border border-white/10 bg-zinc-950/60 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl cursor-pointer hover:border-white/20 transition p-5"
    >
      <div className="flex items-center gap-2.5 text-xs text-zinc-500">
        {post.isAiGenerated ? (
          <div className="flex items-center gap-2">
            <Image
              src="/vegapunk.jpg"
              alt="Vegapunk AI"
              width={32}
              height={32}
              loading="lazy"
              className="h-8 w-8 rounded-xl object-cover ring-1 ring-white/10"
            />
            <span className="font-medium text-zinc-300">Vegapunk AI</span>
          </div>
        ) : (
          <>
            <Link
              href={`/profile/${post.createdBy?.username}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:text-zinc-300 transition"
            >
              <Image
                src={post.createdBy?.avatar}
                alt={post.createdBy?.username}
                width={32}
                height={32}
                className="h-8 w-8 rounded-xl object-cover ring-1 ring-white/10"
              />
              <span className="font-medium text-zinc-300">{post.createdBy?.username}</span>
            </Link>
            <span className="text-zinc-600">·</span>
          </>
        )}
        <span>{timeAgo(post.createdAt)}</span>
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 ml-auto">
          Discussion
        </span>
      </div>

      <h2 className="mt-3 text-base font-semibold text-white leading-snug">
        {post.question || post.body?.slice(0, 120)}
      </h2>

      {post.body && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
          {post.body.length > 300 ? post.body.slice(0, 300) + "..." : post.body}
        </p>
      )}

      {post.image && (
        <div className="mt-3 w-full max-h-96 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden">
          <Image
            src={post.image}
            alt="discussion"
            width={800}
            height={450}
            loading="lazy"
            className="w-full h-full object-contain max-h-96"
          />
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-500">
        <button
          onClick={handleUpvote}
          className="flex items-center gap-1 hover:text-orange-400 transition"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill={votedUp ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={votedUp ? "text-orange-400" : ""}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
          {upvotes > 0 && <span className={votedUp ? "text-orange-400" : ""}>{upvotes}</span>}
        </button>
        <Link
          href={`/post/${post._id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 hover:text-zinc-300 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {commentCount > 0 ? `${commentCount} Comments` : "Comment"}
        </Link>
      </div>
    </div>
  )
}

export default React.memo(DiscussionCard)
