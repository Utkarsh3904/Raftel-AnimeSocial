import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function POST(req, { params }) {
  const rateCheck = checkRateLimit(req, 30, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  if (!id) return Response.json({ error: "Post ID required" }, { status: 400 })

  const { voteType } = await req.json()
  if (!["up", "down", "none"].includes(voteType)) {
    return Response.json({ error: "Invalid vote type" }, { status: 400 })
  }

  try {
    await connectDB()
    const user = await User.findOne({ clerkId })
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    const post = await Poll.findById(id)
    if (!post) return Response.json({ error: "Post not found" }, { status: 404 })

    const userIdStr = user._id.toString()
    const wasUpvoted = post.upvotedBy.some((uid) => uid.toString() === userIdStr)
    const wasDownvoted = post.downvotedBy.some((uid) => uid.toString() === userIdStr)

    const update = {}
    if (voteType === "up") {
      if (wasUpvoted) {
        update.$pull = { upvotedBy: user._id }
        update.$inc = { upvotes: -1 }
      } else {
        update.$addToSet = { upvotedBy: user._id }
        update.$inc = { upvotes: 1 }
        if (wasDownvoted) {
          update.$pull = { downvotedBy: user._id }
          update.$inc.downvotes = -1
        }
      }
    } else if (voteType === "down") {
      if (wasDownvoted) {
        update.$pull = { downvotedBy: user._id }
        update.$inc = { downvotes: -1 }
      } else {
        update.$addToSet = { downvotedBy: user._id }
        update.$inc = { downvotes: 1 }
        if (wasUpvoted) {
          update.$pull = { upvotedBy: user._id }
          update.$inc.upvotes = -1
        }
      }
    } else {
      if (wasUpvoted) {
        update.$pull = { upvotedBy: user._id }
        update.$inc = { upvotes: -1 }
      }
      if (wasDownvoted) {
        update.$pull = { downvotedBy: user._id }
        update.$inc = { downvotes: -1 }
      }
    }

    const updated = await Poll.findByIdAndUpdate(id, update, { new: true })
      .populate("createdBy", "username avatar")
      .lean()

    if (voteType !== "none" && post.createdBy && post.createdBy.toString() !== userIdStr) {
      const repChange = voteType === "up" ? 1 : -1
      User.findByIdAndUpdate(post.createdBy, { $inc: { reputation: repChange } }).catch(console.error)
    }

    const plain = { ...updated, _id: updated._id.toString() }
    if (plain.createdBy) plain.createdBy = { ...plain.createdBy, _id: plain.createdBy._id.toString() }

    return Response.json({ post: plain }, { status: 200 })
  } catch (error) {
    console.error("Error voting:", error)
    return Response.json({ error: "Failed to vote" }, { status: 500 })
  }
}
