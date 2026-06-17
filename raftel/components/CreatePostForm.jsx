"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"

export default function CreatePostForm() {
  const router = useRouter()
  const [postType, setPostType] = useState("discussion")
  const [question, setQuestion] = useState("")
  const [body, setBody] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [saving, setSaving] = useState(false)

  const isPoll = postType === "poll"

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      setImageBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)))
  }

  const addOption = () => {
    if (options.length >= 6) return
    setOptions((prev) => [...prev, ""])
  }

  const removeOption = (index) => {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        type: postType,
        image: imageBase64,
      }

      if (isPoll) {
        payload.question = question
        payload.options = options
      } else {
        payload.body = body
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(isPoll ? "Poll posted!" : "Discussion posted!")
        router.push("/feed")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to post")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
    >
      <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setPostType("discussion")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            !isPoll ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          Discussion
        </button>
        <button
          type="button"
          onClick={() => setPostType("poll")}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            isPoll ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          Poll
        </button>
      </div>

      {isPoll ? (
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Question</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Who is the best strategist in anime?"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
            required
          />
        </div>
      ) : (
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-zinc-300">Content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your hot take, theory, or debate starter..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
            required
          />
        </div>
      )}

      {isPoll && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Options</label>
            <button
              type="button"
              onClick={addOption}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              + Add option
            </button>
          </div>
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={opt}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-xl border border-white/10 px-3 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-zinc-300">Image (optional)</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={800}
            height={200}
            className="mt-3 max-h-48 w-full rounded-2xl border border-white/10 object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:bg-orange-400 transition disabled:opacity-60"
      >
        {saving ? "Posting..." : "Post"}
      </button>
    </form>
  )
}
