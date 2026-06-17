import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import FeedLayout from "@/components/FeedLayout"
import CreatePostForm from "@/components/CreatePostForm"

export default async function CreatePage() {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await connectDB()
  const user = await User.findOne({ clerkId: userId }).lean()

  if (!user || !user.onBoard) {
    if (user?.username && user?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  const plainUser = { ...user, _id: user._id.toString() }

  return (
    <FeedLayout
      user={plainUser}
      title="Create Post"
      subtitle="Start a discussion or launch a new poll for the crew."
    >
      <CreatePostForm />
    </FeedLayout>
  )
}
