import connectDB from "@/lib/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function PATCH(req, { params }) {
  const rateCheck = checkRateLimit(req, 5, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { username } = await params

  await connectDB()
  const currentUser = await User.findOne({ clerkId })
  if (!currentUser) return Response.json({ error: "User not found" }, { status: 404 })
  if (currentUser.username !== username) {
    return Response.json({ error: "Cannot modify another user's settings" }, { status: 403 })
  }

  const { pollsPrivate } = await req.json()
  currentUser.pollsPrivate = pollsPrivate
  await currentUser.save()

  return Response.json({ pollsPrivate: currentUser.pollsPrivate }, { status: 200 })
}
