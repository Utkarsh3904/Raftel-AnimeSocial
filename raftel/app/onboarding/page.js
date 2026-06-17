import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import OnboardingForm from "./OnboardingForm"

export default async function OnboardingPage() {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await connectDB()
  const user = await User.findOne({ clerkId: userId }).lean()

  if (user?.onBoard) redirect("/feed")
  if (user?.username && user?.avatar) redirect("/onboarding/anime")

  return (
    <OnboardingForm
      initialUsername={user?.username || ""}
      initialAvatar={user?.avatar || undefined}
    />
  )
}
