import connectDB from "@/lib/db"
import Comment from "@/models/Comment"
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

  const { id: commentId } = await params
  if (!commentId) return Response.json({ error: "Comment ID is required" }, { status: 400 })

  await connectDB()

  const user = await User.findOne({ clerkId })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const comment = await Comment.findById(commentId)
  if (!comment) return Response.json({ error: "Comment not found" }, { status: 404 })

  const alreadyLiked = comment.likedBy.some((id) => id.toString() === user._id.toString())
  if (alreadyLiked) {
    return Response.json({ error: "Already liked" }, { status: 400 })
  }

  if (comment.userId.toString() === user._id.toString()) {
    return Response.json({ error: "Cannot like your own comment" }, { status: 400 })
  }

  await Comment.findByIdAndUpdate(commentId, {
    $inc: { likes: 1 },
    $push: { likedBy: user._id }
  })

  await User.findByIdAndUpdate(comment.userId, { $inc: { reputation: 1 } })

  const populated = await Comment.findById(commentId).populate("userId", "username avatar")

  return Response.json({ comment: populated, message: "Comment liked" }, { status: 200 })
}
