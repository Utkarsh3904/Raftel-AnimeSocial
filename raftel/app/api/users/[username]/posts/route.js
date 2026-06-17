import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function GET(req, { params }) {
  const { username } = await params

  await connectDB()

  const user = await User.findOne({ username }).lean()
  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  const { userId: clerkId } = await auth()
  let isOwner = false
  if (clerkId) {
    const currentUser = await User.findOne({ clerkId }).lean()
    if (currentUser && currentUser._id.toString() === user._id.toString()) {
      isOwner = true
    }
  }

  if (!isOwner && user.pollsPrivate) {
    return Response.json({ posts: [], user, isOwner }, { status: 200 })
  }

  const posts = await Poll.find({ createdBy: user._id })
    .sort({ createdAt: -1 })
    .populate("createdBy", "username avatar")
    .lean()

  const plainPosts = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    type: post.type || "poll",
    createdBy: post.createdBy
      ? { ...post.createdBy, _id: post.createdBy._id.toString() }
      : null,
  }))

  return Response.json({ posts: plainPosts, user, isOwner }, { status: 200 })
}
