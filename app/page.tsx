import TrafficMap from "@/components/traffic-map"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <TrafficMap />
          </div>
        </div>
      </main>
      <footer className="border-t border-slate-700 py-4 text-center text-sm text-slate-400">
        <div className="container mx-auto">Real-time traffic data powered by WebSockets</div>
      </footer>
    </div>
  )
}

