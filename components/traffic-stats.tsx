"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Car, Construction, TrendingUp } from "lucide-react"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"

export function TrafficStats() {
  const [stats, setStats] = useState({
    accidents: 12,
    congestion: 78,
    construction: 23,
    trend: "up",
  })

  // Simulate changing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        accidents: Math.max(0, prev.accidents + Math.floor(Math.random() * 3) - 1),
        congestion: Math.max(0, prev.congestion + Math.floor(Math.random() * 5) - 2),
        construction: prev.construction,
        trend: Math.random() > 0.5 ? "up" : "down",
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200">
          <span className={cn("w-2 h-2 rounded-full", stats.trend === "up" ? "bg-red-500" : "bg-green-500")} />
          <span className="text-xs font-medium">Traffic Status</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-slate-800 border-slate-700 text-slate-200">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Current Traffic Conditions</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-slate-700/50">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-bold">{stats.accidents}</span>
              <span className="text-xs text-slate-400">Accidents</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-slate-700/50">
              <Car className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-bold">{stats.congestion}%</span>
              <span className="text-xs text-slate-400">Congestion</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-slate-700/50">
              <Construction className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-bold">{stats.construction}</span>
              <span className="text-xs text-slate-400">Roadworks</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className={cn("h-4 w-4", stats.trend === "up" ? "text-red-500" : "text-green-500")} />
            <span>Traffic {stats.trend === "up" ? "increasing" : "decreasing"} compared to average</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

