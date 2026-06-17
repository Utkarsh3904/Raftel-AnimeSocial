import connectDB from "@/lib/db"
import Poll from "@/models/Poll"

const INTERVAL_MS = 12 * 60 * 60 * 1000

export async function shouldGeneratePoll() {
  await connectDB()
  const lastAi = await Poll.findOne({ isAiGenerated: true }).sort({ createdAt: -1 })
  if (!lastAi) return true
  const elapsed = Date.now() - new Date(lastAi.createdAt).getTime()
  return elapsed >= INTERVAL_MS
}
