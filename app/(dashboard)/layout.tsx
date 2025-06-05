"use client"

import type React from "react"
import dynamic from "next/dynamic"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/use-auth"
import { NavigationDock } from "@/components/dashboard/navigation-dock"
import { Loader2 } from "lucide-react"

// Динамический импорт Aurora для избежания SSR проблем
const Aurora = dynamic(() => import("@/components/ui/aurora"), { ssr: false })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#00d8ff", "#7cff67", "#00d8ff"]}
          amplitude={1.0}
          blend={0.5}
        />
      </div>

      {/* Compact Interface Container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
        <div className="w-full max-w-7xl h-full max-h-[calc(100vh-160px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border border-border/50 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Compact Header */}
          <div className="flex items-center justify-center py-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center">
              <span className="text-lg font-bold">MAESTRO</span>
              <span className="text-xs text-muted-foreground ml-2">Admin</span>
            </div>
          </div>

          {/* Compact Main Content */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>

      {/* Navigation Dock */}
      <NavigationDock />
    </div>
  )
}
