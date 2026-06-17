import connectDB from "@/lib/db"
import Message from "@/models/Message"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req) {
  const rateCheck = checkRateLimit(req, 20, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const currentUser = await User.findOne({ clerkId })
  if (!currentUser) return Response.json({ error: "User not found" }, { status: 404 })

  const allMessages = await Message.find({
    $or: [
      { senderId: currentUser._id },
      { receiverId: currentUser._id }
    ]
  }).sort({ createdAt: -1 })

  const seenUserIds = new Set()
  const convos = []

  for (const msg of allMessages) {
    const otherId = msg.senderId.equals(currentUser._id)
      ? msg.receiverId.toString()
      : msg.senderId.toString()

    if (!seenUserIds.has(otherId)) {
      seenUserIds.add(otherId)
      convos.push({
        userId: otherId,
        lastMessage: msg.text,
        lastMessageTime: msg.createdAt,
        unread: !msg.read && msg.receiverId.equals(currentUser._id)
      })
    }
  }

  const userIds = convos.map(c => c.userId)
  const users = await User.find({ _id: { $in: userIds } }).select("username avatar _id").lean()
  const userMap = {}
  for (const u of users) {
    userMap[u._id.toString()] = u
  }

  const conversationsWithUsers = convos.map(c => ({
    ...c,
    user: userMap[c.userId] || null
  }))

  return Response.json({ conversations: conversationsWithUsers })
}
