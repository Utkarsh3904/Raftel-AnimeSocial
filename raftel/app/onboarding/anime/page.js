"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { searchAnime } from "@/lib/anilist"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function AnimeSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedAnime, setSelectedAnime] = useState([])
  const router = useRouter()

  useEffect(() => {
    const handler = setTimeout(() => {
      searchAnime(searchQuery).then(setResults)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const handleSelectAnime = (anime) => {
    const alreadySelected = selectedAnime.some(a => a.id === anime.id)
    if (alreadySelected) {
      setSelectedAnime(prev => prev.filter(a => a.id !== anime.id))
      return
    }
    if (selectedAnime.length >= 5) {
      toast.error("Max 5 anime allowed")
      return
    }
    setSelectedAnime(prev => [...prev, anime])
  }

  const handleFinish = async () => {
    if (selectedAnime.length === 0) {
      toast.error("Pick at least 1 anime")
      return
    }
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ top5Anime: selectedAnime, onBoard: true }),
      })
      if (res.ok) {
        toast.success("You're all set!")
        router.push("/")
      } else {
        toast.error("Failed to save anime")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen w-screen bg-black flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Pick Your Top 5</h1>
          <p className="text-zinc-500 text-sm mt-2">Choose the anime that define you</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black border border-zinc-800 text-white rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all mb-6"
        />

        {/* Selected count */}
        <p className="text-zinc-500 text-sm mb-4">{selectedAnime.length}/5 selected</p>

        {/* Selected anime pills */}
        {selectedAnime.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedAnime.map((anime) => (
              <div
                key={anime.id}
                onClick={() => handleSelectAnime(anime)}
                className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-orange-500/30 transition"
              >
                <img src={anime.coverImage.medium} className="w-4 h-4 rounded-full object-cover" />
                {anime.title.romaji}
                <span className="text-orange-300">✕</span>
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {results.map((anime) => {
            const isSelected = selectedAnime.some(a => a.id === anime.id)
            return (
              <div
                key={anime.id}
                onClick={() => handleSelectAnime(anime)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200
                  ${isSelected
                    ? "border-orange-500 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "border-zinc-800 hover:border-orange-500/50"
                  }`}
              >
                <img
                  src={anime.coverImage.medium}
                  alt={anime.title.romaji}
                  className="w-full aspect-[3/4] object-cover"
                />
                <p className="text-xs text-center text-zinc-300 px-1 py-2 truncate">
                  {anime.title.romaji}
                </p>
              </div>
            )
          })}
        </div>

        {/* Finish button */}
        <Button
          onClick={handleFinish}
          className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.25)]"
        >
          Finish →
        </Button>

      </div>
    </div>
  )
}