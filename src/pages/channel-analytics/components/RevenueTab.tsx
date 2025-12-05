// src/pages/channel-analytics/components/RevenueTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { LineChart, Line, BarChart, Bar, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatCurrency, formatPercentage } from "../utils/formatters";
import { prepareTimeSeriesData, CHART_COLORS } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";
import { DollarSign, TrendingUp, Eye, BarChart3, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RevenueTabProps {
    analytics: ChannelAnalyticsData;
}

export function RevenueTab({ analytics }: RevenueTabProps) {
    // ✅ DEFENSIVE PROGRAMMING: Check if revenue data exists
    if (!analytics?.revenue?.totals || !analytics?.revenue?.dailyData) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu doanh thu không khả dụng. Kênh có thể chưa bật kiếm tiền hoặc chưa có đủ dữ liệu.
                </AlertDescription>
            </Alert>
        );
    }

    // ✅ Safe defaults for all values
    const totals = analytics.revenue.totals;
    const estimatedRevenue = totals.estimatedRevenue ?? 0;
    const estimatedAdRevenue = totals.estimatedAdRevenue ?? 0;
    const cpm = totals.cpm ?? 0;
    const rpm = totals.rpm ?? 0;
    const grossRevenue = totals.grossRevenue ?? 0;
    const monetizedPlaybacks = totals.monetizedPlaybacks ?? 0;
    const adImpressions = totals.adImpressions ?? 0;
    const monetizationStatus = analytics.revenue.monetizationStatus ?? 'disabled';
    const currency = analytics.revenue.currency ?? 'USD';

    // ✅ Filter out invalid daily data
    const validDailyData = analytics.revenue.dailyData.filter(day =>
        day && day.date && typeof day.estimatedRevenue === 'number'
    );

    if (validDailyData.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu doanh thu cho khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // ✅ Prepare chart data safely
    const revenueData = prepareTimeSeriesData(
        validDailyData,
        'date',
        ['estimatedRevenue', 'estimatedAdRevenue', 'cpm', 'rpm']
    );

    const monetizationData = prepareTimeSeriesData(
        validDailyData,
        'date',
        ['monetizedPlaybacks', 'adImpressions']
    );

    // ✅ Safe calculations
    const totalViews = analytics.basic?.totals?.totalViews ?? 1; // Avoid division by zero
    const totalWatchTimeHours = parseFloat(analytics.basic?.totals?.totalWatchTimeHours ?? '1'); // Avoid division by zero
    const avgRevenuePerDay = validDailyData.length > 0 ? estimatedRevenue / validDailyData.length : 0;

    return (
        <div className="space-y-6">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tổng Doanh Thu
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(estimatedRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ad: {formatCurrency(estimatedAdRevenue)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            CPM
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(cpm)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cost Per Mille
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            RPM
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(rpm)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Revenue Per Mille
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Trạng Thái
                        </CardTitle>
                        <Eye className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <Badge
                            variant={monetizationStatus === 'default' ? 'default' : 'secondary'}
                            className="text-sm"
                        >
                            {monetizationStatus === 'enabled' ? 'Đã bật kiếm tiền' : 'Chưa bật'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                            Currency: {currency}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Over Time Chart */}
            <ChartCard
                title="Doanh Thu Theo Thời Gian"
                description="Theo dõi doanh thu và doanh thu quảng cáo theo ngày"
            >
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            fontSize={12}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                            formatter={(value: any) => {
                                const numValue = Number(value);
                                return isNaN(numValue) ? '$0.00' : `$${numValue.toFixed(2)}`;
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="estimatedRevenue"
                            name="Doanh thu ước tính"
                            fill={CHART_COLORS.green}
                            fillOpacity={0.3}
                            stroke={CHART_COLORS.green}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="estimatedAdRevenue"
                            name="Doanh thu quảng cáo"
                            stroke={CHART_COLORS.blue}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* CPM & RPM Chart */}
            <ChartCard
                title="CPM & RPM Theo Thời Gian"
                description="Phân tích hiệu suất kiếm tiền"
            >
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={10}
                        />
                        <YAxis
                            fontSize={12}
                            tickFormatter={(value) => `$${value.toFixed(1)}`}
                        />
                        <Tooltip
                            formatter={(value: any) => {
                                const numValue = Number(value);
                                return isNaN(numValue) ? '$0.00' : `$${numValue.toFixed(2)}`;
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="cpm"
                            name="CPM"
                            stroke={CHART_COLORS.purple}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rpm"
                            name="RPM"
                            stroke={CHART_COLORS.orange}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Monetization Metrics */}
            <ChartCard
                title="Chỉ Số Kiếm Tiền"
                description="Lượt phát có kiếm tiền và hiển thị quảng cáo"
            >
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monetizationData}>
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
                        <Bar
                            dataKey="monetizedPlaybacks"
                            name="Lượt phát có kiếm tiền"
                            fill={CHART_COLORS.blue}
                        />
                        <Bar
                            dataKey="adImpressions"
                            name="Lượt hiển thị quảng cáo"
                            fill={CHART_COLORS.green}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Revenue Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Hiệu Suất Doanh Thu (7 ngày gần nhất)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Ngày</th>
                                    <th className="text-right py-3 px-4">Doanh Thu</th>
                                    <th className="text-right py-3 px-4">CPM</th>
                                    <th className="text-right py-3 px-4">RPM</th>
                                    <th className="text-right py-3 px-4">Monetized Playbacks</th>
                                    <th className="text-right py-3 px-4">Ad Impressions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validDailyData.slice(-7).reverse().map((day, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4">
                                            {new Date(day.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="text-right py-3 px-4 font-medium text-green-600">
                                            {formatCurrency(day.estimatedRevenue ?? 0)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatCurrency(day.cpm ?? 0)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatCurrency(day.rpm ?? 0)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(day.monetizedPlaybacks ?? 0)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(day.adImpressions ?? 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông Tin Chi Tiết</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Tổng doanh thu gộp</span>
                            <span className="font-medium">{formatCurrency(grossRevenue)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Tổng lượt phát có kiếm tiền</span>
                            <span className="font-medium">{formatNumber(monetizedPlaybacks)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Tổng hiển thị quảng cáo</span>
                            <span className="font-medium">{formatNumber(adImpressions)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Trung bình doanh thu/ngày</span>
                            <span className="font-medium text-green-600">
                                {formatCurrency(avgRevenuePerDay)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tỷ Lệ Kiếm Tiền</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Tỷ lệ lượt phát có kiếm tiền</span>
                            <span className="font-medium">
                                {totalViews > 0 ? formatPercentage((monetizedPlaybacks / totalViews) * 100) : '0.00%'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Quảng cáo / Lượt phát</span>
                            <span className="font-medium">
                                {monetizedPlaybacks > 0 ? (adImpressions / monetizedPlaybacks).toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm text-muted-foreground">Doanh thu / 1000 views</span>
                            <span className="font-medium">
                                {totalViews > 0 ? formatCurrency((estimatedRevenue / totalViews) * 1000) : '$0.00'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Doanh thu / giờ xem</span>
                            <span className="font-medium text-green-600">
                                {totalWatchTimeHours > 0 ? formatCurrency(estimatedRevenue / totalWatchTimeHours) : '$0.00'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}