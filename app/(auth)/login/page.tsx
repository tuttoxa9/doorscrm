"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [cardMousePosition, setCardMousePosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null)
  const router = useRouter()

  // Track mouse movement for dynamic light effects within card bounds
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Global mouse position for background
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })

      // Card-specific mouse position for light effects
      if (cardRef) {
        const rect = cardRef.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Only update if mouse is within card bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setCardMousePosition({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
          })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cardRef])

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
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* Subtle Background */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(
              ellipse 800px 600px at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(71, 85, 105, 0.3) 0%,
              rgba(51, 65, 85, 0.5) 40%,
              rgba(30, 41, 59, 0.8) 70%,
              rgba(15, 23, 42, 1) 100%
            )
          `
        }}
      />

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {/* Floating particles */}
        <div
          className="absolute w-4 h-4 rounded-full opacity-40 blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            left: `${20 + mousePosition.x * 0.05}%`,
            top: `${10 + mousePosition.y * 0.05}%`,
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-3 h-3 rounded-full opacity-50 blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            right: `${15 + mousePosition.x * 0.03}%`,
            bottom: `${20 + mousePosition.y * 0.03}%`,
            animation: 'float 12s ease-in-out infinite reverse'
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full opacity-60 blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            left: `${70 + mousePosition.x * 0.02}%`,
            top: `${30 + mousePosition.y * 0.02}%`,
            animation: 'float 10s ease-in-out infinite'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-screen w-full items-center justify-center p-4">
        <div
          ref={setCardRef}
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* White Light Source Behind Card */}
          <div
            className="absolute inset-0 rounded-xl transition-all duration-300 ease-out"
            style={{
              background: `
                radial-gradient(
                  ellipse ${300 + cardMousePosition.x * 2}px ${200 + cardMousePosition.y * 2}px at ${cardMousePosition.x}% ${cardMousePosition.y}%,
                  rgba(255, 255, 255, 0.8) 0%,
                  rgba(255, 255, 255, 0.6) 20%,
                  rgba(255, 255, 255, 0.4) 40%,
                  rgba(255, 255, 255, 0.2) 60%,
                  rgba(255, 255, 255, 0.1) 80%,
                  transparent 100%
                )
              `,
              transform: `
                translate3d(0, 0, -20px)
                scale(${isHovered ? 1.2 : 1.1})
              `,
              filter: `blur(${isHovered ? '30px' : '25px'})`,
              zIndex: -1
            }}
          />

          {/* Directional Light Rays */}
          <div
            className="absolute inset-0 rounded-xl transition-all duration-500 ease-out"
            style={{
              background: `
                conic-gradient(
                  from ${cardMousePosition.x * 3 + cardMousePosition.y * 2}deg at ${cardMousePosition.x}% ${cardMousePosition.y}%,
                  rgba(255, 255, 255, 0.3) 0deg,
                  transparent 45deg,
                  rgba(255, 255, 255, 0.2) 90deg,
                  transparent 135deg,
                  rgba(255, 255, 255, 0.3) 180deg,
                  transparent 225deg,
                  rgba(255, 255, 255, 0.2) 270deg,
                  transparent 315deg,
                  rgba(255, 255, 255, 0.3) 360deg
                )
              `,
              transform: `
                translate3d(0, 0, -15px)
                scale(${isHovered ? 1.3 : 1.2})
                rotate(${cardMousePosition.x * 0.2 - cardMousePosition.y * 0.1}deg)
              `,
              filter: `blur(20px)`,
              zIndex: -1
            }}
          />

          {/* Card Shadow */}
          <div
            className="absolute inset-0 rounded-xl transition-all duration-700 ease-out"
            style={{
              background: `
                radial-gradient(
                  ellipse at ${100 - cardMousePosition.x}% ${100 - cardMousePosition.y}%,
                  rgba(0, 0, 0, 0.4) 0%,
                  rgba(0, 0, 0, 0.6) 30%,
                  rgba(0, 0, 0, 0.8) 60%,
                  rgba(0, 0, 0, 0.9) 100%
                )
              `,
              transform: `
                translate3d(
                  ${(cardMousePosition.x - 50) * 0.3}px,
                  ${(cardMousePosition.y - 50) * 0.3 + 15}px,
                  -25px
                )
                scale(${isHovered ? 1.1 : 1})
              `,
              filter: `blur(${isHovered ? '25px' : '20px'})`,
              zIndex: -1
            }}
          />

          {/* Main Card with 3D Transform and Light Interaction */}
          <Card
            className="w-full max-w-md relative z-20 transition-all duration-700 ease-out"
            style={{
              background: `
                linear-gradient(
                  ${135 + cardMousePosition.x * 0.5}deg,
                  rgba(255, 255, 255, ${0.12 + cardMousePosition.x * 0.001}) 0%,
                  rgba(255, 255, 255, ${0.08 + cardMousePosition.y * 0.001}) 50%,
                  rgba(255, 255, 255, ${0.1 + (cardMousePosition.x + cardMousePosition.y) * 0.0005}) 100%
                )
              `,
              border: `1px solid rgba(255, 255, 255, ${0.2 + (cardMousePosition.x + cardMousePosition.y) * 0.002})`,
              backdropFilter: 'blur(20px)',
              transform: `
                perspective(1200px)
                rotateX(${isHovered ? -3 : (cardMousePosition.y - 50) * 0.1}deg)
                rotateY(${isHovered ? 3 : (cardMousePosition.x - 50) * 0.1}deg)
                translateZ(${isHovered ? 25 : 10}px)
                scale(${isHovered ? 1.02 : 1})
              `,
              boxShadow: `
                0 ${isHovered ? 35 : 25}px ${isHovered ? 70 : 50}px rgba(0, 0, 0, 0.4),
                0 ${isHovered ? 20 : 15}px ${isHovered ? 40 : 30}px rgba(0, 0, 0, 0.3),
                0 0 ${isHovered ? 50 : 30}px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, ${0.15 + cardMousePosition.x * 0.002}),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            <CardHeader className="space-y-1 text-center">
              <CardTitle
                className="text-2xl font-bold text-white transition-all duration-300"
                style={{
                  textShadow: `
                    0 0 15px rgba(255, 255, 255, 0.3),
                    0 0 30px rgba(255, 255, 255, 0.2),
                    0 2px 4px rgba(0, 0, 0, 0.3)
                  `
                }}
              >
                MAESTRO Admin
              </CardTitle>
              <CardDescription
                className="transition-all duration-300"
                style={{
                  color: `rgba(255, 255, 255, ${0.7 + cardMousePosition.x * 0.002})`,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              >
                Войдите в административную консоль
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert
                    variant="destructive"
                    className="text-white transition-all duration-300"
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="transition-all duration-300"
                    style={{
                      color: `rgba(255, 255, 255, ${0.8 + cardMousePosition.x * 0.002})`,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    autoFocus
                    className="text-white transition-all duration-300"
                    style={{
                      background: `rgba(255, 255, 255, ${0.08 + cardMousePosition.x * 0.001})`,
                      border: `1px solid rgba(255, 255, 255, ${0.25 + cardMousePosition.y * 0.002})`,
                      backdropFilter: 'blur(10px)',
                      boxShadow: `
                        inset 0 2px 4px rgba(0, 0, 0, 0.2),
                        0 1px 0 rgba(255, 255, 255, ${0.15 + cardMousePosition.x * 0.001}),
                        0 0 10px rgba(255, 255, 255, 0.1)
                      `,
                      '::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="transition-all duration-300"
                    style={{
                      color: `rgba(255, 255, 255, ${0.8 + cardMousePosition.y * 0.002})`,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Пароль
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    className="text-white transition-all duration-300"
                    style={{
                      background: `rgba(255, 255, 255, ${0.08 + cardMousePosition.y * 0.001})`,
                      border: `1px solid rgba(255, 255, 255, ${0.25 + cardMousePosition.x * 0.002})`,
                      backdropFilter: 'blur(10px)',
                      boxShadow: `
                        inset 0 2px 4px rgba(0, 0, 0, 0.2),
                        0 1px 0 rgba(255, 255, 255, ${0.15 + cardMousePosition.y * 0.001}),
                        0 0 10px rgba(255, 255, 255, 0.1)
                      `
                    }}
                  />
                </div>
              </form>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full relative overflow-hidden border-0 text-white font-semibold transition-all duration-300 group"
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                style={{
                  background: `
                    linear-gradient(
                      ${135 + cardMousePosition.x * 0.5}deg,
                      rgba(255, 255, 255, ${0.15 + cardMousePosition.x * 0.002}) 0%,
                      rgba(255, 255, 255, ${0.1 + cardMousePosition.y * 0.002}) 50%,
                      rgba(255, 255, 255, ${0.12 + (cardMousePosition.x + cardMousePosition.y) * 0.001}) 100%
                    )
                  `,
                  backdropFilter: 'blur(15px)',
                  boxShadow: `
                    0 8px 25px rgba(0, 0, 0, 0.3),
                    0 4px 15px rgba(0, 0, 0, 0.2),
                    0 0 20px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, ${0.2 + cardMousePosition.x * 0.002}),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                  `
                }}
              >
                {/* Button glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `
                      radial-gradient(
                        circle at ${cardMousePosition.x}% ${cardMousePosition.y}%,
                        rgba(255, 255, 255, 0.3) 0%,
                        rgba(255, 255, 255, 0.1) 50%,
                        transparent 100%
                      )
                    `
                  }}
                />

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
      </div>

      {/* CSS Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.6;
          }
        }

        body {
          overflow: hidden;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        input:focus::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </div>
  )
}
