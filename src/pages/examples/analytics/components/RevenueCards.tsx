import { DollarSign, Video, TrendingUp, BarChart3, PlayCircle, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsResponse, DateRangeType } from "./types"
import { formatCurrency, formatNumber } from "./utils"

interface RevenueCardsProps {
    analytics: AnalyticsResponse
    dateRange: DateRangeType
}

export function RevenueCards({ analytics, dateRange }: RevenueCardsProps) {
    console.log(analytics)
    if (!analytics.revenue) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Dữ liệu revenue không khả dụng</p>
                    <p className="text-sm text-gray-400 mt-2">
                        {analytics.meta?.dataUnavailable?.includes('revenue')
                            ? 'Channel chưa monetize hoặc không có quyền revenue metrics'
                            : 'Chọn include=all hoặc include=revenue để xem metrics này'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const revenueCards = [
        {
            label: "Estimated Revenue",
            value: analytics.revenue.totals.estimatedRevenue,
            formatted: formatCurrency(analytics.revenue.totals.estimatedRevenue, analytics.revenue.currency),
            icon: DollarSign,
            iconBg: "bg-green-500",
            iconColor: "text-white",
            subtitle: `${dateRange === '7days' ? '7' : dateRange === '30days' ? '30' : '90'} ngày`,
            large: true
        },
        {
            label: "Ad Revenue",
            value: analytics.revenue.totals.estimatedAdRevenue,
            formatted: formatCurrency(analytics.revenue.totals.estimatedAdRevenue, analytics.revenue.currency),
            icon: DollarSign,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            subtitle: "Từ quảng cáo"
        },
        {
            label: "YouTube Premium Revenue",
            value: analytics.revenue.totals.estimatedRedPartnerRevenue,
            formatted: formatCurrency(analytics.revenue.totals.estimatedRedPartnerRevenue, analytics.revenue.currency),
            icon: Video,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            subtitle: "Từ YouTube Premium"
        },
        {
            label: "RPM",
            value: analytics.revenue.totals.rpm,
            formatted: formatCurrency(analytics.revenue.totals.rpm, analytics.revenue.currency),
            icon: TrendingUp,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            subtitle: "Revenue/1000 views"
        },
        {
            label: "CPM",
            value: analytics.revenue.totals.cpm,
            formatted: formatCurrency(analytics.revenue.totals.cpm, analytics.revenue.currency),
            icon: BarChart3,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            subtitle: "Cost/1000 impressions"
        },
        {
            label: "Playback-Based CPM",
            value: analytics.revenue.totals.playbackBasedCpm,
            formatted: formatCurrency(analytics.revenue.totals.playbackBasedCpm, analytics.revenue.currency),
            icon: PlayCircle,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            subtitle: "CPM per playback"
        },
        {
            label: "Monetized Playbacks",
            value: analytics.revenue.totals.monetizedPlaybacks,
            formatted: formatNumber(analytics.revenue.totals.monetizedPlaybacks),
            icon: PlayCircle,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            subtitle: "Lượt xem có quảng cáo"
        },
        {
            label: "Ad Impressions",
            value: analytics.revenue.totals.adImpressions,
            formatted: formatNumber(analytics.revenue.totals.adImpressions),
            icon: Eye,
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            subtitle: "Lần hiển thị QC"
        },
        {
            label: "Gross Revenue",
            value: analytics.revenue.totals.grossRevenue,
            formatted: formatCurrency(analytics.revenue.totals.grossRevenue, analytics.revenue.currency),
            icon: DollarSign,
            iconBg: "bg-teal-100",
            iconColor: "text-teal-600",
            subtitle: "Before YouTube's cut"
        }
    ]

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {revenueCards.map((stat, index) => (
                    <Card
                        key={index}
                        className={`hover:shadow-lg transition-shadow ${stat.large ? 'md:col-span-2 lg:col-span-3 bg-linear-to-br from-green-500 to-green-600 text-white' : ''
                            }`}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className={`text-sm font-medium ${stat.large ? 'text-white' : 'text-gray-600'}`}>
                                    {stat.label}
                                </span>
                            </div>
                            <div className={`${stat.large ? 'text-4xl' : 'text-2xl'} font-bold ${stat.large ? 'text-white' : 'text-gray-900'} mb-2`}>
                                {stat.formatted}
                            </div>
                            {stat.subtitle && (
                                <div className={`text-xs ${stat.large ? 'text-white/80' : 'text-gray-500'} mt-2`}>
                                    {stat.subtitle}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Monetization Status</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {analytics.revenue.monetizationStatus === 'enabled' ? (
                                    <Badge className="bg-green-500">Enabled</Badge>
                                ) : (
                                    <Badge variant="destructive">Disabled</Badge>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Currency</p>
                            <Badge variant="secondary" className="mt-1 text-lg">
                                {analytics.revenue.currency}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
