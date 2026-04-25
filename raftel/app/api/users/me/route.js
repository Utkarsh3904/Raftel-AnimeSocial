import connectDB from "@/lib/connectDB"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function PATCH(req){
    const {userId} = await auth();

    if (!userId) return new Response("Unauthorized ,User does not exist", { status: 401 })
    
    const { username, avatar } = await req.json();


    try {
            await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            {clerkId : userId},
            {username, avatar, onBoard: true},
            {new: true},
        )

        return new Response(JSON.stringify(updatedUser), {status:200})
    } catch (error) {

        console.error("Error updating user:", error)
        return new Response("Failed to update user", { status: 500 })
    }
}