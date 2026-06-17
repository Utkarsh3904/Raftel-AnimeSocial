import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import AnimeSelectionForm from "./AnimeSelectionForm"

export default async function AnimeSelectionPage() {
  const { userId } = await auth()
  if (!userId) redirect("/")

  await connectDB()
  const user = await User.findOne({ clerkId: userId }).lean()

  if (user?.onBoard) redirect("/feed")
  if (!user?.username || !user?.avatar) redirect("/onboarding")

  return <AnimeSelectionForm />
}
