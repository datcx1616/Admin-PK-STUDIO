// src/pages/team-analytics/components/TeamRevenueTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/pages/teams_chi_nhanh/components/MetricCard";
import { DollarSign, TrendingUp, Play, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatCurrency, formatNumber } from "../utils/formatters";

interface TeamRevenueTabProps {
    analytics: TeamAnalyticsData;
}

export function TeamRevenueTab({ analytics }: TeamRevenueTabProps) {
    const { revenue } = analytics.data;

    // Prepare chart data
    const chartData = revenue.dailyData.map(day => ({
        date: new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: day.estimatedRevenue,
        cpm: day.cpm,
        rpm: day.rpm
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={DollarSign}
                    title="Doanh Thu Ước Tính"
                    value={formatCurrency(revenue.totals.estimatedRevenue, revenue.currency)}
                    subtitle="Tất cả kênh"
                    gradient="from-green-500 to-emerald-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="CPM Trung Bình"
                    value={formatCurrency(revenue.totals.cpm, revenue.currency)}
                    subtitle="Cost per mille"
                    gradient="from-blue-500 to-indigo-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="RPM Trung Bình"
                    value={formatCurrency(revenue.totals.rpm, revenue.currency)}
                    subtitle="Revenue per mille"
                    gradient="from-purple-500 to-violet-600"
                />
                <MetricCard
                    icon={Play}
                    title="Lượt Phát Kiếm Tiền"
                    value={formatNumber(revenue.totals.monetizedPlaybacks)}
                    subtitle={`${formatNumber(revenue.totals.adImpressions)} ad impressions`}
                    gradient="from-amber-500 to-orange-600"
                />
            </div>

            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Biểu Đồ Doanh Thu Theo Ngày
                    </CardTitle>
                    <CardDescription>
                        Doanh thu ước tính hàng ngày ({revenue.currency})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.3}
                                strokeWidth={2}
                                name="Doanh thu"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* CPM/RPM Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Biểu Đồ CPM & RPM Theo Ngày
                    </CardTitle>
                    <CardDescription>
                        So sánh CPM và RPM hàng ngày
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="cpm"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="CPM"
                            />
                            <Line
                                type="monotone"
                                dataKey="rpm"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="RPM"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Revenue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <DollarSign className="h-5 w-5" />
                            Chi Tiết Doanh Thu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Doanh thu ước tính:</span>
                            <span className="font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(revenue.totals.estimatedRevenue, revenue.currency)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Doanh thu quảng cáo:</span>
                            <span className="font-bold">
                                {formatCurrency(revenue.totals.estimatedAdRevenue, revenue.currency)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Trạng thái kiếm tiền:</span>
                            <span className="font-bold text-green-600 capitalize">
                                {revenue.monetizationStatus}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Eye className="h-5 w-5" />
                            Thống Kê Quảng Cáo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Lượt phát kiếm tiền:</span>
                            <span className="font-bold text-blue-700 dark:text-blue-400">
                                {formatNumber(revenue.totals.monetizedPlaybacks)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Lượt hiển thị quảng cáo:</span>
                            <span className="font-bold">
                                {formatNumber(revenue.totals.adImpressions)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tỷ lệ:</span>
                            <span className="font-bold">
                                {revenue.totals.monetizedPlaybacks > 0
                                    ? (revenue.totals.adImpressions / revenue.totals.monetizedPlaybacks).toFixed(2)
                                    : '0'
                                } ads/playback
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}