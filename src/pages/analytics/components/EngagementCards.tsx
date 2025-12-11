import { Activity, ThumbsUp, MessageSquare, Share2, TrendingUp, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AnalyticsResponse } from "./types"
import { formatNumber, formatPercent } from "./utils"

interface EngagementCardsProps {
    analytics: AnalyticsResponse
}

export function EngagementCards({ analytics }: EngagementCardsProps) {
    if (!analytics.engagement) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Dữ liệu engagement không khả dụng</p>
                    <p className="text-sm text-gray-400 mt-2">
                        {analytics.meta?.dataUnavailable?.includes('engagement')
                            ? 'Backend đang xử lý dữ liệu engagement'
                            : 'Chọn include=all để xem metrics này'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const engagementCards = [
        {
            label: "Engagement Rate",
            value: analytics.engagement.totals.engagementRate,
            formatted: formatPercent(analytics.engagement.totals.engagementRate),
            icon: Activity,
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            progress: Math.min(analytics.engagement.totals.engagementRate * 10, 100)
        },
        {
            label: "Likes",
            value: analytics.engagement.totals.totalLikes,
            formatted: formatNumber(analytics.engagement.totals.totalLikes),
            icon: ThumbsUp,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            progress: Math.min((analytics.engagement.totals.totalLikes / (analytics.basic?.totals.totalViews || 1)) * 1000, 100)
        },
        {
            label: "Comments",
            value: analytics.engagement.totals.totalComments,
            formatted: formatNumber(analytics.engagement.totals.totalComments),
            icon: MessageSquare,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            progress: Math.min((analytics.engagement.totals.totalComments / (analytics.basic?.totals.totalViews || 1)) * 1000, 100)
        },
        {
            label: "Shares",
            value: analytics.engagement.totals.totalShares,
            formatted: formatNumber(analytics.engagement.totals.totalShares),
            icon: Share2,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            progress: Math.min((analytics.engagement.totals.totalShares / (analytics.basic?.totals.totalViews || 1)) * 1000, 100)
        },
        {
            label: "Like/Dislike Ratio",
            value: analytics.engagement.totals.likeDislikeRatio,
            formatted: formatPercent(analytics.engagement.totals.likeDislikeRatio),
            icon: TrendingUp,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            progress: analytics.engagement.totals.likeDislikeRatio
        },
        {
            label: "Retention Rate",
            value: analytics.retention?.averageViewPercentage || 0,
            formatted: formatPercent(analytics.retention?.averageViewPercentage || 0),
            icon: Target,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            progress: analytics.retention?.averageViewPercentage || 0
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engagementCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-3">{stat.formatted}</div>
                        <Progress value={stat.progress} className="h-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
