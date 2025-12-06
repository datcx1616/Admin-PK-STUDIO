// src/pages/branch-analytics/components/EngagementTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { ThumbsUp, MessageSquare, Share2, Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface EngagementTabProps {
    analytics: BranchAnalyticsData | null;
}

export function EngagementTab({ analytics }: EngagementTabProps) {
    if (!analytics?.data?.engagement) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Không có dữ liệu</p>
                </CardContent>
            </Card>
        );
    }

    const { engagement } = analytics.data;
    const totals = engagement.totals;

    // Engagement distribution
    const engagementData = [
        { name: 'Likes', value: totals.totalLikes },
        { name: 'Comments', value: totals.totalComments },
        { name: 'Shares', value: totals.totalShares },
        { name: 'Dislikes', value: totals.totalDislikes },
    ];

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={ThumbsUp}
                    title="Tổng Likes"
                    value={formatNumber(totals.totalLikes)}
                    subtitle={`Ratio: ${totals.likeDislikeRatio.toFixed(1)}x`}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={MessageSquare}
                    title="Tổng Comments"
                    value={formatNumber(totals.totalComments)}
                    subtitle="Bình luận"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Share2}
                    title="Tổng Shares"
                    value={formatNumber(totals.totalShares)}
                    subtitle="Chia sẻ"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <MetricCard
                    icon={Activity}
                    title="Engagement Rate"
                    value={formatPercentage(totals.engagementRate)}
                    subtitle="Tỷ lệ tương tác"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Engagement Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Tương Tác</CardTitle>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Tương Tác</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b">
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">Likes</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                    {formatNumber(totals.totalLikes)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-green-500" />
                                    <span className="font-medium">Comments</span>
                                </div>
                                <span className="text-2xl font-bold text-green-600">
                                    {formatNumber(totals.totalComments)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b">
                                <div className="flex items-center gap-2">
                                    <Share2 className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">Shares</span>
                                </div>
                                <span className="text-2xl font-bold text-purple-600">
                                    {formatNumber(totals.totalShares)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">Engagement Rate</span>
                                </div>
                                <span className="text-2xl font-bold text-orange-600">
                                    {formatPercentage(totals.engagementRate)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Like/Dislike Ratio */}
            <Card>
                <CardHeader>
                    <CardTitle>Tỷ Lệ Likes/Dislikes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-950">
                            <p className="text-sm text-muted-foreground mb-2">Likes</p>
                            <p className="text-4xl font-bold text-green-600">
                                {formatNumber(totals.totalLikes)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {((totals.totalLikes / (totals.totalLikes + totals.totalDislikes)) * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-red-50 dark:bg-red-950">
                            <p className="text-sm text-muted-foreground mb-2">Dislikes</p>
                            <p className="text-4xl font-bold text-red-600">
                                {formatNumber(totals.totalDislikes)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {((totals.totalDislikes / (totals.totalLikes + totals.totalDislikes)) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">Like/Dislike Ratio</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {totals.likeDislikeRatio.toFixed(1)}:1
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}