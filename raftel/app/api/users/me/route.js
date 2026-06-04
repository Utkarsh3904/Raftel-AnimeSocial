import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized, User does not exist" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return Response.json(
        { error: "User not found in database" ,
         onboarded: false },
        { status: 200 },
      );
    }

    return Response.json({ onboarded: Boolean(user.onBoard) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized, User does not exist" },
      { status: 401 },
    );
  }

  try {
    const { username, avatar, top5Anime } = await req.json();

    await connectDB();

    const updateFields = { onBoard: true };
    if (username) updateFields.username = username;
    if (avatar) updateFields.avatar = avatar;
    if (top5Anime) updateFields.top5Anime = top5Anime;

const updatedUser = await User.findOneAndUpdate(
  { clerkId: userId },
  { $set: updateFields },
  { new: true, runValidators: true, }
)

    if (!updatedUser) {
      return Response.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
