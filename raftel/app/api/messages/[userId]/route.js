import connectDB from "@/lib/db"
import Message from "@/models/Message"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req, { params }) {
  const rateCheck = checkRateLimit(req, 30, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const { userId: otherUserId } = await params
  if (!otherUserId) return Response.json({ error: "User ID required" }, { status: 400 })

  const currentUser = await User.findOne({ clerkId })
  if (!currentUser) return Response.json({ error: "User not found" }, { status: 404 })

  const messages = await Message.find({
    $or: [
      { senderId: currentUser._id, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUser._id }
    ]
  }).sort({ createdAt: 1 }).populate("senderId", "username avatar")

  const plainMessages = messages.map((msg) => {
    const obj = msg.toObject()
    return {
      ...obj,
      _id: obj._id.toString(),
      senderId: obj.senderId._id.toString(),
      senderUsername: obj.senderId.username,
      senderAvatar: obj.senderId.avatar,
      isMine: obj.senderId._id.toString() === currentUser._id.toString(),
    }
  })

  const otherUserData = await User.findById(otherUserId).select("username avatar").lean()

  return Response.json({ messages: plainMessages, otherUser: otherUserData }, { status: 200 })
}

export async function POST(req, { params }) {
  const rateCheck = checkRateLimit(req, 10, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const { userId: otherUserId } = await params
  if (!otherUserId) return Response.json({ error: "User ID required" }, { status: 400 })

  const currentUser = await User.findOne({ clerkId })
  if (!currentUser) return Response.json({ error: "User not found" }, { status: 404 })

  const { text } = await req.json()
  if (!text?.trim()) return Response.json({ error: "Text is required" }, { status: 400 })

  const newMessage = new Message({
    senderId: currentUser._id,
    receiverId: otherUserId,
    text,
  })

  await newMessage.save()

  const plain = newMessage.toObject()

  return Response.json({
    message: {
      ...plain,
      _id: plain._id.toString(),
      senderId: plain.senderId.toString(),
      isMine: true,
    }
  }, { status: 201 })
}
