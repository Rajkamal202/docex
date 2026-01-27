"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface NoiseBackgroundProps {
  children?: React.ReactNode
  className?: string
  speed?: number
}

export function NoiseBackground({ children, className = "", speed = 0.003 }: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width * dpr)
      const height = Math.max(1, rect.height * dpr)
      canvas.width = width
      canvas.height = height
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      timeRef.current += speed

      if (canvas.width <= 0 || canvas.height <= 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const createNoise = (w: number, h: number) => {
        if (w <= 0 || h <= 0) return null
        const imageData = ctx.createImageData(w, h)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const value = Math.random() * 255
          data[i] = value
          data[i + 1] = value
          data[i + 2] = value
          data[i + 3] = 15 // Low opacity for subtle noise
        }
        return imageData
      }

      const noisePattern = createNoise(canvas.width, canvas.height)
      if (!noisePattern) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const gradient = ctx.createLinearGradient(
        width * (0.5 + 0.5 * Math.sin(timeRef.current)),
        0,
        width * (0.5 + 0.5 * Math.cos(timeRef.current * 0.7)),
        height,
      )

      const hue1 = (timeRef.current * 20) % 360
      const hue2 = (hue1 + 40) % 360
      const hue3 = (hue1 + 80) % 360

      gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, 1)`)
      gradient.addColorStop(0.5, `hsla(${hue2}, 85%, 55%, 1)`)
      gradient.addColorStop(1, `hsla(${hue3}, 75%, 50%, 1)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.putImageData(noisePattern, 0, 0)

      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [speed])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: "contrast(1.1) brightness(1.05)" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
