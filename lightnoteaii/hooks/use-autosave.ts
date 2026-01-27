"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface DraftVersion {
  id: string
  timestamp: Date
  data: Record<string, unknown>
  label?: string
}

interface UseAutosaveOptions {
  key: string
  interval?: number // in milliseconds
  maxVersions?: number
}

export function useAutosave<T extends Record<string, unknown>>(data: T, options: UseAutosaveOptions) {
  const { key, interval = 30000, maxVersions = 10 } = options
  const [versions, setVersions] = useState<DraftVersion[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dataRef = useRef(data)

  // Keep ref updated
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Load versions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`${key}_versions`)
    if (stored) {
      const parsed = JSON.parse(stored)
      setVersions(
        parsed.map((v: DraftVersion) => ({
          ...v,
          timestamp: new Date(v.timestamp),
        })),
      )
    }
    const lastSavedStr = localStorage.getItem(`${key}_lastSaved`)
    if (lastSavedStr) {
      setLastSaved(new Date(lastSavedStr))
    }
  }, [key])

  // Save function
  const save = useCallback(
    (label?: string) => {
      setIsSaving(true)

      const newVersion: DraftVersion = {
        id: Date.now().toString(),
        timestamp: new Date(),
        data: dataRef.current,
        label,
      }

      setVersions((prev) => {
        const updated = [newVersion, ...prev].slice(0, maxVersions)
        localStorage.setItem(`${key}_versions`, JSON.stringify(updated))
        return updated
      })

      localStorage.setItem(`${key}_current`, JSON.stringify(dataRef.current))
      localStorage.setItem(`${key}_lastSaved`, new Date().toISOString())
      setLastSaved(new Date())

      setTimeout(() => setIsSaving(false), 500)
    },
    [key, maxVersions],
  )

  // Auto-save on interval
  useEffect(() => {
    if (Object.keys(data).length === 0) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      save()
    }, interval)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [data, interval, save])

  // Restore a version
  const restoreVersion = useCallback(
    (versionId: string): T | null => {
      const version = versions.find((v) => v.id === versionId)
      if (version) {
        return version.data as T
      }
      return null
    },
    [versions],
  )

  // Load current draft
  const loadDraft = useCallback((): T | null => {
    const stored = localStorage.getItem(`${key}_current`)
    if (stored) {
      return JSON.parse(stored) as T
    }
    return null
  }, [key])

  // Clear all drafts
  const clearDrafts = useCallback(() => {
    localStorage.removeItem(`${key}_versions`)
    localStorage.removeItem(`${key}_current`)
    localStorage.removeItem(`${key}_lastSaved`)
    setVersions([])
    setLastSaved(null)
  }, [key])

  // Delete a specific version
  const deleteVersion = useCallback(
    (versionId: string) => {
      setVersions((prev) => {
        const updated = prev.filter((v) => v.id !== versionId)
        localStorage.setItem(`${key}_versions`, JSON.stringify(updated))
        return updated
      })
    },
    [key],
  )

  return {
    versions,
    lastSaved,
    isSaving,
    save,
    restoreVersion,
    loadDraft,
    clearDrafts,
    deleteVersion,
  }
}
