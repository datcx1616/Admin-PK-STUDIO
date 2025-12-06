// src/pages/branch-analytics/components/OverviewTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatWatchTime, formatDate } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Eye, Clock, Users, TrendingUp, Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface OverviewTabProps {
    analytics: BranchAnalyticsData | null;
}

export function OverviewTab({ analytics }: OverviewTabProps) {
    if (!analytics?.data?.basic) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Không có dữ liệu</p>
                </CardContent>
            </Card>
        );
    }

    const { basic, engagement } = analytics.data;
    const totals = basic.totals;
    const dailyData = basic.dailyData || [];

    // Prepare chart data
    const chartData = dailyData.map(day => ({
        date: formatDate(day.date),
        views: day.views,
        subscribers: day.subscribersNet,
        watchTime: day.watchTimeMinutes,
        duration: day.averageViewDuration
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    icon={Eye}
                    title="Tổng Lượt Xem"
                    value={formatNumber(totals.totalViews)}
                    subtitle="Trong khoảng thời gian"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={Clock}
                    title="Thời Gian Xem"
                    value={totals.totalWatchTimeHours}
                    subtitle={formatWatchTime(totals.totalWatchTimeMinutes)}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Users}
                    title="Subscribers Mới"
                    value={`+${formatNumber(totals.totalSubscribersGained)}`}
                    subtitle={`Net: ${totals.totalSubscribersNet >= 0 ? '+' : ''}${formatNumber(totals.totalSubscribersNet)}`}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Thời Lượng TB"
                    value={`${totals.averageViewDuration.toFixed(0)}s`}
                    subtitle={`${(totals.averageViewDuration / 60).toFixed(1)} phút`}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <MetricCard
                    icon={Activity}
                    title="Engagement Rate"
                    value={`${engagement.totals.engagementRate.toFixed(2)}%`}
                    subtitle={`${formatNumber(engagement.totals.totalLikes)} likes`}
                    gradient="bg-gradient-to-br from-pink-500 to-pink-600"
                />
            </div>

            {/* Views & Subscribers Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Lượt Xem & Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis yAxisId="left" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="views"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Lượt xem"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="subscribers"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="Subscribers net"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Watch Time Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Thời Gian Xem</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="watchTime" fill="#10b981" name="Thời gian xem (phút)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Daily Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Hiệu Suất Hàng Ngày</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Ngày</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                    <th className="text-right py-3 px-4">Subs Gained</th>
                                    <th className="text-right py-3 px-4">Subs Lost</th>
                                    <th className="text-right py-3 px-4">Subs Net</th>
                                    <th className="text-right py-3 px-4">Thời Lượng TB</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.map((day, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">{formatDate(day.date)}</td>
                                        <td className="text-right py-3 px-4">{formatNumber(day.views)}</td>
                                        <td className="text-right py-3 px-4">{day.watchTimeHours}h</td>
                                        <td className="text-right py-3 px-4 text-green-600">
                                            +{formatNumber(day.subscribersGained)}
                                        </td>
                                        <td className="text-right py-3 px-4 text-red-600">
                                            -{formatNumber(day.subscribersLost)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant={day.subscribersNet >= 0 ? "default" : "destructive"}>
                                                {day.subscribersNet >= 0 ? '+' : ''}{formatNumber(day.subscribersNet)}
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4">{day.averageViewDuration}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}