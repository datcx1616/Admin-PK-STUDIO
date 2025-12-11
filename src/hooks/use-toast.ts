"use client"

import * as React from "react"
import type { ToastProps } from "@/components/ui/toast"

export interface ToastItem extends ToastProps {
  id: string
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...props, id }])
    return id
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, toast, dismiss }
}
