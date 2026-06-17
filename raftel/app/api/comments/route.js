import connectDB from "@/lib/db"
import Comment from "@/models/Comment"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req) {
  const rateCheck = checkRateLimit(req, 30, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const pollId = new URL(req.url).searchParams.get("pollId")

  await connectDB()

  const comments = await Comment
    .find({ pollId })
    .sort({ createdAt: -1 })
    .populate("userId", "username avatar")
    .lean()

  return Response.json(comments, { status: 200 })
}

export async function POST(req) {
  const rateCheck = checkRateLimit(req, 10, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { pollId, text } = await req.json()

  if (!pollId) return Response.json({ error: "Poll ID required" }, { status: 400 })
  if (!text || text.trim() === "") return Response.json({ error: "Text required" }, { status: 400 })

  await connectDB()

  const user = await User.findOne({ clerkId })
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const newComment = new Comment({ userId: user._id, pollId, text })
  await newComment.save()
  const populated = await newComment.populate("userId", "username avatar")

  return Response.json(populated, { status: 201 })
}
