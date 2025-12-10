import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

export function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    trend
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string
    subtitle?: string
    gradient: string
    trend?: 'up' | 'down'
}) {
    return (
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-90", gradient)} />
            <CardContent className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                    <Icon className="h-6 w-6 opacity-80" />
                    {trend && (
                        <TrendingUp className={cn(
                            "h-4 w-4",
                            trend === 'down' && "rotate-180"
                        )} />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium opacity-90">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs opacity-75">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
