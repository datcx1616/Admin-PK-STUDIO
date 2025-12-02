import { MousePointer, Percent, Eye, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AnalyticsResponse } from "./types"
import { formatNumber, formatPercent } from "./utils"

interface AudienceCardsProps {
    analytics: AnalyticsResponse
}

export function AudienceCards({ analytics }: AudienceCardsProps) {
    if (!analytics.retention) return null

    // Debug: Log retention data
    console.log('🎯 AudienceCards retention data:', analytics.retention)

    const audienceCards = [
        {
            label: "CTR (Click-through Rate)",
            value: analytics.retention.impressionClickThroughRate || analytics.retention.ctr || 0,
            formatted: formatPercent(analytics.retention.impressionClickThroughRate || analytics.retention.ctr || 0),
            icon: MousePointer,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            progress: (analytics.retention.impressionClickThroughRate || analytics.retention.ctr || 0) * 10,
            subtitle: "Tỷ lệ click vào video"
        },
        {
            label: "Average View %",
            value: analytics.retention.averageViewPercentage,
            formatted: formatPercent(analytics.retention.averageViewPercentage),
            icon: Percent,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            progress: analytics.retention.averageViewPercentage,
            subtitle: "% video được xem"
        },
        {
            label: "Impressions",
            value: analytics.retention.impressions,
            formatted: formatNumber(analytics.retention.impressions),
            icon: Eye,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            progress: 80,
            subtitle: `CTR: ${formatPercent(analytics.retention.impressionClickThroughRate || 0)}`
        },
        {
            label: "Card Click Rate",
            value: analytics.retention.cardClickRate || 0,
            formatted: formatPercent(analytics.retention.cardClickRate || 0),
            icon: MousePointer,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            progress: (analytics.retention.cardClickRate || 0) * 10,
            subtitle: `Teaser: ${formatPercent(analytics.retention.cardTeaserClickRate || 0)}`
        },
        {
            label: "Annotation CTR",
            value: analytics.retention.annotationClickThroughRate || 0,
            formatted: formatPercent(analytics.retention.annotationClickThroughRate || 0),
            icon: Target,
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            progress: (analytics.retention.annotationClickThroughRate || 0) * 10,
            subtitle: `Close: ${formatPercent(analytics.retention.annotationCloseRate || 0)}`
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {audienceCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-gray-900 mb-3">{stat.formatted}</div>
                        <Progress value={stat.progress} className="h-2 mb-2" />
                        {stat.subtitle && (
                            <div className="text-xs text-gray-500">{stat.subtitle}</div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
