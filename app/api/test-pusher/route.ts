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

export async function GET() {
  try {
    // Send a test event
    await pusher.trigger("traffic-updates", "new-incident", {
      id: "test-" + Date.now(),
      type: "accident",
      severity: "high",
      location: { lat: 40.7128, lng: -74.006 },
      description: "Test incident from API",
    })

    return NextResponse.json({
      success: true,
      message: "Test event sent successfully",
      config: {
        appId: process.env.PUSHER_APP_ID || "1952729",
        key: process.env.PUSHER_KEY || "05169a630f5a8882ae8f",
        cluster: process.env.PUSHER_CLUSTER || "eu",
      },
    })
  } catch (error: any) {
    console.error("Error sending test event:", error)
    return NextResponse.json(
      {
        error: "Failed to send test event",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

