"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Layers, ZoomIn, ZoomOut, Filter } from "lucide-react"
import Pusher from "pusher-js"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Traffic incident type
type TrafficIncident = {
  id: string
  type: "ACCIDENT" | "CONGESTION" | "CONSTRUCTION" | "ROAD_CLOSURE" | "OTHER"
  severity: "LOW" | "MEDIUM" | "HIGH"
  location: {
    lat: number
    lng: number
  }
  description: string
  roadName?: string
  delay?: number // in seconds
}

// Casablanca coordinates
const CASABLANCA_CENTER = {
  lat: 33.5731,
  lng: -7.5898,
}

// TomTom traffic flow type
type TrafficFlow = {
  id: string
  currentSpeed: number
  freeFlowSpeed: number
  confidence: number
  roadClosure: boolean
  coordinates: Array<[number, number]> // [longitude, latitude]
  color: string
}

// Filter state type
type FilterState = {
  showAccidents: boolean
  showCongestion: boolean
  showConstruction: boolean
  showRoadClosures: boolean
  showOther: boolean
  showLowSeverity: boolean
  showMediumSeverity: boolean
  showHighSeverity: boolean
}

// Custom marker icons
const createCustomIcon = (color: string, size = 20, type?: string) => {
  let html = `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white;"></div>`

  // Add specific icons for different incident types
  if (type) {
    let icon = ""
    switch (type) {
      case "ACCIDENT":
        icon = "🚨"
        break
      case "CONGESTION":
        icon = "🚗"
        break
      case "CONSTRUCTION":
        icon = "🚧"
        break
      case "ROAD_CLOSURE":
        icon = "⛔"
        break
      case "OTHER":
        icon = "ℹ️"
        break
    }

    html = `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: ${size / 2}px;">${icon}</div>`
  }

  return L.divIcon({
    className: "custom-div-icon",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export default function TrafficMap() {
  const [trafficIncidents, setTrafficIncidents] = useState<TrafficIncident[]>([])
  const [trafficFlows, setTrafficFlows] = useState<TrafficFlow[]>([])
  const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [pusherConnected, setPusherConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    showAccidents: true,
    showCongestion: true,
    showConstruction: true,
    showRoadClosures: true,
    showOther: true,
    showLowSeverity: true,
    showMediumSeverity: true,
    showHighSeverity: true,
  })
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard")

  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const flowLinesRef = useRef<{ [key: string]: L.Polyline }>({})
  const tileLayersRef = useRef<{ [key: string]: L.TileLayer }>({})

  // Initialize map
  useEffect(() => {
    // Fix Leaflet icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })

    // Check if map is already initialized
    if (!mapRef.current) {
      try {
        // Create map instance
        const map = L.map("map", {
          center: [33.5731, -7.6192], // Centered on downtown Casablanca
          zoom: 13,
          zoomControl: false, // We'll add custom zoom controls
        })

        // Add dark theme map tiles
        const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map)

        // Add satellite tiles (not shown by default)
        const satelliteTiles = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            maxZoom: 19,
          },
        )

        // Store tile layers
        tileLayersRef.current = {
          standard: darkTiles,
          satellite: satelliteTiles,
        }

        // Store map reference
        mapRef.current = map

        setMapLoaded(true)
      } catch (err: any) {
        console.error("Error initializing map:", err)
        setError(`Failed to initialize map: ${err.message}`)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Toggle map view
  const toggleMapView = useCallback(() => {
    if (!mapRef.current || !tileLayersRef.current) return

    if (mapView === "standard") {
      // Switch to satellite
      tileLayersRef.current.standard.remove()
      tileLayersRef.current.satellite.addTo(mapRef.current)
      setMapView("satellite")
    } else {
      // Switch to standard
      tileLayersRef.current.satellite.remove()
      tileLayersRef.current.standard.addTo(mapRef.current)
      setMapView("standard")
    }
  }, [mapView])

  // Fetch traffic data
  useEffect(() => {
    if (!mapLoaded) return

    const fetchTrafficData = async () => {
      try {
        console.log("Fetching traffic incidents...")
        // Fetch traffic incidents
        const incidentsResponse = await fetch("/api/traffic/incidents")

        if (!incidentsResponse.ok) {
          throw new Error(`Failed to fetch incidents: ${incidentsResponse.statusText}`)
        }

        const incidentsData = await incidentsResponse.json()
        console.log("Incidents data:", incidentsData)

        if (incidentsData.incidents) {
          setTrafficIncidents(incidentsData.incidents)
        } else {
          console.warn("No incidents data found in response")
        }

        console.log("Fetching traffic flow...")
        // Fetch traffic flow
        const flowResponse = await fetch("/api/traffic/flow")

        if (!flowResponse.ok) {
          throw new Error(`Failed to fetch flow: ${flowResponse.statusText}`)
        }

        const flowData = await flowResponse.json()
        console.log("Flow data:", flowData)

        if (flowData.flows) {
          setTrafficFlows(flowData.flows)
        } else {
          console.warn("No flow data found in response")
        }

        setLastUpdated(new Date())
        setError(null) // Clear any previous errors
      } catch (err: any) {
        console.error("Error fetching traffic data:", err)
        setError(`Failed to fetch traffic data: ${err.message}`)
      }
    }

    // Initial fetch
    fetchTrafficData()

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchTrafficData, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [mapLoaded])

  // Filter incidents based on current filters
  const filteredIncidents = trafficIncidents.filter((incident) => {
    // Filter by type
    if (
      (incident.type === "ACCIDENT" && !filters.showAccidents) ||
      (incident.type === "CONGESTION" && !filters.showCongestion) ||
      (incident.type === "CONSTRUCTION" && !filters.showConstruction) ||
      (incident.type === "ROAD_CLOSURE" && !filters.showRoadClosures) ||
      (incident.type === "OTHER" && !filters.showOther)
    ) {
      return false
    }

    // Filter by severity
    if (
      (incident.severity === "LOW" && !filters.showLowSeverity) ||
      (incident.severity === "MEDIUM" && !filters.showMediumSeverity) ||
      (incident.severity === "HIGH" && !filters.showHighSeverity)
    ) {
      return false
    }

    return true
  })

  // Add incident to map
  const addIncidentToMap = useCallback((incident: TrafficIncident) => {
    if (!mapRef.current) return

    // Determine icon color and size based on severity
    const color = incident.severity === "HIGH" ? "#ef4444" : incident.severity === "MEDIUM" ? "#f59e0b" : "#3b82f6"
    const size = incident.severity === "HIGH" ? 28 : incident.severity === "MEDIUM" ? 24 : 20

    // Create marker with type-specific icon
    const marker = L.marker([incident.location.lat, incident.location.lng], {
      icon: createCustomIcon(color, size, incident.type),
    }).addTo(mapRef.current)

    // Add click event
    marker.on("click", () => {
      setSelectedIncident(incident)

      // Center map on the incident with slight offset for the info card
      if (mapRef.current) {
        mapRef.current.setView([incident.location.lat - 0.005, incident.location.lng], 15)
      }
    })

    // Add popup with basic info
    marker.bindTooltip(`${incident.type}: ${incident.description}`, {
      direction: "top",
      offset: [0, -10],
      className: "custom-tooltip",
    })

    // Store marker reference
    markersRef.current[incident.id] = marker
  }, [])

  // Remove incident from map
  const removeIncidentFromMap = useCallback((id: string) => {
    if (markersRef.current[id] && mapRef.current) {
      mapRef.current.removeLayer(markersRef.current[id])
      delete markersRef.current[id]
    }
  }, [])

  // Add traffic flow line to map
  const addFlowLineToMap = useCallback((flow: TrafficFlow) => {
    if (!mapRef.current) return

    try {
      // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
      const latLngs = flow.coordinates.map((coord) => [coord[1], coord[0]])

      // Create polyline with appropriate styling
      const polyline = L.polyline(latLngs as [number, number][], {
        color: flow.color,
        weight: 5,
        opacity: 0.8,
        lineJoin: "round",
        lineCap: "round",
        className: "flow-line",
      }).addTo(mapRef.current)

      // Add tooltip with speed info
      polyline.bindTooltip(`${flow.currentSpeed} km/h (Free flow: ${flow.freeFlowSpeed} km/h)`, {
        sticky: true,
        className: "custom-tooltip",
      })

      // Store polyline reference
      flowLinesRef.current[flow.id] = polyline
    } catch (err: any) {
      console.error(`Error adding flow line ${flow.id} to map:`, err)
    }
  }, [])

  // Remove flow line from map
  const removeFlowLineFromMap = useCallback((id: string) => {
    if (flowLinesRef.current[id] && mapRef.current) {
      mapRef.current.removeLayer(flowLinesRef.current[id])
      delete flowLinesRef.current[id]
    }
  }, [])

  // Update markers when traffic incidents change
  useEffect(() => {
    if (!mapRef.current) return

    try {
      // Get currently visible incident IDs
      const visibleIds = Object.keys(markersRef.current)

      // Add new markers for filtered incidents
      filteredIncidents.forEach((incident) => {
        if (!markersRef.current[incident.id]) {
          addIncidentToMap(incident)
        }
      })

      // Remove markers that are no longer in the filtered list
      visibleIds.forEach((id) => {
        if (!filteredIncidents.find((incident) => incident.id === id)) {
          removeIncidentFromMap(id)
        }
      })
    } catch (err: any) {
      console.error("Error updating incident markers:", err)
    }
  }, [filteredIncidents, addIncidentToMap, removeIncidentFromMap])

  // Update flow lines when traffic flows change
  useEffect(() => {
    if (!mapRef.current) return

    try {
      // Add new flow lines
      trafficFlows.forEach((flow) => {
        if (!flowLinesRef.current[flow.id]) {
          addFlowLineToMap(flow)
        }
      })

      // Remove old flow lines
      Object.keys(flowLinesRef.current).forEach((id) => {
        if (!trafficFlows.find((flow) => flow.id === id)) {
          removeFlowLineFromMap(id)
        }
      })
    } catch (err: any) {
      console.error("Error updating flow lines:", err)
    }
  }, [trafficFlows, addFlowLineToMap, removeFlowLineFromMap])

  // Connect to Pusher for real-time updates
  useEffect(() => {
    try {
      console.log("Connecting to Pusher with key:", process.env.NEXT_PUBLIC_PUSHER_KEY)

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "05169a630f5a8882ae8f", {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
      })

      pusher.connection.bind("connected", () => {
        console.log("Connected to Pusher!")
        setPusherConnected(true)
      })

      pusher.connection.bind("error", (err: any) => {
        console.error("Pusher connection error:", err)
        setError(`Pusher error: ${err.message || "Unknown error"}`)
      })

      const channel = pusher.subscribe("traffic-updates")

      channel.bind("new-incident", (data: TrafficIncident) => {
        console.log("New incident received:", data)
        setTrafficIncidents((prev) => [...prev, data])
      })

      channel.bind("update-incident", (data: { id: string; updates: Partial<TrafficIncident> }) => {
        setTrafficIncidents((prev) =>
          prev.map((incident) => (incident.id === data.id ? { ...incident, ...data.updates } : incident)),
        )
      })

      channel.bind("remove-incident", (data: { id: string }) => {
        setTrafficIncidents((prev) => prev.filter((incident) => incident.id !== data.id))
      })

      channel.bind("update-flow", (data: { flows: TrafficFlow[] }) => {
        setTrafficFlows(data.flows)
      })

      return () => {
        pusher.unsubscribe("traffic-updates")
        pusher.disconnect()
      }
    } catch (err: any) {
      console.error("Error setting up Pusher:", err)
      setError(`Failed to connect to Pusher: ${err.message}`)
    }
  }, [])

  // Custom zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  // Toggle filter
  const toggleFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Calculate traffic statistics
  const trafficStats = {
    accidents: trafficIncidents.filter((i) => i.type === "ACCIDENT").length,
    congestion: trafficIncidents.filter((i) => i.type === "CONGESTION").length,
    construction: trafficIncidents.filter((i) => i.type === "CONSTRUCTION").length,
    roadClosures: trafficIncidents.filter((i) => i.type === "ROAD_CLOSURE").length,
    other: trafficIncidents.filter((i) => i.type === "OTHER").length,
    highSeverity: trafficIncidents.filter((i) => i.severity === "HIGH").length,
    mediumSeverity: trafficIncidents.filter((i) => i.severity === "MEDIUM").length,
    lowSeverity: trafficIncidents.filter((i) => i.severity === "LOW").length,
    totalIncidents: trafficIncidents.length,
    roadSegments: trafficFlows.length,
    averageSpeed:
      trafficFlows.length > 0
        ? Math.round(trafficFlows.reduce((sum, flow) => sum + flow.currentSpeed, 0) / trafficFlows.length)
        : 0,
    congestionLevel:
      trafficFlows.length > 0
        ? Math.round(
            100 -
              (trafficFlows.reduce((sum, flow) => sum + flow.currentSpeed, 0) /
                trafficFlows.reduce((sum, flow) => sum + flow.freeFlowSpeed, 0)) *
                100,
          )
        : 0,
  }

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full overflow-hidden">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-500 border-t-emerald-500" />
            <p className="text-slate-300">Loading map data...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div id="map" className="absolute inset-0 z-0"></div>

      {/* Connection status */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-900/80 text-white px-4 py-2 rounded-md text-sm z-10">{error}</div>
      )}

      {pusherConnected && (
        <div className="absolute top-4 left-4 bg-emerald-900/80 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 z-10">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          WebSocket Connected
        </div>
      )}

      {/* Last updated timestamp */}
      {lastUpdated && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm z-10 flex items-center gap-2">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Selected incident info card */}
      {selectedIncident && (
        <Card className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-80 bg-slate-800/90 backdrop-blur-sm border-slate-700 text-white z-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium capitalize">{selectedIncident.type.toLowerCase().replace("_", " ")}</h3>
                <p className="text-sm text-slate-300">{selectedIncident.description}</p>
                {selectedIncident.roadName && (
                  <p className="text-xs text-slate-400 mt-1">Location: {selectedIncident.roadName}</p>
                )}
                {selectedIncident.delay && (
                  <p className="text-xs text-amber-400 mt-1">Delay: {Math.floor(selectedIncident.delay / 60)} min</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Coordinates: {selectedIncident.location.lat.toFixed(4)}, {selectedIncident.location.lng.toFixed(4)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                onClick={() => setSelectedIncident(null)}
              >
                ✕
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  selectedIncident.severity === "HIGH"
                    ? "bg-red-500"
                    : selectedIncident.severity === "MEDIUM"
                      ? "bg-amber-500"
                      : "bg-blue-500",
                )}
              />
              <span className="text-xs text-slate-300 capitalize">
                {selectedIncident.severity.toLowerCase()} severity
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700"
                onClick={toggleMapView}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{mapView === "standard" ? "Switch to Satellite" : "Switch to Standard"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                  <div className="p-2 text-xs font-medium">Incident Types</div>
                  <DropdownMenuCheckboxItem
                    checked={filters.showAccidents}
                    onCheckedChange={() => toggleFilter("showAccidents")}
                  >
                    Accidents
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showCongestion}
                    onCheckedChange={() => toggleFilter("showCongestion")}
                  >
                    Congestion
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showConstruction}
                    onCheckedChange={() => toggleFilter("showConstruction")}
                  >
                    Construction
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showRoadClosures}
                    onCheckedChange={() => toggleFilter("showRoadClosures")}
                  >
                    Road Closures
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showOther}
                    onCheckedChange={() => toggleFilter("showOther")}
                  >
                    Other
                  </DropdownMenuCheckboxItem>

                  <div className="p-2 text-xs font-medium">Severity</div>
                  <DropdownMenuCheckboxItem
                    checked={filters.showHighSeverity}
                    onCheckedChange={() => toggleFilter("showHighSeverity")}
                  >
                    High Severity
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showMediumSeverity}
                    onCheckedChange={() => toggleFilter("showMediumSeverity")}
                  >
                    Medium Severity
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showLowSeverity}
                    onCheckedChange={() => toggleFilter("showLowSeverity")}
                  >
                    Low Severity
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Filter Incidents</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-md z-10 text-white text-sm">
        <h4 className="font-medium mb-2">Traffic Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>High Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Medium Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Low Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-green-500"></span>
            <span>Free Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-amber-500"></span>
            <span>Slow Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-red-500"></span>
            <span>Heavy Traffic</span>
          </div>
        </div>
      </div>

      {/* Traffic stats summary */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm p-3 rounded-md z-10 text-white text-sm">
        <h4 className="font-medium mb-2">Traffic Summary</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center justify-between">
            <span>Accidents:</span>
            <span className="font-medium">{trafficStats.accidents}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Congestion:</span>
            <span className="font-medium">{trafficStats.congestion}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Construction:</span>
            <span className="font-medium">{trafficStats.construction}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Road Closures:</span>
            <span className="font-medium">{trafficStats.roadClosures}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Incidents:</span>
            <span className="font-medium">{trafficStats.totalIncidents}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Road Segments:</span>
            <span className="font-medium">{trafficStats.roadSegments}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg. Speed:</span>
            <span className="font-medium">{trafficStats.averageSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Congestion Level:</span>
            <span
              className={cn(
                "font-medium",
                trafficStats.congestionLevel > 50
                  ? "text-red-400"
                  : trafficStats.congestionLevel > 25
                    ? "text-amber-400"
                    : "text-green-400",
              )}
            >
              {trafficStats.congestionLevel}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

