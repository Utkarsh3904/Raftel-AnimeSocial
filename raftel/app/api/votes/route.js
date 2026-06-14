import connectDB from "@/lib/db"
import Vote from "@/models/Vote"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function POST(req) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { pollId, optionIndex } = await req.json()

    // ✅ Validate required fields early
    if (pollId === undefined || optionIndex === undefined) {
      return Response.json({ error: "pollId and optionIndex are required" }, { status: 400 })
    }

    await connectDB()

    const [user, poll] = await Promise.all([       // ✅ Fetch user & poll in parallel
      User.findOne({ clerkId }),
      Poll.findById(pollId)
    ])

    if (!user) return Response.json({ error: "User not found" }, { status: 404 })
    if (!poll) return Response.json({ error: "Poll not found" }, { status: 404 })

    // ✅ Validate optionIndex is within bounds
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return Response.json({ error: "Invalid option index" }, { status: 400 })
    }

    const existingVote = await Vote.findOne({ userId: user._id, pollId })
    if (existingVote) {
      return Response.json({ error: "Already voted" }, { status: 400 })
    }

    // ✅ Save vote and update poll in parallel
    const [updatedPoll] = await Promise.all([
      Poll.findByIdAndUpdate(
        poll._id,
        { $inc: { [`options.${optionIndex}.votes`]: 1, totalVotes: 1 } },
        { new: true }
      ).populate("createdBy", "username avatar"),
      new Vote({ userId: user._id, pollId, optionIndex }).save()
    ])

    // ✅ Reputation update with error isolation (don't fail the request if this fails)
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