// src/pages/team-analytics/components/TeamOverviewTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/pages/teams_chi_nhanh/components/MetricCard";
import { Eye, Clock, Users, TrendingUp, Activity, ThumbsUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatNumber, formatPercentage } from "../utils/formatters";

interface TeamOverviewTabProps {
    analytics: TeamAnalyticsData;
}

export function TeamOverviewTab({ analytics }: TeamOverviewTabProps) {
    const { basic, engagement } = analytics.data;

    // Prepare chart data
    const chartData = basic.dailyData.map(day => ({
        date: new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        views: day.views,
        watchTimeHours: parseFloat(day.watchTimeHours),
        subscribersNet: day.subscribersNet
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Eye}
                    title="Tổng Lượt Xem"
                    value={formatNumber(basic.totals.totalViews)}
                    subtitle="Tất cả kênh"
                    gradient="from-emerald-500 to-teal-600"
                />
                <MetricCard
                    icon={Clock}
                    title="Thời Gian Xem"
                    value={`${Math.round(basic.totals.totalWatchTimeHours)}h`}
                    subtitle={`${formatNumber(basic.totals.totalWatchTimeMinutes)} phút`}
                    gradient="from-amber-500 to-orange-600"
                />
                <MetricCard
                    icon={Users}
                    title="Subscribers Thuần"
                    value={
                        basic.totals.totalSubscribersNet >= 0
                            ? `+${formatNumber(basic.totals.totalSubscribersNet)}`
                            : formatNumber(basic.totals.totalSubscribersNet)
                    }
                    subtitle={`+${formatNumber(basic.totals.totalSubscribersGained)} / -${formatNumber(basic.totals.totalSubscribersLost)}`}
                    gradient="from-pink-500 to-rose-600"
                    trend={basic.totals.totalSubscribersNet >= 0 ? 'up' : 'down'}
                />
                <MetricCard
                    icon={Activity}
                    title="Tỷ Lệ Tương Tác"
                    value={formatPercentage(engagement.totals.engagementRate)}
                    subtitle={`${formatNumber(engagement.totals.totalLikes)} likes`}
                    gradient="from-sky-500 to-blue-600"
                />
            </div>

            {/* Views Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Biểu Đồ Lượt Xem Theo Ngày
                    </CardTitle>
                    <CardDescription>
                        Theo dõi lượt xem hàng ngày của tất cả kênh
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Lượt xem"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Watch Time Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Biểu Đồ Thời Gian Xem Theo Ngày
                    </CardTitle>
                    <CardDescription>
                        Thời gian xem (giờ) hàng ngày
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="watchTimeHours"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                name="Thời gian xem (giờ)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Subscribers Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Biểu Đồ Subscribers Theo Ngày
                    </CardTitle>
                    <CardDescription>
                        Subscribers thuần (gained - lost) hàng ngày
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="subscribersNet"
                                stroke="#ec4899"
                                strokeWidth={2}
                                name="Subscribers thuần"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Thời Lượng Xem TB</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {Math.round(basic.totals.averageViewDuration)}s
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            ≈ {Math.round(basic.totals.averageViewDuration / 60)} phút
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tổng Lượt Thích</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {formatNumber(engagement.totals.totalLikes)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tất cả kênh
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tổng Bình Luận</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">
                            {formatNumber(engagement.totals.totalComments)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tất cả kênh
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}