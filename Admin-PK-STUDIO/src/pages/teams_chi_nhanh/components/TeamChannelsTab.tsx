// src/pages/team-analytics/components/TeamChannelsTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Eye, Clock, ThumbsUp, MessageSquare, Share2, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TeamAnalyticsData, ChannelAnalyticsItem } from "../types/team-analytics.types";
import { formatNumber } from "../utils/formatters";

interface TeamChannelsTabProps {
    analytics: TeamAnalyticsData;
}

export function TeamChannelsTab({ analytics }: TeamChannelsTabProps) {
    const { channelAnalytics, totalChannels } = analytics.data;

    if (!channelAnalytics || channelAnalytics.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <Youtube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Không có dữ liệu phân tích kênh</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Prepare comparison chart data
    const comparisonData = channelAnalytics.map(channel => ({
        name: channel.channelName.length > 15 ? channel.channelName.substring(0, 15) + '...' : channel.channelName,
        views: channel.basic?.totals?.totalViews || 0,
        watchTime: channel.basic?.totals?.totalWatchTimeHours || 0,
        subscribersNet: channel.basic?.totals?.totalSubscribersNet || 0
    }));

    return (
        <div className="space-y-6">
            {/* Summary */}
            <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-primary" />
                        Tổng Quan Kênh
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tổng kênh</p>
                            <p className="text-2xl font-bold text-primary">{totalChannels}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Có dữ liệu</p>
                            <p className="text-2xl font-bold text-green-600">{channelAnalytics.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tổng lượt xem</p>
                            <p className="text-2xl font-bold">
                                {formatNumber(channelAnalytics.reduce((sum, ch) => sum + (ch.basic?.totals?.totalViews || 0), 0))}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tổng subscribers</p>
                            <p className="text-2xl font-bold">
                                {formatNumber(channelAnalytics.reduce((sum, ch) => sum + (ch.basic?.totals?.totalSubscribersNet || 0), 0))}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Comparison Charts */}
            <div className="grid grid-cols-1 gap-6">
                {/* Views Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            So Sánh Lượt Xem Theo Kênh
                        </CardTitle>
                        <CardDescription>
                            Lượt xem của từng kênh trong team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#10b981" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Watch Time Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            So Sánh Thời Gian Xem Theo Kênh
                        </CardTitle>
                        <CardDescription>
                            Thời gian xem (giờ) của từng kênh
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="watchTime" fill="#f59e0b" name="Thời gian xem (giờ)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Subscribers Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            So Sánh Subscribers Thuần Theo Kênh
                        </CardTitle>
                        <CardDescription>
                            Subscribers gained - lost của từng kênh
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="subscribersNet" fill="#ec4899" name="Subscribers thuần" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Channel Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5" />
                        Chi Tiết Từng Kênh
                    </CardTitle>
                    <CardDescription>
                        Thống kê chi tiết của tất cả kênh trong team
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {channelAnalytics.map((channel: ChannelAnalyticsItem, index: number) => (
                            <Card key={channel.channelId} className="border-2">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 shrink-0">
                                            <Youtube className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg">{channel.channelName}</CardTitle>
                                            <CardDescription className="text-xs">
                                                Kênh #{index + 1}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Eye className="h-4 w-4" />
                                                Lượt xem
                                            </div>
                                            <p className="text-xl font-bold">
                                                {formatNumber(channel.basic?.totals?.totalViews || 0)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                Thời gian xem
                                            </div>
                                            <p className="text-xl font-bold">
                                                {Math.round(channel.basic?.totals?.totalWatchTimeHours || 0)}h
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <ThumbsUp className="h-4 w-4" />
                                                Lượt thích
                                            </div>
                                            <p className="text-xl font-bold text-green-600">
                                                {formatNumber(channel.engagement?.totals?.totalLikes || 0)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MessageSquare className="h-4 w-4" />
                                                Bình luận
                                            </div>
                                            <p className="text-xl font-bold text-blue-600">
                                                {formatNumber(channel.engagement?.totals?.totalComments || 0)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Share2 className="h-4 w-4" />
                                                Chia sẻ
                                            </div>
                                            <p className="text-xl font-bold text-amber-600">
                                                {formatNumber(channel.engagement?.totals?.totalShares || 0)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <TrendingUp className="h-4 w-4" />
                                                Subs thuần
                                            </div>
                                            <p className={`text-xl font-bold ${(channel.basic?.totals?.totalSubscribersNet || 0) >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {(channel.basic?.totals?.totalSubscribersNet || 0) >= 0 ? '+' : ''}
                                                {formatNumber(channel.basic?.totals?.totalSubscribersNet || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}