import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import { auth } from "@clerk/nextjs/server"
import { uploadImage } from "@/lib/cloudinary"
import { getUserByClerkId } from "@/lib/getUser"
import { checkRateLimit } from "@/lib/rateLimit"

export async function POST(req) {
  const rateCheck = checkRateLimit(req, 5, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId: clerkId } = await auth()
  if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { type, question, body, options, image } = await req.json()
    const postType = type === "discussion" ? "discussion" : "poll"

    if (postType === "poll" && !question?.trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 })
    }
    if (postType === "discussion" && !body?.trim() && !question?.trim()) {
      return Response.json({ error: "Discussion content is required" }, { status: 400 })
    }

    const user = await getUserByClerkId(clerkId)
    if (!user) return Response.json({ error: "User not found" }, { status: 404 })

    let imageUrl = null
    if (image) {
      imageUrl = await uploadImage(image)
    }

    const postData = {
      type: postType,
      createdBy: user._id,
      isAiGenerated: false,
      image: imageUrl,
      likes: 0,
      likedBy: [],
    }

    if (postType === "poll") {
      const cleanOptions = (options || []).map((o) => o?.trim()).filter(Boolean)
      if (cleanOptions.length < 2) {
        return Response.json({ error: "Poll needs at least 2 options" }, { status: 400 })
      }
      postData.question = question.trim()
      postData.options = cleanOptions.map((opt) => ({ text: opt, votes: 0 }))
      postData.totalVotes = 0
    } else {
      const content = body?.trim() || question?.trim()
      postData.question = content.slice(0, 120)
      postData.body = content
      postData.options = []
    }

    const post = await Poll.create(postData)
    const populated = await Poll.findById(post._id)
      .populate("createdBy", "username avatar")
      .lean()

    return Response.json({ post: populated }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
