import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Activity, Clock, Users, Eye } from "lucide-react"
import { formatNumber, formatDuration } from "../utils/formatters"
import { MetricCard } from "./MetricCard"
import { type BranchAnalytics } from "../types"

interface OverviewTabProps {
    analytics: BranchAnalytics | null
}

export function OverviewTab({ analytics }: OverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Eye}
                    title="Lượt Xem"
                    value={formatNumber(analytics?.analytics?.views || 0)}
                    subtitle="Tổng lượt xem"
                    gradient="bg-linear-to-br from-emerald-500 to-teal-600"
                />
                <MetricCard
                    icon={Clock}
                    title="Thời Gian Xem"
                    value={formatDuration(analytics?.analytics?.watchTime || 0)}
                    subtitle={`${Math.round((analytics?.analytics?.watchTime || 0) / 60)} phút`}
                    gradient="bg-linear-to-br from-teal-500 to-cyan-600"
                />
                <MetricCard
                    icon={Users}
                    title="Người Đăng Ký"
                    value={
                        analytics?.analytics?.subscribersNet !== undefined
                            ? (analytics.analytics.subscribersNet >= 0 ? '+' : '') + formatNumber(analytics.analytics.subscribersNet)
                            : '+0'
                    }
                    subtitle={`+${formatNumber(analytics?.analytics?.subscribersGained || 0)} / -${formatNumber(analytics?.analytics?.subscribersLost || 0)}`}
                    gradient="bg-linear-to-br from-pink-500 to-rose-600"
                />
                <MetricCard
                    icon={Activity}
                    title="Thời Lượng TB"
                    value={formatDuration(analytics?.analytics?.averageViewDuration || 0)}
                    subtitle={`${Math.round((analytics?.analytics?.averageViewDuration || 0) / 60 * 10) / 10} phút`}
                    gradient="bg-linear-to-br from-sky-500 to-blue-600"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Chi Tiết Tăng Trưởng Người Đăng Ký
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                            <p className="text-sm text-muted-foreground mb-2">Người đăng ký mới</p>
                            <p className="text-3xl font-bold text-green-600">
                                +{formatNumber(analytics?.analytics?.subscribersGained || 0)}
                            </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950">
                            <p className="text-sm text-muted-foreground mb-2">Người hủy đăng ký</p>
                            <p className="text-3xl font-bold text-red-600">
                                -{formatNumber(analytics?.analytics?.subscribersLost || 0)}
                            </p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                            <p className="text-sm text-muted-foreground mb-2">Thay đổi ròng</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {analytics?.analytics?.subscribersNet !== undefined
                                    ? (analytics.analytics.subscribersNet >= 0 ? '+' : '') + formatNumber(analytics.analytics.subscribersNet)
                                    : '0'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
