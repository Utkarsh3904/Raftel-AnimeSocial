import connectDB from "@/lib/db"
import Comment from "@/models/Comment"
import { auth } from "@clerk/nextjs/server"

export async function GET(req){
        const pollId = new URL(req.url).searchParams.get("pollId")

    await connectDB()

    const comments = await Comment
    .find({pollId})
    .sort({createdAt: -1})
    .populate("userId", "username avatar")
    .lean()

    return Response.json(comments, {status: 200})

}

export async function POST(req){

    const userId = await auth();

    if (!userId) return Response.json({error: "Unauthorized"}, {status: 401})

    const { pollId, text } = await req.json()

    if (!text || text.trim() === "") {
        return Response.json({ error: "Comment text cannot be empty" }, { status: 400 })
    }

    await connectDB();

    const newComment = new Comment({
        userId ,
        pollId,
        text
    }).populate("userId", "username avatar")
    await newComment.save();

    return Response.json(newComment, {status:201});


}