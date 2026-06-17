import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import FeedLayout from "@/components/FeedLayout"
import FeedCard from "@/components/FeedCard"
import { redirect } from "next/navigation"
import { shouldGeneratePoll } from "@/lib/vegapunkScheduler"

function serialize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

async function maybeGenerateAIPoll() {
  try {
    const should = await shouldGeneratePoll()
    if (!should) return
    const { generatePoll } = await import("@/lib/gemini")
    const pollData = await generatePoll()
    await Poll.create({
      type: "poll",
      question: pollData.question,
      options: pollData.options.map((opt) => ({ text: opt, votes: 0 })),
      isAiGenerated: true,
      createdBy: null,
    })
  } catch (err) {
    console.error("AI poll generation failed:", err)
  }
}

export default async function FeedPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) redirect("/")

  await connectDB()

  const user = await User.findOne({ clerkId }).lean()
  if (!user || !user.onBoard) {
    if (user?.username && user?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  const plainUser = serialize(user)

  // fire and forget — does not block page render
  maybeGenerateAIPoll()

  const privateUserIds = await User.find({ pollsPrivate: true }).distinct("_id")
  const privateIdStrings = privateUserIds.map((id) => id.toString())

  const posts = await Poll.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("createdBy", "username avatar")
    .lean()

  const plainPosts = posts
    .filter((post) => {
      if (!post.createdBy) return true
      const creatorId = post.createdBy._id?.toString()
      if (privateIdStrings.includes(creatorId) && creatorId !== plainUser._id) {
        return false
      }
      return true
    })
    .map((post) => {
      const userIdStr = plainUser._id
      const upvotedBy = (post.upvotedBy || []).map((id) => id.toString())
      const downvotedBy = (post.downvotedBy || []).map((id) => id.toString())

      let userVote = "none"
      if (upvotedBy.includes(userIdStr)) userVote = "up"
      else if (downvotedBy.includes(userIdStr)) userVote = "down"

      return serialize({
        ...post,
        _id: post._id.toString(),
        type: post.type || "poll",
        userVote,
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        upvotedBy: undefined,
        downvotedBy: undefined,
        createdBy: post.createdBy
          ? { ...post.createdBy, _id: post.createdBy._id.toString() }
          : null,
      })
    })

  return (
    <FeedLayout
      user={plainUser}
      title="Feed"
      subtitle="Hot takes, polls, and debates from your crew."
    >
      <div className="flex flex-col gap-4">
        {plainPosts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-10 text-center backdrop-blur-xl">
            <p className="text-zinc-400">No posts yet.</p>
            <p className="mt-1 text-sm text-zinc-600">Be the first to post something spicy.</p>
          </div>
        ) : (
          plainPosts.map((post) => <FeedCard key={post._id} post={post} />)
        )}
      </div>
    </FeedLayout>
  )
}