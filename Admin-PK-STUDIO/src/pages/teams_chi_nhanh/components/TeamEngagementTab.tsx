// src/pages/team-analytics/components/TeamEngagementTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/pages/teams_chi_nhanh/components/MetricCard";
import { ThumbsUp, MessageSquare, Share2, Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatNumber, formatPercentage } from "../utils/formatters";

interface TeamEngagementTabProps {
    analytics: TeamAnalyticsData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];

export function TeamEngagementTab({ analytics }: TeamEngagementTabProps) {
    const { engagement } = analytics.data;

    // Engagement breakdown data
    const engagementData = [
        { name: 'Likes', value: engagement.totals.totalLikes, color: '#10b981' },
        { name: 'Comments', value: engagement.totals.totalComments, color: '#3b82f6' },
        { name: 'Shares', value: engagement.totals.totalShares, color: '#f59e0b' },
    ];

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={ThumbsUp}
                    title="Tổng Lượt Thích"
                    value={formatNumber(engagement.totals.totalLikes)}
                    subtitle="Tất cả kênh"
                    gradient="from-green-500 to-emerald-600"
                />
                <MetricCard
                    icon={MessageSquare}
                    title="Tổng Bình Luận"
                    value={formatNumber(engagement.totals.totalComments)}
                    subtitle="Tất cả kênh"
                    gradient="from-blue-500 to-indigo-600"
                />
                <MetricCard
                    icon={Share2}
                    title="Tổng Chia Sẻ"
                    value={formatNumber(engagement.totals.totalShares)}
                    subtitle="Tất cả kênh"
                    gradient="from-amber-500 to-orange-600"
                />
                <MetricCard
                    icon={Activity}
                    title="Tỷ Lệ Tương Tác"
                    value={formatPercentage(engagement.totals.engagementRate)}
                    subtitle="Engagement rate"
                    gradient="from-pink-500 to-rose-600"
                />
            </div>

            {/* Engagement Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Phân Bố Tương Tác
                        </CardTitle>
                        <CardDescription>
                            Tỷ lệ các loại tương tác
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={engagementData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            So Sánh Tương Tác
                        </CardTitle>
                        <CardDescription>
                            Số lượng từng loại tương tác
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#3b82f6" name="Số lượng" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <ThumbsUp className="h-5 w-5" />
                            Chi Tiết Lượt Thích
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tổng likes:</span>
                            <span className="font-bold text-green-700 dark:text-green-400">
                                {formatNumber(engagement.totals.totalLikes)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Dislikes:</span>
                            <span className="font-bold text-red-600">
                                {formatNumber(engagement.totals.totalDislikes)}
                            </span>
                        </div>
                        {engagement.totals.likeDislikeRatio !== null && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tỷ lệ Like/Dislike:</span>
                                <span className="font-bold">
                                    {engagement.totals.likeDislikeRatio.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Activity className="h-5 w-5" />
                            Tỷ Lệ Tương Tác
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Engagement Rate:</span>
                            <span className="font-bold text-blue-700 dark:text-blue-400">
                                {formatPercentage(engagement.totals.engagementRate)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Tỷ lệ tương tác = (Likes + Comments + Shares) / Views × 100
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}