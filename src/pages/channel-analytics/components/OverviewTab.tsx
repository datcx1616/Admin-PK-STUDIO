// src/pages/channel-analytics/components/OverviewTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatDate } from "../utils/formatters";
import { prepareTimeSeriesData, CHART_COLORS } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";

interface OverviewTabProps {
    analytics: ChannelAnalyticsData;
}

export function OverviewTab({ analytics }: OverviewTabProps) {
    const viewsData = prepareTimeSeriesData(
        analytics.basic.dailyData,
        'date',
        ['views', 'subscribersNet']
    );

    const watchTimeData = prepareTimeSeriesData(
        analytics.basic.dailyData,
        'date',
        ['watchTimeMinutes', 'averageViewDuration']
    );

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Trung Bình Lượt Xem / Ngày
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(
                                Math.round(analytics.basic.totals.totalViews / analytics.basic.dailyData.length)
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Thời Lượng Xem Trung Bình
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(analytics.basic.totals.averageViewDuration)}s
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tỷ Lệ Giữ Chân
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.retention.averageViewPercentage.toFixed(2)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Views & Subscribers Chart */}
            <ChartCard
                title="Lượt Xem & Subscribers Theo Ngày"
                description="Biểu đồ theo dõi lượt xem và subscribers mới mỗi ngày"
            >
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            yAxisId="left"
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="views"
                            name="Lượt xem"
                            stroke={CHART_COLORS.blue}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="subscribersNet"
                            name="Subscribers mới"
                            stroke={CHART_COLORS.green}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Watch Time Chart */}
            <ChartCard
                title="Thời Gian Xem Theo Ngày"
                description="Phân tích thời gian xem và thời lượng trung bình"
            >
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={watchTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            yAxisId="left"
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            fontSize={12}
                        />
                        <Tooltip
                            formatter={(value: any, name: string) => {
                                if (name === 'watchTimeMinutes') {
                                    return `${formatNumber(value)} phút`;
                                }
                                return `${value}s`;
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="watchTimeMinutes"
                            name="Thời gian xem (phút)"
                            fill={CHART_COLORS.purple}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="averageViewDuration"
                            name="Thời lượng TB (giây)"
                            fill={CHART_COLORS.teal}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Daily Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Hiệu Suất Theo Ngày (7 ngày gần nhất)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Ngày</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                    <th className="text-right py-3 px-4">Subscribers</th>
                                    <th className="text-right py-3 px-4">Doanh Thu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.basic.dailyData.slice(-7).reverse().map((day, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4">{formatDate(day.date)}</td>
                                        <td className="text-right py-3 px-4">{formatNumber(day.views)}</td>
                                        <td className="text-right py-3 px-4">{day.watchTimeHours}h</td>
                                        <td className="text-right py-3 px-4">
                                            <span className={day.subscribersNet >= 0 ? "text-green-600" : "text-red-600"}>
                                                {day.subscribersNet >= 0 ? '+' : ''}{formatNumber(day.subscribersNet)}
                                            </span>
                                        </td>
                                        <td className="text-right py-3 px-4">${day.estimatedRevenue.toFixed(2)}</td>
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