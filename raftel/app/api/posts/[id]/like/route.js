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

  try {
    await connectDB()

    const user = await User.findOne({ clerkId })
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    const post = await Poll.findById(id)
    if (!post) return Response.json({ error: "Post not found" }, { status: 404 })
    if (post.type !== "discussion") {
      return Response.json({ error: "Only discussions can be liked" }, { status: 400 })
    }

    const alreadyLiked = post.likedBy.some((uid) => uid.toString() === user._id.toString())
    if (alreadyLiked) {
      return Response.json({ error: "Already liked" }, { status: 400 })
    }

    if (post.createdBy?.toString() === user._id.toString()) {
      return Response.json({ error: "Cannot like your own post" }, { status: 400 })
    }

    const updated = await Poll.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 }, $push: { likedBy: user._id } },
      { new: true }
    ).populate("createdBy", "username avatar")

    if (post.createdBy) {
      User.findByIdAndUpdate(post.createdBy, { $inc: { reputation: 1 } }).catch(console.error)
    }

    return Response.json({ post: updated }, { status: 200 })
  } catch (error) {
    console.error("Error liking post:", error)
    return Response.json({ error: "Failed to like post" }, { status: 500 })
  }
}
