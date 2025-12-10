import { Eye, Clock, Users, PlayCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsResponse } from "./types"
import { formatNumber, formatDuration } from "./utils"

interface OverviewCardsProps {
    analytics: AnalyticsResponse
}

export function OverviewCards({ analytics }: OverviewCardsProps) {
    const overviewCards = [
        {
            label: "Lượt xem",
            value: analytics?.basic?.totals.totalViews || 0,
            formatted: formatNumber(analytics?.basic?.totals.totalViews || 0),
            icon: Eye,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            change: "+12.5%",
            changePositive: true
        },
        {
            label: "Giờ xem",
            value: parseFloat(analytics?.basic?.totals.totalWatchTimeHours || '0'),
            formatted: analytics?.basic?.totals.totalWatchTimeHours || '0',
            icon: Clock,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            subtitle: `${formatNumber(analytics?.basic?.totals.totalWatchTimeMinutes || 0)} phút`,
            change: "+8.3%",
            changePositive: true
        },
        {
            label: "Người đăng ký (Net)",
            value: analytics?.basic?.totals.totalSubscribersNet || 0,
            formatted: (analytics?.basic?.totals.totalSubscribersNet || 0) >= 0
                ? `+${formatNumber(analytics?.basic?.totals.totalSubscribersNet || 0)}`
                : formatNumber(analytics?.basic?.totals.totalSubscribersNet || 0),
            icon: Users,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            subtitle: `+${formatNumber(analytics?.basic?.totals.totalSubscribersGained || 0)} / -${formatNumber(analytics?.basic?.totals.totalSubscribersLost || 0)}`,
            change: "+15.7%",
            changePositive: true
        },
        {
            label: "Thời lượng TB",
            value: analytics?.basic?.totals.averageViewDuration || 0,
            formatted: formatDuration(Math.floor(analytics?.basic?.totals.averageViewDuration || 0)),
            icon: PlayCircle,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            subtitle: "Mỗi lượt xem",
            change: "+5.2%",
            changePositive: true
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewCards.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            {stat.change && (
                                <Badge variant={stat.changePositive ? "default" : "destructive"} className="text-xs">
                                    {stat.changePositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.change}
                                </Badge>
                            )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-gray-900">{stat.formatted}</div>
                        {stat.subtitle && (
                            <div className="text-xs text-gray-500 mt-2">{stat.subtitle}</div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
