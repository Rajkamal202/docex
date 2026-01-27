"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Briefcase, Target, TrendingUp, MessageSquare, Lightbulb, Users, Pencil } from "lucide-react"

interface EditableTextProps {
  id: string
  value: string
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  isEnhancing?: boolean
  style?: React.CSSProperties
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div"
  multiline?: boolean
  placeholder?: string
}

export function EditableText({
  id,
  value,
  onChange,
  onEnhance,
  isEnhancing,
  style,
  className,
  as: Component = "p",
  multiline = false,
  placeholder = "Click to edit...",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSelected(false)
        if (isEditing) {
          handleSave()
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isEditing, localValue])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (localValue !== value) {
      onChange(id, localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  const enhancementOptions = [
    { id: "professional", label: "More Professional", icon: Briefcase },
    { id: "persuasive", label: "More Persuasive", icon: Target },
    { id: "expand", label: "Expand Content", icon: TrendingUp },
    { id: "concise", label: "Make Concise", icon: MessageSquare },
    { id: "clarity", label: "Improve Clarity", icon: Lightbulb },
    { id: "friendly", label: "More Friendly", icon: Users },
  ]

  const displayValue = localValue || placeholder

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isEditing}>
        <div
          ref={containerRef}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className={cn(
            "relative cursor-pointer transition-all duration-150 group",
            isSelected && !isEditing && "ring-2 ring-blue-500 ring-offset-1",
            isEnhancing && "opacity-50 pointer-events-none",
            className,
          )}
          style={{ ...style, minHeight: style?.fontSize || "1em" }}
        >
          {isEditing ? (
            multiline ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-white text-black p-1 border-2 border-blue-500 rounded resize-none outline-none"
                style={{
                  ...style,
                  color: "#000",
                  backgroundColor: "#fff",
                  minHeight: "60px",
                }}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full bg-white text-black p-1 border-2 border-blue-500 rounded outline-none"
                style={{
                  ...style,
                  color: "#000",
                  backgroundColor: "#fff",
                }}
              />
            )
          ) : (
            <>
              <Component style={style} className={cn(!localValue && "opacity-50")}>
                {displayValue}
              </Component>

              {/* Hover controls */}
              {isSelected && (
                <div className="absolute -top-8 left-0 flex items-center gap-1 bg-black/80 rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <Pencil className="h-3 w-3" />
                  <span>Double-click to edit</span>
                  <span className="mx-1">|</span>
                  <Sparkles className="h-3 w-3" />
                  <span>Right-click for AI</span>
                </div>
              )}

              {/* Selection handles */}
              {isSelected && (
                <>
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                </>
              )}
            </>
          )}

          {isEnhancing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Text
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Enhance
        </div>
        {enhancementOptions.map((option) => (
          <DropdownMenuItem key={option.id} onClick={() => onEnhance?.(id, option.id)} disabled={isEnhancing}>
            <option.icon className="h-4 w-4 mr-2" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
