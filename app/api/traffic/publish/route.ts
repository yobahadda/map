import { NextResponse } from "next/server"
import Pusher from "pusher"

// Initialize Pusher server
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "1952729",
  key: process.env.PUSHER_KEY || "05169a630f5a8882ae8f",
  secret: process.env.PUSHER_SECRET || "b672226dbd33b76236ba",
  cluster: process.env.PUSHER_CLUSTER || "eu",
  useTLS: true,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request
    if (!body.event || !body.data) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Trigger the event on Pusher
    await pusher.trigger("traffic-updates", body.event, body.data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error publishing traffic update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

