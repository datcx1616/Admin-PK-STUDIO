// src/pages/team-analytics/components/TeamRetentionTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Eye, MousePointer, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatNumber, formatPercentage } from "../utils/formatters";

interface TeamRetentionTabProps {
    analytics: TeamAnalyticsData;
}

export function TeamRetentionTab({ analytics }: TeamRetentionTabProps) {
    const { retention, playbackLocation, subscriptionStatus, sharingServices } = analytics.data;

    // Prepare playback location data
    const playbackData = playbackLocation.locations.map(loc => ({
        name: loc.locationName,
        views: loc.views,
        percentage: parseFloat(loc.percentage)
    }));

    // Prepare subscription status data
    const subscriptionData = subscriptionStatus.statuses.map(status => ({
        name: status.statusName,
        views: status.views,
        percentage: parseFloat(status.percentage)
    }));

    return (
        <div className="space-y-6">
            {/* Key Retention Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700 dark:text-green-400">
                            Tỷ Lệ Xem Trung Bình
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                            {formatPercentage(retention.averageViewPercentage)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Average view percentage
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700 dark:text-blue-400">
                            Card Click Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                            {formatPercentage(retention.cardClickRate)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tỷ lệ nhấp vào card
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-purple-700 dark:text-purple-400">
                            Impressions CTR
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                            {formatPercentage(retention.impressionClickThroughRate)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Click-through rate
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-amber-700 dark:text-amber-400">
                            Tổng Impressions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                            {formatNumber(retention.impressions)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Lượt hiển thị thumbnail
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Playback Location */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MousePointer className="h-5 w-5" />
                        Vị Trí Phát Video
                    </CardTitle>
                    <CardDescription>
                        Nơi người xem phát video - Top: {playbackLocation.topLocation}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={playbackData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Table */}
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-semibold">Vị trí</th>
                                        <th className="p-3 text-right font-semibold">Lượt xem</th>
                                        <th className="p-3 text-right font-semibold">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playbackLocation.locations.map((loc, index) => (
                                        <tr key={index} className="border-b hover:bg-muted/50">
                                            <td className="p-3 font-medium">{loc.locationName}</td>
                                            <td className="p-3 text-right">{formatNumber(loc.views)}</td>
                                            <td className="p-3 text-right text-primary font-semibold">
                                                {loc.percentage}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Trạng Thái Đăng Ký
                    </CardTitle>
                    <CardDescription>
                        Lượt xem từ subscribers vs non-subscribers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Summary Cards */}
                        <div className="space-y-3">
                            <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Từ Subscribers</p>
                                            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                                                {subscriptionStatus.subscribedPercentage}%
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-gray-200 bg-gray-50 dark:bg-gray-950">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Từ Non-Subscribers</p>
                                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                                {subscriptionStatus.unsubscribedPercentage}%
                                            </p>
                                        </div>
                                        <Eye className="h-8 w-8 text-gray-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart */}
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={subscriptionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#10b981" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Sharing Services */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Dịch Vụ Chia Sẻ
                    </CardTitle>
                    <CardDescription>
                        Top dịch vụ: {sharingServices.topService} - Tổng: {formatNumber(sharingServices.totalShares)} lượt chia sẻ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-semibold">Dịch vụ</th>
                                    <th className="p-3 text-right font-semibold">Lượt chia sẻ</th>
                                    <th className="p-3 text-right font-semibold">Tỷ lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sharingServices.services.map((service, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-medium">{service.serviceName}</td>
                                        <td className="p-3 text-right">{formatNumber(service.shares)}</td>
                                        <td className="p-3 text-right">
                                            <span className="font-semibold text-primary">
                                                {service.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Retention Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Chi Tiết Retention Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Average View %</p>
                            <p className="text-2xl font-bold">
                                {formatPercentage(retention.averageViewPercentage)}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Card Click Rate</p>
                            <p className="text-2xl font-bold">
                                {formatPercentage(retention.cardClickRate)}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Impressions</p>
                            <p className="text-2xl font-bold">
                                {formatNumber(retention.impressions)}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">Impression CTR</p>
                            <p className="text-2xl font-bold">
                                {formatPercentage(retention.impressionClickThroughRate)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}