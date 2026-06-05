import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import PollCard from "@/components/PollCard"

export default async function FeedPage() {
  const { userId } = auth()
  await connectDB()

  const user = await User.findOne({ clerkId: userId }).lean()
  const plainUser = user ? { ...user, _id: user._id.toString() } : null

  const polls = await Poll.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "username avatar")
    .lean()

  const plainPolls = polls.map(poll => ({
    ...poll,
    _id: poll._id.toString(),
    createdBy: poll.createdBy ? {
      ...poll.createdBy,
      _id: poll.createdBy._id.toString()
    } : null
  }))

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar user={plainUser} />
      <div className="flex gap-6 p-6">
        <Sidebar user={plainUser} />
        <div className="flex-1 flex flex-col gap-4">
          {plainPolls.length === 0 ? (
            <p className="text-zinc-500 text-center mt-20">No polls yet. Check back soon.</p>
          ) : (
            plainPolls.map(poll => (
              <PollCard key={poll._id} poll={poll} />
            ))
          )}
        </div>
      </div>
    </main>
  )
}