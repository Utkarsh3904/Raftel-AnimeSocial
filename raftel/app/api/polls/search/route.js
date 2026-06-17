import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req) {
  const rateCheck = checkRateLimit(req, 30, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim()

    if (!query) {
      return Response.json({ polls: [] }, { status: 200 })
    }

    const polls = await Poll.find({
      $or: [
        { question: { $regex: query, $options: "i" } },
        { body: { $regex: query, $options: "i" } },
        { "options.text": { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar")
      .lean()

    return Response.json({ polls }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to search polls" }, { status: 500 })
  }
}
