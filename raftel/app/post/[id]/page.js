import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import FeedLayout from "@/components/FeedLayout"
import PostDetailContent from "./PostDetailContent"
import { redirect } from "next/navigation"

function serialize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default async function PostDetailPage({ params }) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await connectDB()

  const user = await User.findOne({ clerkId: userId }).lean()
  if (!user || !user.onBoard) {
    if (user?.username && user?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  const { id } = await params
  const post = await Poll.findById(id).populate("createdBy", "username avatar").lean()

  if (!post) return <div className="text-white text-center mt-20">Post not found</div>

  const plainUser = { ...user, _id: user._id.toString() }
  const plainPost = {
    ...post,
    _id: post._id.toString(),
    type: post.type || "poll",
    createdBy: post.createdBy
      ? { ...post.createdBy, _id: post.createdBy._id.toString() }
      : null,
    upvotedBy: post.upvotedBy?.map((id) => id.toString()) || [],
    downvotedBy: post.downvotedBy?.map((id) => id.toString()) || [],
  }

  return (
    <FeedLayout user={serialize(plainUser)} hideRightSidebar>
      <PostDetailContent post={serialize(plainPost)} currentUserId={plainUser._id} />
    </FeedLayout>
  )
}
