"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { createNoise3D } from "simplex-noise"

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  [key: string]: unknown
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>(0)
  const ntRef = useRef<number>(0)
  const noiseRef = useRef(createNoise3D())

  const [isSafari, setIsSafari] = useState(false)

  const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]

  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.001
      case "fast":
        return 0.006
      default:
        return 0.003
    }
  }, [speed])

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    )
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = (ctx.canvas.width = window.innerWidth)
    let h = (ctx.canvas.height = window.innerHeight)
    ctx.filter = `blur(${blur}px)`

    const handleResize = () => {
      if (!ctx) return
      w = ctx.canvas.width = window.innerWidth
      h = ctx.canvas.height = window.innerHeight
      ctx.filter = `blur(${blur}px)`
    }

    window.addEventListener("resize", handleResize)

    const drawWave = (n: number) => {
      ntRef.current += getSpeed()
      for (let i = 0; i < n; i++) {
        ctx.beginPath()
        ctx.lineWidth = waveWidth || 50
        ctx.strokeStyle = waveColors[i % waveColors.length]
        for (let x = 0; x < w; x += 5) {
          const y = noiseRef.current(x / 800, 0.3 * i, ntRef.current) * 100
          ctx.lineTo(x, y + h * 0.5)
        }
        ctx.stroke()
        ctx.closePath()
      }
    }

    const render = () => {
      ctx.fillStyle = backgroundFill || "white"
      ctx.globalAlpha = waveOpacity
      ctx.fillRect(0, 0, w, h)
      drawWave(5)
      animationIdRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationIdRef.current)
    }
  }, [blur, backgroundFill, waveOpacity, waveWidth, waveColors, getSpeed])

  return (
    <div className={cn("flex h-screen flex-col items-center justify-center", containerClassName)}>
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  )
}
