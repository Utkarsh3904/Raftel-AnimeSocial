import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(req) {
  const rateCheck = checkRateLimit(req, 20, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return Response.json({ onBoard: false }, { status: 200 });
    }

    return Response.json({
      onBoard: Boolean(user.onBoard),
      username: user.username,
      avatar: user.avatar,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const rateCheck = checkRateLimit(req, 10, 60000)
  if (!rateCheck.allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": rateCheck.retryAfter } })
  }

  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, avatar, top5Anime } = await req.json();
    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      if (!username || !avatar) {
        return Response.json(
          { error: "Username and avatar are required" },
          { status: 400 }
        );
      }
      user = new User({
        clerkId: userId,
        username,
        avatar,
        reputation: 0,
        onBoard: false,
      });
    } else {
      if (username) user.username = username;
      if (avatar) user.avatar = avatar;
    }

    if (top5Anime) {
      user.top5Anime = top5Anime;
      user.onBoard = true;
    }

    await user.save();

    return Response.json({
      username: user.username,
      avatar: user.avatar,
      onBoard: user.onBoard,
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    const message = error.name === "ValidationError"
      ? "Please complete your profile before saving anime"
      : error.code === 11000
        ? "That username is already taken"
        : "Failed to update user";
    return Response.json({ error: message }, { status: 500 });
  }
}
