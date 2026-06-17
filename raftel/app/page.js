import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LandingPage from "@/components/LandingPage"

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    await connectDB()
    const user = await User.findOne({ clerkId: userId }).lean()

    if (user?.onBoard) redirect("/feed")
    if (user?.username && user?.avatar) redirect("/onboarding/anime")
    redirect("/onboarding")
  }

  return <LandingPage />
}
