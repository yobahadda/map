import { NextResponse } from "next/server"

// Generate geographically accurate traffic flow data for Casablanca's major roads
const mockFlows = [
  // A7 Highway (Casablanca - El Jadida)
  {
    id: "flow-1",
    currentSpeed: 85,
    freeFlowSpeed: 120,
    confidence: 0.95,
    roadClosure: false,
    coordinates: [
      [-7.6651, 33.5389], // Start point
      [-7.6697, 33.5352],
      [-7.6743, 33.5315],
      [-7.6789, 33.5278],
      [-7.6835, 33.5241],
      [-7.6881, 33.5204], // End point
    ],
    color: "#22c55e", // Green - good flow
  },

  // A5 Highway (Casablanca - Rabat)
  {
    id: "flow-2",
    currentSpeed: 65,
    freeFlowSpeed: 120,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.5214, 33.6012], // Start point
      [-7.5158, 33.6069],
      [-7.5102, 33.6126],
      [-7.5046, 33.6183],
      [-7.499, 33.624], // End point
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // A3 Highway (Casablanca - Marrakech)
  {
    id: "flow-3",
    currentSpeed: 110,
    freeFlowSpeed: 120,
    confidence: 0.95,
    roadClosure: false,
    coordinates: [
      [-7.562, 33.5095], // Start point
      [-7.5665, 33.5058],
      [-7.571, 33.5021],
      [-7.5755, 33.4984],
      [-7.58, 33.4947], // End point
    ],
    color: "#22c55e", // Green - good flow
  },

  // Boulevard Mohammed V (Major N-S artery)
  {
    id: "flow-4",
    currentSpeed: 25,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6192, 33.5732], // Start point (North)
      [-7.6187, 33.5697],
      [-7.6182, 33.5662],
      [-7.6177, 33.5627],
      [-7.6172, 33.5592],
      [-7.6167, 33.5557], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard d'Anfa (E-W major boulevard)
  {
    id: "flow-5",
    currentSpeed: 30,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6498, 33.5895], // Start point (West)
      [-7.6463, 33.589],
      [-7.6428, 33.5885],
      [-7.6393, 33.588],
      [-7.6358, 33.5875],
      [-7.6323, 33.587], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Zerktouni (Major N-S boulevard)
  {
    id: "flow-6",
    currentSpeed: 15,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6382, 33.5995], // Start point (North)
      [-7.6377, 33.596],
      [-7.6372, 33.5925],
      [-7.6367, 33.589],
      [-7.6362, 33.5855],
      [-7.6357, 33.582], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Hassan II
  {
    id: "flow-7",
    currentSpeed: 20,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6142, 33.6032], // Start point (North)
      [-7.6137, 33.5997],
      [-7.6132, 33.5962],
      [-7.6127, 33.5927],
      [-7.6122, 33.5892], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard de la Corniche (Coastal road)
  {
    id: "flow-8",
    currentSpeed: 45,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6698, 33.6142], // Start point (West)
      [-7.6663, 33.6137],
      [-7.6628, 33.6132],
      [-7.6593, 33.6127],
      [-7.6558, 33.6122],
      [-7.6523, 33.6117], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Avenue des FAR
  {
    id: "flow-9",
    currentSpeed: 25,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6092, 33.5982], // Start point (North)
      [-7.6087, 33.5947],
      [-7.6082, 33.5912],
      [-7.6077, 33.5877],
      [-7.6072, 33.5842], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Route d'El Jadida
  {
    id: "flow-10",
    currentSpeed: 35,
    freeFlowSpeed: 70,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6292, 33.5632], // Start point (North)
      [-7.6327, 33.5597],
      [-7.6362, 33.5562],
      [-7.6397, 33.5527],
      [-7.6432, 33.5492], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Moulay Youssef
  {
    id: "flow-11",
    currentSpeed: 40,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6292, 33.5882], // Start point (West)
      [-7.6257, 33.5877],
      [-7.6222, 33.5872],
      [-7.6187, 33.5867],
      [-7.6152, 33.5862], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Rachidi
  {
    id: "flow-12",
    currentSpeed: 30,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6332, 33.5932], // Start point (North)
      [-7.6327, 33.5897],
      [-7.6322, 33.5862],
      [-7.6317, 33.5827], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Ghandi
  {
    id: "flow-13",
    currentSpeed: 20,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6482, 33.5782], // Start point (North)
      [-7.6477, 33.5747],
      [-7.6472, 33.5712],
      [-7.6467, 33.5677], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Avenue 2 Mars
  {
    id: "flow-14",
    currentSpeed: 15,
    freeFlowSpeed: 50,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6042, 33.5882], // Start point (West)
      [-7.6007, 33.5877],
      [-7.5972, 33.5872],
      [-7.5937, 33.5867], // End point (East)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Abdelmoumen
  {
    id: "flow-15",
    currentSpeed: 25,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6432, 33.5982], // Start point (North)
      [-7.6427, 33.5947],
      [-7.6422, 33.5912],
      [-7.6417, 33.5877],
      [-7.6412, 33.5842],
      [-7.6407, 33.5807], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Al Massira Al Khadra
  {
    id: "flow-16",
    currentSpeed: 35,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6242, 33.5782], // Start point (West)
      [-7.6207, 33.5777],
      [-7.6172, 33.5772],
      [-7.6137, 33.5767],
      [-7.6102, 33.5762], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Yacoub El Mansour
  {
    id: "flow-17",
    currentSpeed: 40,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6242, 33.5732], // Start point (West)
      [-7.6207, 33.5727],
      [-7.6172, 33.5722],
      [-7.6137, 33.5717],
      [-7.6102, 33.5712], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Sidi Abderrahmane
  {
    id: "flow-18",
    currentSpeed: 50,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6598, 33.6042], // Start point (North)
      [-7.6593, 33.6007],
      [-7.6588, 33.5972],
      [-7.6583, 33.5937], // End point (South)
    ],
    color: "#22c55e", // Green - good flow
  },

  // Route de Mediouna
  {
    id: "flow-19",
    currentSpeed: 45,
    freeFlowSpeed: 70,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.5892, 33.5532], // Start point (North)
      [-7.5887, 33.5497],
      [-7.5882, 33.5462],
      [-7.5877, 33.5427],
      [-7.5872, 33.5392], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Oqba Ibn Nafii
  {
    id: "flow-20",
    currentSpeed: 30,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6532, 33.5682], // Start point (North)
      [-7.6527, 33.5647],
      [-7.6522, 33.5612],
      [-7.6517, 33.5577], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Driss El Harti
  {
    id: "flow-21",
    currentSpeed: 40,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.5992, 33.5682], // Start point (West)
      [-7.5957, 33.5677],
      [-7.5922, 33.5672],
      [-7.5887, 33.5667], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Avenue Mers Sultan
  {
    id: "flow-22",
    currentSpeed: 20,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6142, 33.5832], // Start point (West)
      [-7.6107, 33.5827],
      [-7.6072, 33.5822],
      [-7.6037, 33.5817], // End point (East)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Bir Anzarane
  {
    id: "flow-23",
    currentSpeed: 35,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6482, 33.5832], // Start point (North)
      [-7.6477, 33.5797],
      [-7.6472, 33.5762],
      [-7.6467, 33.5727], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Avenue Hassan I
  {
    id: "flow-24",
    currentSpeed: 15,
    freeFlowSpeed: 40,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6092, 33.5732], // Start point (West)
      [-7.6057, 33.5727],
      [-7.6022, 33.5722],
      [-7.5987, 33.5717], // End point (East)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Emile Zola
  {
    id: "flow-25",
    currentSpeed: 25,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6242, 33.5932], // Start point (North)
      [-7.6237, 33.5897],
      [-7.6232, 33.5862],
      [-7.6227, 33.5827], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Abdellah Ben Yacine
  {
    id: "flow-26",
    currentSpeed: 30,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6382, 33.5732], // Start point (North)
      [-7.6377, 33.5697],
      [-7.6372, 33.5662],
      [-7.6367, 33.5627], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Ibnou Sina
  {
    id: "flow-27",
    currentSpeed: 40,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.5942, 33.5982], // Start point (North)
      [-7.5937, 33.5947],
      [-7.5932, 33.5912],
      [-7.5927, 33.5877], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Rahal El Meskini
  {
    id: "flow-28",
    currentSpeed: 25,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6192, 33.5882], // Start point (West)
      [-7.6157, 33.5877],
      [-7.6122, 33.5872],
      [-7.6087, 33.5867], // End point (East)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Brahim Roudani
  {
    id: "flow-29",
    currentSpeed: 20,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6332, 33.5782], // Start point (North)
      [-7.6327, 33.5747],
      [-7.6322, 33.5712],
      [-7.6317, 33.5677],
      [-7.6312, 33.5642], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Ain Taoujtate
  {
    id: "flow-30",
    currentSpeed: 45,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.5842, 33.5632], // Start point (West)
      [-7.5807, 33.5627],
      [-7.5772, 33.5622],
      [-7.5737, 33.5617], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Modibo Keita
  {
    id: "flow-31",
    currentSpeed: 35,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.5892, 33.5782], // Start point (North)
      [-7.5887, 33.5747],
      [-7.5882, 33.5712],
      [-7.5877, 33.5677], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Anoual
  {
    id: "flow-32",
    currentSpeed: 25,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6042, 33.5782], // Start point (West)
      [-7.6007, 33.5777],
      [-7.5972, 33.5772],
      [-7.5937, 33.5767], // End point (East)
    ],
    color: "#ef4444", // Red - heavy congestion
  },

  // Boulevard Abdellatif Ben Kaddour
  {
    id: "flow-33",
    currentSpeed: 30,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6432, 33.5732], // Start point (North)
      [-7.6427, 33.5697],
      [-7.6422, 33.5662],
      [-7.6417, 33.5627], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Ghandi (Extension)
  {
    id: "flow-34",
    currentSpeed: 40,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6482, 33.5682], // Start point (North)
      [-7.6477, 33.5647],
      [-7.6472, 33.5612],
      [-7.6467, 33.5577], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Zaid Ou Hmad
  {
    id: "flow-35",
    currentSpeed: 50,
    freeFlowSpeed: 60,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6598, 33.5782], // Start point (North)
      [-7.6593, 33.5747],
      [-7.6588, 33.5712],
      [-7.6583, 33.5677], // End point (South)
    ],
    color: "#22c55e", // Green - good flow
  },

  // Boulevard Sidi Mohammed Ben Abdellah
  {
    id: "flow-36",
    currentSpeed: 55,
    freeFlowSpeed: 70,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6698, 33.5982], // Start point (North)
      [-7.6693, 33.5947],
      [-7.6688, 33.5912],
      [-7.6683, 33.5877], // End point (South)
    ],
    color: "#22c55e", // Green - good flow
  },

  // Boulevard Moulay Slimane
  {
    id: "flow-37",
    currentSpeed: 30,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.5792, 33.5882], // Start point (West)
      [-7.5757, 33.5877],
      [-7.5722, 33.5872],
      [-7.5687, 33.5867], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Abdelhadi Boutaleb
  {
    id: "flow-38",
    currentSpeed: 45,
    freeFlowSpeed: 60,
    confidence: 0.9,
    roadClosure: false,
    coordinates: [
      [-7.6532, 33.5882], // Start point (North)
      [-7.6527, 33.5847],
      [-7.6522, 33.5812],
      [-7.6517, 33.5777], // End point (South)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Abou Bakr El Kadiri
  {
    id: "flow-39",
    currentSpeed: 35,
    freeFlowSpeed: 50,
    confidence: 0.85,
    roadClosure: false,
    coordinates: [
      [-7.6142, 33.5682], // Start point (West)
      [-7.6107, 33.5677],
      [-7.6072, 33.5672],
      [-7.6037, 33.5667], // End point (East)
    ],
    color: "#f59e0b", // Amber - moderate congestion
  },

  // Boulevard Yacoub El Marini
  {
    id: "flow-40",
    currentSpeed: 25,
    freeFlowSpeed: 50,
    confidence: 0.8,
    roadClosure: false,
    coordinates: [
      [-7.6292, 33.5682], // Start point (North)
      [-7.6287, 33.5647],
      [-7.6282, 33.5612],
      [-7.6277, 33.5577], // End point (South)
    ],
    color: "#ef4444", // Red - heavy congestion
  },
]

export async function GET() {
  try {
    // Return our enhanced mock data
    return NextResponse.json({ flows: mockFlows })
  } catch (error: any) {
    console.error("Error in flow API route:", error)
    return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 })
  }
}

