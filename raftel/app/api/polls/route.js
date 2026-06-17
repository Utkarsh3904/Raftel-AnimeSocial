import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import { auth } from "@clerk/nextjs/server"
import { uploadImage } from "@/lib/cloudinary"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET() {
  try {
    await connectDB()
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar")
      .lean()
    return Response.json(polls, { status: 200 })
  } catch (error) {
    console.error("Error fetching polls:", error)
    return Response.json({ error: "Failed to fetch polls" }, { status: 500 })
  }
}

export async function POST(req) {
  const rateCheck = checkRateLimit(req, 5, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { question, options, image } = await req.json()

    if (!question || !options || options.length < 2) {
      return Response.json({ error: "Invalid poll data" }, { status: 400 })
    }

    await connectDB()

    const User = (await import("@/models/User")).default
    const user = await User.findOne({ clerkId: userId })
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    let imageUrl = null
    if (image) {
      imageUrl = await uploadImage(image)
    }

    const newPoll = new Poll({
      type: "poll",
      question,
      options: options.map((opt) => ({ text: opt, votes: 0 })),
      createdBy: user._id,
      isAiGenerated: false,
      image: imageUrl,
    })

    await newPoll.save()
    return Response.json({ poll: newPoll }, { status: 201 })

  } catch (error) {
    console.error("Error creating poll:", error)
    return Response.json({ error: "Failed to create poll" }, { status: 500 })
  }
}
