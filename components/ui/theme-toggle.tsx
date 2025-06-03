"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle({ inDock = false }: { inDock?: boolean }) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={inDock ? "ghost" : "outline"}
          size={inDock ? "sm" : "icon"}
          className={inDock ? "h-full w-full p-0" : ""}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={inDock ? "top" : "bottom"}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Светлая
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Темная
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Системная
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
