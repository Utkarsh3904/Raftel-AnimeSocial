import { generatePoll } from "@/lib/gemini"
import connectDB from "@/lib/db"
import Poll from "@/models/Poll"
import { shouldGeneratePoll } from "@/lib/vegapunkScheduler"

export async function POST() {
  const should = await shouldGeneratePoll()
  if (!should) {
    return Response.json({ message: "Not time yet" }, { status: 200 })
  }

  try {
    const pollData = await generatePoll()
    await connectDB()
    const poll = await Poll.create({
      type: "poll",
      question: pollData.question,
      options: pollData.options.map(opt => ({ text: opt, votes: 0 })),
      isAiGenerated: true,
      createdBy: null,
    })
    return Response.json({ poll }, { status: 201 })
  } catch (err) {
    console.error("Failed to generate AI poll:", err)
    return Response.json({ error: "Failed to generate poll" }, { status: 500 })
  }
}
