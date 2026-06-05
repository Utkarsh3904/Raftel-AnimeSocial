"use client" 
import Link from "next/link"  

export default function Sidebar({ user }){

    if (!user) return null 
    const { username, avatar , reputation, top5Anime } = user

    return(

        <aside>
      {/* avatar */}
      <div>
        <img src={avatar} alt={`${username}'s avatar`} width={80} height={80} className="rounded-full" />
      </div>

      {/* username */}
      <h2 className="text-xl font-bold">{username}</h2>

      {/* reputation */}
      <p className="text-sm text-gray-500">Reputation: {reputation}</p>

      {/* top 5 anime list */}
      <div>
        <h3 className="text-lg font-semibold mt-4">Top 5 Anime</h3>
        <ul className="list-disc list-inside">
          {top5Anime.map((anime, index) => (
            <li key={index}>{anime.title}</li>
          ))}
        </ul>
      </div>

      {/* nav links — Feed, Profile, Messages, Anime List */}
      <nav className="mt-6">
        <ul className="space-y-3">
          <li>
            <Link href="/feed" className="text-orange-500 hover:text-orange-400 transition">Feed</Link>
          </li>
          <li>
            <Link href="/profile" className="text-orange-500 hover:text-orange-400 transition">Profile</Link>
          </li>
          <li>
            <Link href="/messages" className="text-orange-500 hover:text-orange-400 transition">Messages</Link>
          </li>
          <li>
            <Link href="/anime-list" className="text-orange-500 hover:text-orange-400 transition">Anime List</Link>
          </li>
        </ul>
      </nav>
    </aside>
    )





}