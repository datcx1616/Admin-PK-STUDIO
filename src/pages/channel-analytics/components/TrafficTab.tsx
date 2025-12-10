// src/pages/channel-analytics/components/TrafficTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import { CHART_COLORS, getChartColor } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";
import { TrendingUp, ExternalLink, Search, Youtube, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrafficTabProps {
    analytics: ChannelAnalyticsData;
}

export function TrafficTab({ analytics }: TrafficTabProps) {
    const trafficSourcesData = analytics.traffic.sources.map(source => ({
        name: getTrafficSourceName(source.sourceType),
        value: source.views,
        percentage: source.percentage,
        watchTime: source.watchTimeMinutes
    }));

    const playbackLocationData = analytics.playbackLocation.locations.map(location => ({
        name: location.locationName,
        value: location.views,
        percentage: parseFloat(location.percentage),
        watchTime: location.watchTimeMinutes
    }));

    function getTrafficSourceName(sourceType: string): string {
        const names: { [key: string]: string } = {
            'SUBSCRIBER': 'Subscribers',
            'RELATED_VIDEO': 'Video đề xuất',
            'YT_SEARCH': 'Tìm kiếm YouTube',
            'YT_CHANNEL': 'Trang kênh',
            'YT_OTHER_PAGE': 'Trang khác',
            'EXT_URL': 'Nguồn ngoài',
            'END_SCREEN': 'End screen',
            'PLAYLIST': 'Playlist',
            'NOTIFICATION': 'Thông báo',
            'NO_LINK_OTHER': 'Khác'
        };
        return names[sourceType] || sourceType;
    }

    return (
        <div className="space-y-6">
            {/* Traffic Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Nguồn Chính
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-base font-semibold">
                                    {getTrafficSourceName(analytics.traffic.topSource)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatPercentage(analytics.traffic.sources[0]?.percentage)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Vị Trí Chính
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Tv className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-base font-semibold">
                                    {analytics.playbackLocation.topLocation}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {analytics.playbackLocation.locations[0]?.percentage}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Từ Subscribers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">
                            {formatNumber(analytics.traffic.sources.find(s => s.sourceType === 'SUBSCRIBER')?.views || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatPercentage(analytics.traffic.sources.find(s => s.sourceType === 'SUBSCRIBER')?.percentage || 0)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Từ Tìm Kiếm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-600">
                            {formatNumber(analytics.traffic.sources.find(s => s.sourceType === 'YT_SEARCH')?.views || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatPercentage(analytics.traffic.sources.find(s => s.sourceType === 'YT_SEARCH')?.percentage || 0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Traffic Sources Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Nguồn Lưu Lượng Truy Cập"
                    description="Phân bố lượt xem theo nguồn"
                >
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={trafficSourcesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {trafficSourcesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatNumber(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Vị Trí Phát"
                    description="Nơi người xem xem video"
                >
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={playbackLocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {playbackLocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatNumber(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Traffic Sources Bar Chart */}
            <ChartCard
                title="So Sánh Nguồn Truy Cập"
                description="Lượt xem và thời gian xem theo nguồn"
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={trafficSourcesData}
                        layout="vertical"
                        margin={{ left: 120 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            fontSize={12}
                            width={120}
                        />
                        <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Bar
                            dataKey="value"
                            name="Lượt xem"
                            fill={CHART_COLORS.blue}
                        >
                            {trafficSourcesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Traffic Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Nguồn Truy Cập</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Nguồn</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.traffic.sources.map((source, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">
                                            {getTrafficSourceName(source.sourceType)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(source.views)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant="outline">
                                                {source.percentage.toFixed(2)}%
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4 text-muted-foreground">
                                            {formatNumber(source.watchTimeMinutes)} phút
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Playback Location Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Vị Trí Phát</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Vị Trí</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.playbackLocation.locations.map((location, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">
                                            {location.locationName}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(location.views)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant="outline">
                                                {location.percentage}%
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4 text-muted-foreground">
                                            {formatNumber(location.watchTimeMinutes)} phút
                                        </td>
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