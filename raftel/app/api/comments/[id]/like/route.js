import connectDB from "@/lib/db"
import Comment from "@/models/Comment"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function POST(req, { params }) {
    const { userId } = await auth();

    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const commentId = params.id;

    if (!commentId) return Response.json({ error: "Comment ID is required" }, { status: 400 });

    await connectDB();

    const comment = await Comment.findById(commentId);

    if (!comment) return Response.json({ error: "Comment not found" }, { status: 404 });

    if (comment.likedBy.includes(userId)) {
        return Response.json({ error: "Already liked" }, { status: 400 });
    }

    if (comment.userId.toString() === userId) {
        return Response.json({ error: "Cannot like your own comment" }, { status: 400 });
    }

    // ✅ Bug 1 & 2 Fixed: use commentId (not newComment._id) and combine both updates atomically
    await Comment.findByIdAndUpdate(
        commentId,
        {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
        }
    );

    // ✅ Bug 3 Fixed: actually increment the comment author's reputation
    await User.findByIdAndUpdate(
        comment.userId,
        { $inc: { reputation: 1 } }
    );

    // ✅ Bug 4 Fixed: capture the populated result and return it
    const populated = await Comment.findById(commentId)
        .populate("userId", "username avatar");

    // ✅ Bug 5 Fixed: accurate success message
    return Response.json({ comment: populated, message: "Comment liked" }, { status: 200 });
}