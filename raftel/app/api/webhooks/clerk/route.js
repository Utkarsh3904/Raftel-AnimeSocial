import { Webhook } from "svix"

export async function POST(req) {
  const webhookSecret = process.env.WEBHOOK_SECRET
  if (!webhookSecret) return new Response("No webhook secret", { status: 500 })

  const payload = await req.text()
  const signature = req.headers.get("svix-signature")
  const id = req.headers.get("svix-id")
  const timestamp = req.headers.get("svix-timestamp")

  if (!signature) return new Response("No signature", { status: 400 })
  if (!id) return new Response("No id", { status: 400 })
  if (!timestamp) return new Response("No timestamp", { status: 400 })

  const wh = new Webhook(webhookSecret)
  let evt

  try {
    evt = wh.verify(payload, {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature,
    })
  } catch (err) {
    console.error("Failed to verify webhook:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  // User records are created during onboarding (PATCH /api/users/me)
  // so new users always pick their own avatar and username first.
  if (evt.type === "user.created") {
    console.log("Clerk user created:", evt.data.id)
  }

  return new Response("Event received", { status: 200 })
}
