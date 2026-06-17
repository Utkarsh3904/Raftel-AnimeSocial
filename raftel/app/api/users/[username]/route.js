import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req, { params }) {
  const { username } = await params

  await connectDB();

  const user = await User
    .findOne({ username })
    .select("-clerkId -__v -createdAt -updatedAt")
    .lean();

  if (!user) return Response.json({ error: "User not found" }, { status: 404 })

  return Response.json({ user }, { status: 200 })
}
