"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"

const Silk = dynamic(() => import("@/components/ui/silk-background"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(
        error.code === "auth/invalid-credential"
          ? "Неверный email или пароль"
          : "Ошибка при входе. Пожалуйста, попробуйте снова.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email && password && !isLoading) {
      handleLogin()
    }
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 z-0">
        <Silk speed={3} scale={2} noiseIntensity={1.2} rotation={Math.PI / 6} />
      </div>

      {/* Форма входа */}
      <Card className="relative z-10 w-full max-w-md backdrop-blur-sm bg-background/80 border border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">MAESTRO Admin</CardTitle>
          <CardDescription>Войдите в административную консоль</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin} disabled={isLoading || !email || !password}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
