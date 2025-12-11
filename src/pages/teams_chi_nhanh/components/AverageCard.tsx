import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AverageCard({
    icon: Icon,
    title,
    value,
    color,
    bgColor
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string
    color: string
    bgColor: string
}) {
    return (
        <Card className="border-2">
            <CardContent className={cn("p-6", bgColor)}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className={cn("text-3xl font-bold", color)}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
