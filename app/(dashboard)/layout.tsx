"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/use-auth"
import { NavigationDock } from "@/components/dashboard/navigation-dock"
import { Loader2 } from "lucide-react"

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center">
          <span className="text-2xl font-bold">MAESTRO</span>
          <span className="text-sm text-muted-foreground ml-2">Admin</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 pb-24">{children}</main>

      {/* Navigation Dock */}
      <NavigationDock />
    </div>
  )
}
