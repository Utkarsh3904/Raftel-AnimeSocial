import connectDB from "@/lib/db";
import Poll from "@/models/Poll";
import { generatePoll } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req){
  const rateCheck = checkRateLimit(req, 2, 120000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const pollData = await generatePoll();

  await connectDB()
  const poll = new Poll({
    type: "poll",
    question: pollData.question,
    options: pollData.options.map(opt => ({ text: opt, votes: 0 })),
    isAiGenerated: true,
    createdBy: null
  })
  await poll.save()

  return Response.json({ poll }, { status: 201 })
}
