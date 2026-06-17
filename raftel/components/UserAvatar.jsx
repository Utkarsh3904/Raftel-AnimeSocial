"use client"

import React, { useEffect, useRef, useState } from "react"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"

function UserAvatar({ user }) {
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user?.avatar) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full ring-2 ring-zinc-800 hover:ring-orange-500/50 transition-all"
        aria-label="Open account menu"
      >
        <Image
          src={user.avatar}
          alt={user.username}
          width={36}
          height={36}
          className="w-9 h-9 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
          </div>
          <Link
            href={`/profile/${user.username}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
