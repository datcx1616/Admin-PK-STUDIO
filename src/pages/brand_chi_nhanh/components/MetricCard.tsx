import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface MetricCardProps {
    icon: LucideIcon
    title: string
    value: string
    subtitle?: string
    gradient: string
}

export function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient
}: MetricCardProps) {
    return (
        <Card className={cn("relative overflow-hidden border-0 shadow-lg", gradient)}>
            <CardContent className="relative p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-6 w-6 opacity-80" />
                </div>
                <p className="text-sm font-medium opacity-90">{title}</p>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {subtitle && (
                    <p className="text-xs opacity-75 mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    )
}
