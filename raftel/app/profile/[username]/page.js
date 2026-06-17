import connectDB from "@/lib/db"
import User from "@/models/User"
import Poll from "@/models/Poll"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import LeftSidebar from "@/components/LeftSidebar"
import ProfileContent from "./ProfileContent"

function serialize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default async function ProfilePage({ params }) {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/")

  await connectDB()

  const currentUser = await User.findOne({ clerkId }).lean()
  if (!currentUser || !currentUser.onBoard) {
    if (currentUser?.username && currentUser?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  const { username } = await params
  const profileUser = await User.findOne({ username }).lean()

  if (!profileUser) return <div className="text-white text-center mt-20 py-20">User not found</div>

  const plainCurrentUser = { ...currentUser, _id: currentUser._id.toString() }
  const plainProfileUser = { ...profileUser, _id: profileUser._id.toString() }
  const isOwner = plainCurrentUser._id === plainProfileUser._id

  let posts = []
  if (isOwner || !profileUser.pollsPrivate) {
    const raw = await Poll.find({ createdBy: profileUser._id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar")
      .lean()

    posts = raw.map((post) => ({
      ...post,
      _id: post._id.toString(),
      type: post.type || "poll",
      userVote: "none",
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      createdBy: post.createdBy
        ? { ...post.createdBy, _id: post.createdBy._id.toString() }
        : null,
    }))
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-orange-600/15 blur-[120px]" />
        <div className="absolute top-24 -right-36 h-[460px] w-[460px] rounded-full bg-white/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <Navbar user={serialize(plainCurrentUser)} />

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-5 py-6">
        <LeftSidebar user={serialize(plainCurrentUser)} />

        <div className="min-w-0 flex-1">
          <ProfileContent
            profileUser={serialize(plainProfileUser)}
            currentUser={serialize(plainCurrentUser)}
            isOwner={isOwner}
            initialPosts={serialize(posts)}
          />
        </div>

        <aside className="w-72 shrink-0">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Top 5 Anime</h3>
              <span className="text-[11px] text-zinc-500">{(plainProfileUser.top5Anime || []).length}/5</span>
            </div>

            <div className="flex flex-col gap-3">
              {(plainProfileUser.top5Anime || []).slice(0, 5).map((anime, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="relative w-14 h-20 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    {anime.coverImage?.medium ? (
                      <Image
                        src={anime.coverImage.medium}
                        alt={anime.title?.romaji || "Anime"}
                        width={56}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5">
                        <span className="text-[10px] font-bold text-zinc-500">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/5 text-[10px] font-bold text-zinc-400">
                      {index + 1}
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-zinc-300 truncate">
                      {anime.title?.romaji || anime.title}
                    </p>
                  </div>
                </div>
              ))}
              {(plainProfileUser.top5Anime || []).length === 0 && (
                <p className="text-xs text-zinc-500">No anime selected yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
