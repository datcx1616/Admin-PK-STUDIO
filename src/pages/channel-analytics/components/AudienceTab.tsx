// src/pages/channel-analytics/components/AudienceTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import { CHART_COLORS, getChartColor } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";
import { Users, Globe, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AudienceTabProps {
    analytics: ChannelAnalyticsData;
}

export function AudienceTab({ analytics }: AudienceTabProps) {
    const countriesData = analytics.demographics.topCountries.slice(0, 10);

    const subscriptionData = [
        {
            name: 'Đã đăng ký',
            value: parseFloat(analytics.subscriptionStatus.subscribedPercentage),
            count: analytics.subscriptionStatus.statuses.find(s => s.status === 'SUBSCRIBED')?.views || 0
        },
        {
            name: 'Chưa đăng ký',
            value: parseFloat(analytics.subscriptionStatus.unsubscribedPercentage),
            count: analytics.subscriptionStatus.statuses.find(s => s.status === 'UNSUBSCRIBED')?.views || 0
        }
    ];

    return (
        <div className="space-y-6">
            {/* Audience Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Subscribers Mới
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            +{formatNumber(analytics.basic.totals.totalSubscribersGained)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Gained trong kỳ
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Subscribers Mất
                        </CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            -{formatNumber(analytics.basic.totals.totalSubscribersLost)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Lost trong kỳ
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Subscribers Thuần
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {analytics.basic.totals.totalSubscribersNet >= 0 ? '+' : ''}
                            {formatNumber(analytics.basic.totals.totalSubscribersNet)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Net gain
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Quốc Gia
                        </CardTitle>
                        <Globe className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {analytics.demographics.topCountries.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Top: {analytics.demographics.topCountries[0]?.countryName}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Subscription Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Trạng Thái Đăng Ký"
                    description="Phân bố người xem theo trạng thái đăng ký"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={subscriptionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                <Cell fill={CHART_COLORS.green} />
                                <Cell fill={CHART_COLORS.red} />
                            </Pie>
                            <Tooltip
                                formatter={(value: any, name: string, props: any) => [
                                    `${formatNumber(props.payload.count)} lượt xem (${value.toFixed(2)}%)`,
                                    name
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Đăng Ký</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analytics.subscriptionStatus.statuses.map((status, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: index === 0 ? CHART_COLORS.red : CHART_COLORS.green }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{status.statusName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatNumber(status.views)} lượt xem
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline">
                                    {status.percentage}%
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Geographic Distribution */}
            <ChartCard
                title="Phân Bố Địa Lý (Top 10 Quốc Gia)"
                description="Lượt xem theo quốc gia"
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={countriesData}
                        layout="vertical"
                        margin={{ left: 100 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            fontSize={12}
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <YAxis
                            type="category"
                            dataKey="countryName"
                            fontSize={12}
                            width={100}
                        />
                        <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Bar
                            dataKey="views"
                            name="Lượt xem"
                            fill={CHART_COLORS.blue}
                        >
                            {countriesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Country Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Theo Quốc Gia</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Quốc Gia</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.demographics.topCountries.map((country, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">
                                            {country.countryName}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(country.views)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant="outline">
                                                {country.percentage.toFixed(2)}%
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4 text-muted-foreground">
                                            {formatNumber(country.watchTimeMinutes)} phút
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Audience Retention */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông Tin Giữ Chân Khán Giả</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">% Xem trung bình</span>
                                <span className="font-medium">{analytics.retention.averageViewPercentage.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Click-through Rate</span>
                                <span className="font-medium">{analytics.retention.ctr.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Impressions</span>
                                <span className="font-medium">{formatNumber(analytics.retention.impressions)}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Card Click Rate</span>
                                <span className="font-medium">{analytics.retention.cardClickRate.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Card Teaser Click</span>
                                <span className="font-medium">{analytics.retention.cardTeaserClickRate.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Impression CTR</span>
                                <span className="font-medium">{analytics.retention.impressionClickThroughRate.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}