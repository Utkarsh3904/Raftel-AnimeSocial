import { Webhook } from "svix"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function POST(req) {

  const webhookSecret = process.env.WEBHOOK_SECRET
  if (!webhookSecret) return new Response("No webhook secret", { status: 500 })

  const payload   = await req.text()
  const signature = req.headers.get("svix-signature")
  const id        = req.headers.get("svix-id")
  const timestamp = req.headers.get("svix-timestamp")

  if (!signature) return new Response("No signature",  { status: 400 })
  if (!id)        return new Response("No id",         { status: 400 })
  if (!timestamp) return new Response("No timestamp",  { status: 400 })

  const wh = new Webhook(webhookSecret)
  let evt

  try {
    evt = wh.verify(payload, {
      "svix-id":        id,
      "svix-timestamp": timestamp,
      "svix-signature": signature,
    })
  } catch (err) {
    console.error("Failed to verify webhook:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  if (evt.type === "user.created") {
    const { id: clerkId, username: rawUsername, image_url } = evt.data

    const username = rawUsername || "Crewman" + Math.floor(Math.random() * 9999)

    try {
      await connectDB()

      const existingUser = await User.findOne({ clerkId })
      if (existingUser) {
        console.log("User already exists, skipping")
        return new Response("User already exists", { status: 200 })
      }

      const newUser = new User({
        clerkId,
        username,
        avatar: image_url || "",
      })

      await newUser.save()
      console.log("New user created:", newUser)
      return new Response("User created", { status: 201 })

    } catch (err) {
      console.error("DB error:", err)
      return new Response("Internal server error", { status: 500 })
    }
  }

  // handles all other event types cleanly
  return new Response("Event received", { status: 200 })
}