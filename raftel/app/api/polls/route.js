import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    await connectDB()

    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username avatar")

    return Response.json(polls, { status: 200 })

  } catch (error) {
    console.error("Error fetching polls:", error)
    return Response.json({ error: "Failed to fetch polls" }, { status: 500 })
  }
}

export async function POST(req) {
  const { userId } = auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { question, options } = await req.json()

    if (!question || !options || options.length < 2) {
      return Response.json({ error: "Invalid poll data" }, { status: 400 })
    }

    await connectDB()

    const newPoll = new Poll({
      question,
      options: options.map(option => ({ text: option, votes: 0 })),
      createdBy: userId,
      isAiGenerated: false,
    })

    await newPoll.save()
    return Response.json({ poll: newPoll, message: "Poll created" }, { status: 201 })

  } catch (error) {
    console.error("Error creating poll:", error)
    return Response.json({ error: "Failed to create poll" }, { status: 500 })
  }
}