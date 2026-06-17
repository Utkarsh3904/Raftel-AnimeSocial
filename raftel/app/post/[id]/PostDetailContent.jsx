"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { timeAgo } from "@/lib/timeago"

export default function PostDetailContent({ post, currentUserId }) {
  const [localPost, setLocalPost] = useState(post)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [loadingComments, setLoadingComments] = useState(true)
  const [sending, setSending] = useState(false)
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)
  const [votedUp, setVotedUp] = useState(post.userVote === "up")

  useEffect(() => {
    fetchComments()
  }, [post._id])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?pollId=${post._id}`)
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: post._id, text: commentText.trim() }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments((prev) => [newComment, ...prev])
        setCommentText("")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const data = await res.json()
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: data.comment?.likes || c.likes + 1, likedBy: [...(c.likedBy || []), currentUserId] }
              : c
          )
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpvote = async () => {
    const newState = votedUp ? "none" : "up"
    const prev = votedUp
    setVotedUp(!votedUp)
    setUpvotes((n) => (prev ? n - 1 : n + 1))
    try {
      const res = await fetch(`/api/posts/${localPost._id}/vote`, {
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleComment()
    }
  }

  const isPoll = localPost.type === "poll"
  const options = localPost.options || []
  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl p-6">
        <div className="flex items-center gap-2.5 text-xs text-zinc-500">
          {localPost.isAiGenerated ? (
            <div className="flex items-center gap-2">
              <Image
                src="/vegapunk.jpg"
                alt="Vegapunk AI"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
              />
              <span className="font-medium text-zinc-300">Vegapunk AI</span>
            </div>
          ) : (
            <>
              <Link href={`/profile/${localPost.createdBy?.username}`} className="flex items-center gap-1.5 hover:text-zinc-300 transition">
                <Image
                  src={localPost.createdBy?.avatar}
                  alt={localPost.createdBy?.username}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
                />
                <span className="font-medium text-zinc-300">{localPost.createdBy?.username}</span>
              </Link>
              <span className="text-zinc-600">·</span>
            </>
          )}
          <span>{timeAgo(localPost.createdAt)}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ml-2 ${
            isPoll
              ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
              : "border-blue-500/30 bg-blue-500/10 text-blue-400"
          }`}>
            {isPoll ? "Poll" : "Discussion"}
          </span>
        </div>

        <h1 className="mt-4 text-xl font-bold text-white leading-snug">
          {localPost.question}
        </h1>

        {!isPoll && localPost.body && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {localPost.body}
          </p>
        )}

        {localPost.image && (
          <div className="mt-4 w-full max-h-96 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center overflow-hidden">
            <Image
              src={localPost.image}
              alt="post"
              width={800}
              height={450}
              className="w-full h-full object-contain max-h-96"
            />
          </div>
        )}

        {isPoll && (
          <div className="mt-5 flex flex-col gap-2">
            {options.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
              return (
                <div key={index} className="relative w-full rounded-xl overflow-hidden border border-white/10 h-10 bg-white/5">
                  <div className="absolute left-0 top-0 h-full bg-white/10" style={{ width: `${percentage}%` }} />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-sm font-medium text-white">{option.text}</span>
                    <span className="text-xs font-bold text-zinc-400">
                      {option.votes} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
            <p className="text-xs text-zinc-500 mt-1">{totalVotes.toLocaleString()} total votes</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500 border-t border-white/10 pt-4">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 hover:text-orange-400 transition"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill={votedUp ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={votedUp ? "text-orange-400" : ""}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {upvotes > 0 && <span className={votedUp ? "text-orange-400 font-semibold" : ""}>{upvotes}</span>}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl p-6">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Comments ({comments.length})
        </h3>

        <div className="flex gap-2 mb-5">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40"
          />
          <button
            onClick={handleComment}
            disabled={!commentText.trim() || sending}
            className="rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-orange-400 transition disabled:opacity-40"
          >
            {sending ? "..." : "Post"}
          </button>
        </div>

        {loadingComments ? (
          <p className="text-xs text-zinc-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-zinc-500">No comments yet. Start the discussion.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => {
              const alreadyLiked = c.likedBy?.includes(currentUserId)
              return (
                <div key={c._id} className="flex gap-3">
                  <Link href={`/profile/${c.userId?.username}`} onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={c.userId?.avatar}
                      alt={c.userId?.username}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                    />
                  </Link>
                  <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link
                          href={`/profile/${c.userId?.username}`}
                          className="text-xs font-semibold text-zinc-300 hover:text-orange-400 transition truncate"
                        >
                          {c.userId?.username}
                        </Link>
                        <span className="text-[10px] text-zinc-600 shrink-0">{timeAgo(c.createdAt)}</span>
                      </div>
                      <button
                        onClick={() => handleLikeComment(c._id)}
                        disabled={alreadyLiked}
                        className="flex items-center gap-1 text-zinc-500 hover:text-red-400 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={alreadyLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={alreadyLiked ? "text-red-400" : ""}>
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {c.likes > 0 && <span className="text-[11px]">{c.likes}</span>}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-zinc-200">{c.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
