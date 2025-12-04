import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MessageSquare, Share2 } from "lucide-react"
import { formatNumber } from "../utils/formatters"
import { MetricCard } from "./MetricCard"
import { type BranchAnalytics } from "../types"

interface EngagementTabProps {
    analytics: BranchAnalytics | null
}

export function EngagementTab({ analytics }: EngagementTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Activity}
                    title="Thích"
                    value={formatNumber(analytics?.analytics?.likes || 0)}
                    subtitle={`${((analytics?.analytics?.likes || 0) / Math.max(analytics?.analytics?.views || 1, 1) * 100).toFixed(1)}% tương tác`}
                    gradient="bg-linear-to-br from-green-500 to-emerald-600"
                />
                <MetricCard
                    icon={MessageSquare}
                    title="Bình luận"
                    value={formatNumber(analytics?.analytics?.comments || 0)}
                    subtitle={`${((analytics?.analytics?.comments || 0) / Math.max(analytics?.analytics?.views || 1, 1) * 100).toFixed(1)}% tương tác`}
                    gradient="bg-linear-to-br from-teal-500 to-cyan-600"
                />
                <MetricCard
                    icon={Share2}
                    title="Chia sẻ"
                    value={formatNumber(analytics?.analytics?.shares || 0)}
                    subtitle={`${((analytics?.analytics?.shares || 0) / Math.max(analytics?.analytics?.views || 1, 1) * 100).toFixed(1)}% tương tác`}
                    gradient="bg-linear-to-br from-pink-500 to-rose-600"
                />
                <MetricCard
                    icon={Activity}
                    title="Tỷ Lệ Tương Tác"
                    value={`${(analytics?.analytics?.engagementRate || 0).toFixed(2)}%`}
                    subtitle="(Likes + Comments + Shares) / Views"
                    gradient="bg-linear-to-br from-blue-500 to-indigo-600"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Tỷ lệ Thích/Không thích
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    Lượt thích
                                </span>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatNumber(analytics?.analytics?.likes || 0)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '97.8%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">97.8% tương tác</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-red-600" />
                                    Không thích
                                </span>
                                <span className="text-2xl font-bold text-red-600">0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '1.1%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">1.1% không thích</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
