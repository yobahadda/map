import { Bell, Menu, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TrafficStats } from "@/components/traffic-stats"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 text-slate-100 border-slate-700">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Traffic Alerts
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Route Planning
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-white">Casablanca Traffic</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="text-slate-300 hover:text-white transition-colors">
              Traffic Alerts
            </Link>
            <Link href="#" className="text-slate-300 hover:text-white transition-colors">
              Route Planning
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="w-[200px] pl-8 bg-slate-800 border-slate-700 text-slate-300 focus-visible:ring-slate-500"
            />
          </div>
          <TrafficStats />
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">Live View</Button>
        </div>
      </div>
    </header>
  )
}

