"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    variant?: "default" | "destructive"
    onClose?: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
    ({ className, title, description, variant = "default", onClose, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "pointer-events-auto relative flex w-full items-start justify-between rounded-md border p-4 shadow-md",
                    variant === "destructive"
                        ? "border-red-500 bg-red-600 text-white"
                        : "bg-white text-black",
                    className
                )}
                {...props}
            >
                <div className="flex flex-col space-y-1">
                    {title && <p className="font-semibold">{title}</p>}
                    {description && (
                        <p className="text-sm opacity-80">{description}</p>
                    )}
                </div>

                <button
                    className="absolute right-2 top-2 rounded-md p-1 opacity-60 hover:opacity-100"
                    onClick={onClose}
                >
                    ✕
                </button>
            </div>
        )
    }
)

Toast.displayName = "Toast"
