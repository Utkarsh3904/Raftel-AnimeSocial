import connectDB from "@/lib/db"
import Vote from "@/models/Vote"
import Poll from "@/models/Poll"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function POST(req){
try{
    const { userId: clerkId } = await auth()
    if(!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const {pollId, optionIndex} = await req.json()

    await connectDB()   

    const user = await User.findOne({ clerkId })
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const poll = await Poll.findById(pollId)
    if (!poll) {
      return Response.json({ error: "Poll not found" }, { status: 404 })
    }

  const existingVote = await Vote.findOne({ userId: user._id, pollId })
  if (existingVote) {
    return Response.json({ error: "already voted" }, { status: 400 })
  }

  //create new vote
  const newVote = new Vote({
    userId: user._id,
    pollId,
    optionIndex
  })

  await newVote.save();


    const updatedPoll = await Poll.findByIdAndUpdate(
        poll._id, 
        {
            $inc: {[`options.${optionIndex}.votes`]: 1, totalVotes: 1}
        },
        {new: true}
    ).populate("createdBy", "username avatar")

    if (updatedPoll.createdBy) {
      await User.findByIdAndUpdate(
        updatedPoll.createdBy._id,
        { $inc: { reputation: 1 } }
      )
    }
    return Response.json(updatedPoll, {status: 200})


} catch (error) {
    console.error("Error creating vote:", error)
    return Response.json({ error: "Internal Server Error" }, {status: 500})
}
}



