import connectDB from "@/lib/db"
import Vote from "@/models/Vote"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function POST(req) {
  const rateCheck = checkRateLimit(req, 30, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { pollId, optionIndex } = await req.json()

    if (pollId === undefined || optionIndex === undefined) {
      return Response.json({ error: "pollId and optionIndex are required" }, { status: 400 })
    }

    await connectDB()

    const [user, poll] = await Promise.all([
      User.findOne({ clerkId }),
      Poll.findById(pollId)
    ])

    if (!user) return Response.json({ error: "User not found" }, { status: 404 })
    if (!poll) return Response.json({ error: "Poll not found" }, { status: 404 })
    if (poll.type === "discussion") {
      return Response.json({ error: "Cannot vote on a discussion" }, { status: 400 })
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return Response.json({ error: "Invalid option index" }, { status: 400 })
    }

    const existingVote = await Vote.findOne({ userId: user._id, pollId })
    if (existingVote) {
      return Response.json({ error: "Already voted" }, { status: 400 })
    }

    const [updatedPoll] = await Promise.all([
      Poll.findByIdAndUpdate(
        poll._id,
        { $inc: { [`options.${optionIndex}.votes`]: 1, totalVotes: 1 } },
        { new: true }
      ).populate("createdBy", "username avatar"),
      new Vote({ userId: user._id, pollId, optionIndex }).save()
    ])

    if (updatedPoll.createdBy) {
      User.findByIdAndUpdate(
        updatedPoll.createdBy._id,
        { $inc: { reputation: 1 } }
      ).catch(err => console.error("Failed to update reputation:", err))
    }

    return Response.json(updatedPoll, { status: 200 })

  } catch (error) {
    console.error("Error creating vote:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
