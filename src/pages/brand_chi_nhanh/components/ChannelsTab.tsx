// src/pages/branch-analytics/components/ChannelsTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Youtube, Eye, Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface ChannelsTabProps {
    analytics: BranchAnalyticsData | null;
}

export function ChannelsTab({ analytics }: ChannelsTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.channelAnalytics) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu kênh không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const channelAnalytics = analytics.data.channelAnalytics || [];

    // ✅ Check minimum data
    if (channelAnalytics.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu kênh trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Calculate totals
    const totalViews = channelAnalytics.reduce((sum, c) => sum + (c.basic?.totals?.totalViews || 0), 0);
    const totalRevenue = channelAnalytics.reduce((sum, c) => sum + (c.revenue?.totals?.estimatedRevenue || 0), 0);
    const totalSubscribers = channelAnalytics.reduce((sum, c) => sum + (c.basic?.totals?.totalSubscribersNet || 0), 0);

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Youtube}
                    title="Tổng Kênh"
                    value={channelAnalytics.length.toString()}
                    subtitle="Kênh phân tích"
                    gradient="bg-gradient-to-br from-red-500 to-red-600"
                />
                <MetricCard
                    icon={Eye}
                    title="Tổng Lượt Xem"
                    value={formatNumber(totalViews)}
                    subtitle="Từ tất cả kênh"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={DollarSign}
                    title="Tổng Doanh Thu"
                    value={formatCurrency(totalRevenue)}
                    subtitle="Ước tính"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Subscribers Net"
                    value={`${totalSubscribers >= 0 ? '+' : ''}${formatNumber(totalSubscribers)}`}
                    subtitle="Tăng trưởng"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Channels Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle>So Sánh Hiệu Suất Kênh</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Kênh</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                    <th className="text-right py-3 px-4">Subs Net</th>
                                    <th className="text-right py-3 px-4">Doanh Thu</th>
                                    <th className="text-right py-3 px-4">Engagement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {channelAnalytics.map((channel, index) => {
                                    const views = channel.basic?.totals?.totalViews || 0;
                                    const watchTime = channel.basic?.totals?.totalWatchTimeHours || '0h';
                                    const subscribersNet = channel.basic?.totals?.totalSubscribersNet || 0;
                                    const revenue = channel.revenue?.totals?.estimatedRevenue || 0;
                                    const engagementRate = channel.engagement?.totals?.engagementRate || 0;

                                    return (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-medium">
                                                {channel.channelName}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(views)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {watchTime}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <Badge variant={subscribersNet >= 0 ? "default" : "destructive"}>
                                                    {subscribersNet >= 0 ? '+' : ''}{formatNumber(subscribersNet)}
                                                </Badge>
                                            </td>
                                            <td className="text-right py-3 px-4 text-green-600 font-semibold">
                                                {formatCurrency(revenue)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {engagementRate.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Individual Channel Details */}
            {channelAnalytics.map((channel, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Youtube className="h-5 w-5 text-red-500" />
                            {channel.channelName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <Eye className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                                <p className="text-sm text-muted-foreground mb-1">Lượt Xem</p>
                                <p className="text-xl font-bold text-blue-600">
                                    {formatNumber(channel.basic?.totals?.totalViews || 0)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                                <Clock className="h-5 w-5 mx-auto mb-2 text-green-600" />
                                <p className="text-sm text-muted-foreground mb-1">Watch Time</p>
                                <p className="text-xl font-bold text-green-600">
                                    {channel.basic?.totals?.totalWatchTimeHours || '0h'}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm text-muted-foreground mb-1">Subs Net</p>
                                <p className="text-xl font-bold text-purple-600">
                                    {(channel.basic?.totals?.totalSubscribersNet || 0) >= 0 ? '+' : ''}
                                    {formatNumber(channel.basic?.totals?.totalSubscribersNet || 0)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                                <DollarSign className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                                <p className="text-sm text-muted-foreground mb-1">Doanh Thu</p>
                                <p className="text-xl font-bold text-orange-600">
                                    {formatCurrency(channel.revenue?.totals?.estimatedRevenue || 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}