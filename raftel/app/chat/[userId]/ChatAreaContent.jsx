"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ChatAreaContent({ otherUserId, otherUser }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${otherUserId}`)
        const data = await res.json()
        setMessages(data.messages || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [otherUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim()) return
    try {
      const res = await fetch(`/api/messages/${otherUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((prev) => [...prev, data.message])
        setText("")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 shrink-0">
        <Link href="/chat" className="text-zinc-500 hover:text-white transition mr-1">
          ←
        </Link>
        <Image
          src={otherUser?.avatar || "/default-avatar.png"}
          alt={otherUser?.username || "User"}
          width={36}
          height={36}
          className="h-9 w-9 rounded-2xl object-cover ring-1 ring-white/10"
        />
        <h2 className="text-sm font-bold text-white">
          {otherUser?.username || "User"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500 text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg._id || i} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.isMine
                    ? "bg-orange-500 text-black rounded-br-md"
                    : "bg-white/10 text-zinc-200 rounded-bl-md border border-white/10"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                {msg.createdAt && (
                  <p className={`mt-1 text-[10px] ${msg.isMine ? "text-black/60" : "text-zinc-500"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 px-5 py-4 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
