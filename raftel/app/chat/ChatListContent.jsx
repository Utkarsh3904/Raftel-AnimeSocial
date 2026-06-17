"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ChatListContent() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/messages/conversations")
        const data = await res.json()
        setConversations(data.conversations || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-10 text-center backdrop-blur-xl">
        <p className="text-zinc-400">Loading conversations...</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-10 text-center backdrop-blur-xl">
        <p className="text-zinc-400">No conversations yet.</p>
        <p className="mt-1 text-sm text-zinc-600">
          Find someone to talk to on the explore page.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-zinc-300">All Conversations</h2>
      </div>
      <div className="divide-y divide-white/5">
        {conversations.map((conv) =>
          conv.user ? (
            <Link
              key={conv.userId}
              href={`/chat/${conv.userId}`}
              className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/5"
            >
              <Image
                src={conv.user.avatar}
                alt={conv.user.username}
                width={40}
                height={40}
                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{conv.user.username}</span>
                  <span className="text-[11px] text-zinc-500">
                    {conv.lastMessageTime
                      ? new Date(conv.lastMessageTime).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {conv.lastMessage || "No messages"}
                </p>
              </div>
              {conv.unread && (
                <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
              )}
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}
