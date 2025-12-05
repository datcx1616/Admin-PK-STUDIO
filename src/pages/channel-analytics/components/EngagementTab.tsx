// src/pages/channel-analytics/components/EngagementTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import { prepareTimeSeriesData, CHART_COLORS, getChartColor } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";

interface EngagementTabProps {
    analytics: ChannelAnalyticsData;
}

export function EngagementTab({ analytics }: EngagementTabProps) {
    const engagementData = prepareTimeSeriesData(
        analytics.engagement.dailyData,
        'date',
        ['likes', 'comments', 'shares', 'engagementRate']
    );

    const engagementPieData = [
        { name: 'Likes', value: analytics.engagement.totals.totalLikes },
        { name: 'Comments', value: analytics.engagement.totals.totalComments },
        { name: 'Shares', value: analytics.engagement.totals.totalShares },
    ];

    return (
        <div className="space-y-6">
            {/* Engagement Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tổng Likes
                        </CardTitle>
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatNumber(analytics.engagement.totals.totalLikes)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ratio: {typeof analytics.engagement.totals.likeDislikeRatio === 'number' && analytics.engagement.totals.likeDislikeRatio !== null ? analytics.engagement.totals.likeDislikeRatio.toFixed(2) : '0.00'}:1
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tổng Dislikes
                        </CardTitle>
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatNumber(analytics.engagement.totals.totalDislikes)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatPercentage((analytics.engagement.totals.totalDislikes / (analytics.engagement.totals.totalLikes + analytics.engagement.totals.totalDislikes)) * 100)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tổng Comments
                        </CardTitle>
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(analytics.engagement.totals.totalComments)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tương tác người xem
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tổng Shares
                        </CardTitle>
                        <Share2 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {formatNumber(analytics.engagement.totals.totalShares)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Lan truyền nội dung
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Over Time Chart */}
            <ChartCard
                title="Tương Tác Theo Thời Gian"
                description="Theo dõi likes, comments, và shares theo ngày"
            >
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Bar dataKey="likes" name="Likes" fill={CHART_COLORS.green} />
                        <Bar dataKey="comments" name="Comments" fill={CHART_COLORS.blue} />
                        <Bar dataKey="shares" name="Shares" fill={CHART_COLORS.purple} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Engagement Rate Chart */}
            <ChartCard
                title="Tỷ Lệ Tương Tác Theo Ngày"
                description="Phần trăm người xem tương tác với nội dung"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            fontSize={12}
                            tickFormatter={(value) => `${value.toFixed(2)}%`}
                        />
                        <Tooltip
                            formatter={(value: any) => `${value.toFixed(2)}%`}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="engagementRate"
                            name="Engagement Rate"
                            stroke={CHART_COLORS.orange}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Engagement Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Phân Bố Tương Tác"
                    description="Tỷ lệ các loại tương tác"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={engagementPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {engagementPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatNumber(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Sharing Services */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Dịch Vụ Chia Sẻ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.sharingServices.services.slice(0, 5).map((service, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: getChartColor(index) }}
                                        />
                                        <span className="text-sm font-medium">{service.serviceName}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">
                                            {formatNumber(service.shares)}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {service.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}