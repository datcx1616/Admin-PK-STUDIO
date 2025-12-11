import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "./MetricCard"
import { Eye, Clock, TrendingUp, ThumbsUp, MessageSquare, Share2, Users, Youtube, Video, Activity } from "lucide-react"

export type TeamStats = {
    totalViews: number
    totalWatchTimeHours: number
    totalWatchTimeMinutes: number
    averageViewDuration: number
    totalLikes: number
    totalComments: number
    totalShares: number
    engagementRate: number
    totalMembers: number
    totalChannels: number
    totalVideos: number
    totalSubscribers: number
    subscribersGained: number
    subscribersLost: number
    subscribersNet: number
}

interface OverviewSummaryProps {
    stats: TeamStats
}

export function OverviewSummary({ stats }: OverviewSummaryProps) {
    const trend: 'up' | 'down' | undefined = typeof stats.subscribersNet === 'number'
        ? (stats.subscribersNet >= 0 ? 'up' : 'down')
        : undefined

    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                        <TabsTrigger value="engagement">Tương Tác</TabsTrigger>
                        <TabsTrigger value="performance">Hiệu Suất</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Eye}
                                title="Tổng Lượt Xem"
                                value={stats.totalViews.toLocaleString()}
                                gradient="from-emerald-500 to-teal-600"
                            />
                            <MetricCard
                                icon={Clock}
                                title="Thời Gian Xem"
                                value={`${Math.round(stats.totalWatchTimeHours).toLocaleString()}h`}
                                subtitle={`${Math.round(stats.totalWatchTimeMinutes).toLocaleString()} phút`}
                                gradient="from-amber-500 to-orange-600"
                            />
                            <MetricCard
                                icon={TrendingUp}
                                title="Subscribers Thuần"
                                value={(stats.subscribersNet > 0 ? "+" : "") + stats.subscribersNet.toLocaleString()}
                                gradient="from-pink-500 to-rose-600"
                                trend={trend}
                            />
                            <MetricCard
                                icon={Activity}
                                title="Thời Lượng TB"
                                value={`${Math.round(stats.averageViewDuration)}s`}
                                subtitle={`${Math.round((stats.averageViewDuration / 60) * 10) / 10} phút`}
                                gradient="from-sky-500 to-cyan-600"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="engagement" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={ThumbsUp}
                                title="Tổng Likes"
                                value={stats.totalLikes.toLocaleString()}
                                subtitle={stats.totalChannels ? `~${Math.round(stats.totalLikes / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                gradient="from-green-500 to-emerald-600"
                            />
                            <MetricCard
                                icon={MessageSquare}
                                title="Tổng Comments"
                                value={stats.totalComments.toLocaleString()}
                                subtitle={stats.totalChannels ? `~${Math.round(stats.totalComments / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                gradient="from-amber-500 to-orange-600"
                            />
                            <MetricCard
                                icon={Share2}
                                title="Tổng Shares"
                                value={stats.totalShares.toLocaleString()}
                                subtitle={stats.totalChannels ? `~${Math.round(stats.totalShares / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                gradient="from-pink-500 to-rose-600"
                            />
                            <MetricCard
                                icon={Activity}
                                title="Tỷ lệ tương tác"
                                value={`${stats.engagementRate.toFixed(2)}%`}
                                subtitle="Tỷ lệ tương tác"
                                gradient="from-blue-500 to-indigo-600"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Users}
                                title="Thành Viên"
                                value={stats.totalMembers.toLocaleString()}
                                subtitle="Thành viên đội"
                                gradient="from-blue-500 to-indigo-600"
                            />
                            <MetricCard
                                icon={Youtube}
                                title="Kênh YouTube"
                                value={stats.totalChannels.toLocaleString()}
                                subtitle="Kênh đang hoạt động"
                                gradient="from-red-500 to-pink-600"
                            />
                            <MetricCard
                                icon={Video}
                                title="Tổng Videos"
                                value={stats.totalVideos.toLocaleString()}
                                subtitle={stats.totalChannels ? `~${Math.round(stats.totalVideos / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                gradient="from-purple-500 to-violet-600"
                            />
                            <MetricCard
                                icon={Users}
                                title="Tổng người đăng ký"
                                value={stats.totalSubscribers.toLocaleString()}
                                subtitle={stats.totalChannels ? `~${Math.round(stats.totalSubscribers / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                gradient="from-emerald-500 to-teal-600"
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
