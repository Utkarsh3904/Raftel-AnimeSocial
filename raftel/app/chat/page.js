import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import FeedLayout from "@/components/FeedLayout"
import ChatListContent from "./ChatListContent"
import { redirect } from "next/navigation"

function serialize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default async function ChatPage() {
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
    <FeedLayout user={serialize(plainUser)} title="Messages" hideRightSidebar>
      <ChatListContent />
    </FeedLayout>
  )
}
