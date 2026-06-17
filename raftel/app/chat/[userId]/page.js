import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import FeedLayout from "@/components/FeedLayout"
import ChatAreaContent from "./ChatAreaContent"
import { redirect } from "next/navigation"

function serialize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default async function ChatWithUser({ params }) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await connectDB()
  const user = await User.findOne({ clerkId: userId }).lean()
  if (!user || !user.onBoard) {
    if (user?.username && user?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  const plainUser = { ...user, _id: user._id.toString() }
  const { userId: otherUserId } = await params

  const otherUser = await User.findById(otherUserId).select("username avatar").lean()

  return (
    <FeedLayout user={serialize(plainUser)} hideRightSidebar>
      <ChatAreaContent otherUserId={otherUserId} otherUser={serialize(otherUser)} />
    </FeedLayout>
  )
}
