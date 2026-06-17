"use client"

import { useState } from "react"

export default function PostVote({ post, onVoteChange }) {
  const [voteState, setVoteState] = useState(post.userVote || "none")
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)

  const handleVote = async (type) => {
    const newState = voteState === type ? "none" : type
    const prevState = voteState

    setVoteState(newState)
    if (prevState === "up") setUpvotes((n) => n - 1)
    if (newState === "up") setUpvotes((n) => n + 1)

    try {
      const res = await fetch(`/api/posts/${post._id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType: newState }),
      })
      const data = await res.json()
      if (res.ok && data.post) {
        setUpvotes(data.post.upvotes)
        if (onVoteChange) onVoteChange(data.post)
      }
    } catch {
      setVoteState(prevState)
      if (prevState === "up") setUpvotes((n) => n + 1)
      if (newState === "up") setUpvotes((n) => n - 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <button
        onClick={(e) => { e.stopPropagation(); handleVote("up") }}
        className={`transition rounded-full p-1.5 ${
          voteState === "up"
            ? "text-orange-400 bg-orange-500/10"
            : "text-zinc-500 hover:text-orange-400 hover:bg-orange-500/5"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <span className="text-xs font-bold text-orange-400 tabular-nums">
        {upvotes}
      </span>
    </div>
  )
}
