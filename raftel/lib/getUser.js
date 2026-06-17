import connectDB from "@/lib/db"
import User from "@/models/User"

export async function getUserByClerkId(clerkId) {
  await connectDB()
  return User.findOne({ clerkId })
}
