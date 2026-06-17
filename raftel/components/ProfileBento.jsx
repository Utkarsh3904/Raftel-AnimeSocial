"use client";
import Image from "next/image";

export default function ProfileBento ({ user }){

    const { username, avatar, top5Anime, reputation } = user;

    return (

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-md mx-auto">

            <div className="flex items-center space-x-4">
                <Image src={avatar} alt={username} width={64} height={64} className="w-16 h-16 rounded-full" />
                <div>
                    <h2 className="text-xl font-bold">{username}</h2>
                    <p className="text-gray-600">Reputation: {reputation}</p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mt-4">Top 5 Anime</h3>
                <ul className="list-disc list-inside ">
                    {top5Anime.map((anime, index) => (
                        <li key={index}>{anime.title?.romaji || anime.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}