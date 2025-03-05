import { NextResponse } from "next/server"

// Generate geographically accurate traffic incidents for Casablanca
const mockIncidents = [
  // Major accidents
  {
    id: "incident-1",
    type: "ACCIDENT",
    severity: "HIGH",
    location: {
      lat: 33.5897,
      lng: -7.6192,
    },
    description: "Multi-vehicle collision with injuries",
    roadName: "Boulevard Mohammed V",
    delay: 1200, // 20 minutes
  },
  {
    id: "incident-2",
    type: "ACCIDENT",
    severity: "HIGH",
    location: {
      lat: 33.5995,
      lng: -7.5214,
    },
    description: "Overturned truck blocking lanes",
    roadName: "A5 Highway (Casablanca-Rabat)",
    delay: 1800, // 30 minutes
  },
  {
    id: "incident-3",
    type: "ACCIDENT",
    severity: "MEDIUM",
    location: {
      lat: 33.5877,
      lng: -7.6142,
    },
    description: "Two-car collision at intersection",
    roadName: "Avenue Mers Sultan",
    delay: 600, // 10 minutes
  },
  {
    id: "incident-4",
    type: "ACCIDENT",
    severity: "MEDIUM",
    location: {
      lat: 33.5767,
      lng: -7.6042,
    },
    description: "Vehicle collision with motorcycle",
    roadName: "Boulevard Anoual",
    delay: 720, // 12 minutes
  },
  {
    id: "incident-5",
    type: "ACCIDENT",
    severity: "LOW",
    location: {
      lat: 33.5677,
      lng: -7.6332,
    },
    description: "Minor fender bender, vehicles moved to side",
    roadName: "Boulevard Brahim Roudani",
    delay: 300, // 5 minutes
  },

  // Congestion areas
  {
    id: "incident-6",
    type: "CONGESTION",
    severity: "HIGH",
    location: {
      lat: 33.5872,
      lng: -7.6382,
    },
    description: "Severe traffic jam due to rush hour",
    roadName: "Boulevard Zerktouni",
    delay: 1500, // 25 minutes
  },
  {
    id: "incident-7",
    type: "CONGESTION",
    severity: "HIGH",
    location: {
      lat: 33.588,
      lng: -7.6432,
    },
    description: "Heavy congestion near shopping district",
    roadName: "Boulevard Anfa",
    delay: 1200, // 20 minutes
  },
  {
    id: "incident-8",
    type: "CONGESTION",
    severity: "MEDIUM",
    location: {
      lat: 33.5927,
      lng: -7.6127,
    },
    description: "Slow-moving traffic near business district",
    roadName: "Boulevard Hassan II",
    delay: 900, // 15 minutes
  },
  {
    id: "incident-9",
    type: "CONGESTION",
    severity: "MEDIUM",
    location: {
      lat: 33.5722,
      lng: -7.6172,
    },
    description: "Traffic backup at major intersection",
    roadName: "Boulevard Yacoub El Mansour",
    delay: 720, // 12 minutes
  },
  {
    id: "incident-10",
    type: "CONGESTION",
    severity: "LOW",
    location: {
      lat: 33.5817,
      lng: -7.6037,
    },
    description: "Moderate traffic slowdown",
    roadName: "Avenue Mers Sultan",
    delay: 480, // 8 minutes
  },

  // Construction zones
  {
    id: "incident-11",
    type: "CONSTRUCTION",
    severity: "HIGH",
    location: {
      lat: 33.5747,
      lng: -7.6472,
    },
    description: "Major road reconstruction, multiple lanes closed",
    roadName: "Boulevard Ghandi",
    delay: 1800, // 30 minutes
  },
  {
    id: "incident-12",
    type: "CONSTRUCTION",
    severity: "MEDIUM",
    location: {
      lat: 33.5877,
      lng: -7.5927,
    },
    description: "Road maintenance, one lane closed",
    roadName: "Boulevard Ibnou Sina",
    delay: 600, // 10 minutes
  },
  {
    id: "incident-13",
    type: "CONSTRUCTION",
    severity: "MEDIUM",
    location: {
      lat: 33.5627,
      lng: -7.6367,
    },
    description: "Utility work, partial lane closure",
    roadName: "Boulevard Abdellah Ben Yacine",
    delay: 540, // 9 minutes
  },
  {
    id: "incident-14",
    type: "CONSTRUCTION",
    severity: "LOW",
    location: {
      lat: 33.5677,
      lng: -7.5877,
    },
    description: "Minor roadwork, minimal disruption",
    roadName: "Boulevard Modibo Keita",
    delay: 300, // 5 minutes
  },

  // Road closures
  {
    id: "incident-15",
    type: "ROAD_CLOSURE",
    severity: "HIGH",
    location: {
      lat: 33.5827,
      lng: -7.6227,
    },
    description: "Full road closure due to water main break",
    roadName: "Boulevard Emile Zola",
    delay: 2400, // 40 minutes
  },
  {
    id: "incident-16",
    type: "ROAD_CLOSURE",
    severity: "HIGH",
    location: {
      lat: 33.5867,
      lng: -7.6087,
    },
    description: "Street closed for public event",
    roadName: "Boulevard Rahal El Meskini",
    delay: 1800, // 30 minutes
  },
  {
    id: "incident-17",
    type: "ROAD_CLOSURE",
    severity: "MEDIUM",
    location: {
      lat: 33.5667,
      lng: -7.6037,
    },
    description: "Partial closure for emergency repairs",
    roadName: "Boulevard Abou Bakr El Kadiri",
    delay: 1200, // 20 minutes
  },

  // Other incidents
  {
    id: "incident-18",
    type: "OTHER",
    severity: "MEDIUM",
    location: {
      lat: 33.6127,
      lng: -7.6558,
    },
    description: "Broken traffic signals causing confusion",
    roadName: "Boulevard de la Corniche",
    delay: 600, // 10 minutes
  },
  {
    id: "incident-19",
    type: "OTHER",
    severity: "LOW",
    location: {
      lat: 33.5912,
      lng: -7.6082,
    },
    description: "Police checkpoint causing minor delays",
    roadName: "Avenue des FAR",
    delay: 300, // 5 minutes
  },
  {
    id: "incident-20",
    type: "OTHER",
    severity: "LOW",
    location: {
      lat: 33.5777,
      lng: -7.6157,
    },
    description: "Stalled vehicle on shoulder",
    roadName: "Boulevard Al Massira Al Khadra",
    delay: 180, // 3 minutes
  },

  // Port area
  {
    id: "incident-21",
    type: "CONGESTION",
    severity: "HIGH",
    location: {
      lat: 33.6032,
      lng: -7.6142,
    },
    description: "Heavy truck traffic near port entrance",
    roadName: "Port of Casablanca Access Road",
    delay: 1500, // 25 minutes
  },

  // Near Casa-Port train station
  {
    id: "incident-22",
    type: "CONGESTION",
    severity: "MEDIUM",
    location: {
      lat: 33.5962,
      lng: -7.6132,
    },
    description: "Increased traffic due to train arrivals/departures",
    roadName: "Boulevard Hassan II (near Casa-Port)",
    delay: 720, // 12 minutes
  },

  // Near Morocco Mall
  {
    id: "incident-23",
    type: "CONGESTION",
    severity: "HIGH",
    location: {
      lat: 33.5937,
      lng: -7.6583,
    },
    description: "Weekend traffic congestion near shopping mall",
    roadName: "Boulevard Sidi Abderrahmane",
    delay: 1080, // 18 minutes
  },

  // Near Ain Diab beach
  {
    id: "incident-24",
    type: "CONGESTION",
    severity: "MEDIUM",
    location: {
      lat: 33.6132,
      lng: -7.6628,
    },
    description: "Beach traffic causing delays",
    roadName: "Boulevard de la Corniche",
    delay: 840, // 14 minutes
  },

  // Near Twin Center
  {
    id: "incident-25",
    type: "ACCIDENT",
    severity: "LOW",
    location: {
      lat: 33.5897,
      lng: -7.6372,
    },
    description: "Minor collision, vehicles moved to side",
    roadName: "Boulevard Zerktouni (near Twin Center)",
    delay: 360, // 6 minutes
  },
]

export async function GET() {
  try {
    // Return our enhanced mock data
    return NextResponse.json({ incidents: mockIncidents })
  } catch (error: any) {
    console.error("Error in incidents API route:", error)
    return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 })
  }
}

