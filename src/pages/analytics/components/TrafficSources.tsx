import { Globe } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AnalyticsResponse } from "./types"
import { formatNumber, getTrafficSourceName } from "./utils"

interface TrafficSourcesProps {
    analytics: AnalyticsResponse
}

export function TrafficSources({ analytics }: TrafficSourcesProps) {
    if (!analytics.traffic || analytics.traffic.sources.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Traffic Sources
                </CardTitle>
                <CardDescription>Top source: {getTrafficSourceName(analytics.traffic?.topSource || '')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {analytics.traffic.sources.map((source, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-700">
                                        {getTrafficSourceName(source.sourceType)}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {formatNumber(source.views)} views • {formatNumber(source.watchTimeMinutes)} mins
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{source.percentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={source.percentage} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
