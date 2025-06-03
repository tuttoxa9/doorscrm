"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/use-auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Loader2, Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save sidebar state to localStorage
  const handleSidebarToggle = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState))
  }

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
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Открыть меню</span>
          </Button>
          <div className="ml-3">
            <span className="text-xl font-bold">MAESTRO</span>
            <span className="text-sm text-muted-foreground ml-1">Admin</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
