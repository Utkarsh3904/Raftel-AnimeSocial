"use client";

import { useEffect, useState } from "react";
import FeedCard from "@/components/FeedCard";

export default function ExploreContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function searchPolls() {
      if (!debouncedSearch.trim()) {
        setPolls([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/polls/search?q=${encodeURIComponent(debouncedSearch)}`);
        const data = await res.json();
        setPolls(data.polls);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    searchPolls();
  }, [debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search polls..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/15"
      />

      {loading && <p className="mt-6 text-zinc-400">Searching...</p>}

      {!loading && polls.length === 0 && search && (
        <p className="mt-6 text-zinc-500">No polls found.</p>
      )}

      <div className="mt-8 space-y-6">
        {polls.map((poll) => (
          <FeedCard key={poll._id} post={{ ...poll, type: poll.type || "poll" }} />
        ))}
      </div>
    </div>
  );
}
