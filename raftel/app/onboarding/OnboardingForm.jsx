"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import avatars from "@/lib/avatars"
import { Button } from "@/components/ui/button"

export default function OnboardingForm({ initialUsername = "", initialAvatar = avatars[0] }) {
  const [username, setUsername] = useState(initialUsername)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleContinue = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      toast.error("Please enter a username")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), avatar }),
      })

      if (res.ok) {
        toast.success("Profile saved!")
        router.push("/onboarding/anime")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Failed to save profile")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Complete Profile</h1>
          <p className="text-zinc-500 text-sm mt-2">Setup your anime identity</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-7">
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => setShowAvatarModal(true)} className="group relative">
              <div className="absolute inset-0 rounded-full bg-orange-500 blur-xl opacity-30 group-hover:opacity-50 transition" />
              <div className={`relative w-28 h-28 rounded-full p-[3px] transition-all duration-300 ${avatar ? "bg-orange-500" : "bg-zinc-700"}`}>
                <img src={avatar || avatars[0]} alt="avatar" className="w-full h-full rounded-full object-cover bg-black" />
              </div>
            </button>
            <button type="button" onClick={() => setShowAvatarModal(true)} className="mt-4 text-sm text-orange-500 hover:text-orange-400 transition">
              Change Avatar
            </button>
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-black border border-zinc-800 text-white rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.25)]"
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>

      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Choose Avatar</h2>
              <button onClick={() => setShowAvatarModal(false)} className="text-zinc-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {avatars.map((avt, index) => (
                <button type="button" key={index} onClick={() => { setAvatar(avt); setShowAvatarModal(false) }} className="group">
                  <div className={`relative w-20 h-20 rounded-full p-[4px] transition-all duration-300 ${avatar === avt ? "bg-orange-500 scale-110" : "bg-zinc-800 hover:bg-orange-500/70"}`}>
                    <img src={avt} alt={`avatar-${index}`} className="w-full h-full rounded-full object-cover bg-black" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
