// src/pages/branch-analytics/components/RevenueTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatCurrency, formatDate } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { DollarSign, TrendingUp, BarChart3, Activity, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface RevenueTabProps {
    analytics: BranchAnalyticsData | null;
}

export function RevenueTab({ analytics }: RevenueTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.revenue?.totals || !analytics?.data?.revenue?.dailyData) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu doanh thu không khả dụng. Vui lòng thử lại sau.
                </AlertDescription>
            </Alert>
        );
    }

    const { revenue } = analytics.data;
    const totals = revenue.totals;
    const dailyData = revenue.dailyData || [];

    // ✅ Safe defaults
    const estimatedRevenue = totals.estimatedRevenue ?? 0;
    const estimatedAdRevenue = totals.estimatedAdRevenue ?? 0;
    const cpm = totals.cpm ?? 0;
    const rpm = totals.rpm ?? 0;
    const monetizedPlaybacks = totals.monetizedPlaybacks ?? 0;
    const adImpressions = totals.adImpressions ?? 0;

    // ✅ Filter valid data
    const validDailyData = dailyData.filter(day =>
        day && day.date && typeof day.estimatedRevenue === 'number'
    );

    // ✅ Check minimum data
    if (validDailyData.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu doanh thu trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Prepare chart data
    const chartData = validDailyData.map(day => ({
        date: formatDate(day.date),
        revenue: day.estimatedRevenue ?? 0,
        adRevenue: day.estimatedAdRevenue ?? 0,
        cpm: day.cpm ?? 0,
        rpm: day.rpm ?? 0,
        playbacks: day.monetizedPlaybacks ?? 0
    }));

    return (
        <div className="space-y-6">
            {/* Monetization Status Banner */}
            <Alert className={revenue.monetizationStatus === 'enabled' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Trạng thái kiếm tiền:</strong> {revenue.monetizationStatus === 'enabled' ? '✅ Đã bật' : '❌ Chưa bật'} |
                    <strong> Tiền tệ:</strong> {revenue.currency}
                </AlertDescription>
            </Alert>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={DollarSign}
                    title="Doanh Thu Ước Tính"
                    value={formatCurrency(estimatedRevenue, revenue.currency)}
                    subtitle={`≈ ${formatCurrency(estimatedRevenue * 23000, 'VND')}`}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={DollarSign}
                    title="Doanh Thu Quảng Cáo"
                    value={formatCurrency(estimatedAdRevenue, revenue.currency)}
                    subtitle={`${((estimatedAdRevenue / estimatedRevenue) * 100).toFixed(1)}% tổng`}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={BarChart3}
                    title="RPM"
                    value={formatCurrency(rpm, revenue.currency)}
                    subtitle="Revenue per 1000 views"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="CPM"
                    value={formatCurrency(cpm, revenue.currency)}
                    subtitle="Cost per 1000 impressions"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh Thu Theo Thời Gian</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis yAxisId="left" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" fontSize={12} />
                            <Tooltip
                                formatter={(value: any) => {
                                    const numValue = Number(value);
                                    return isNaN(numValue) ? '$0.00' : `$${numValue.toFixed(2)}`;
                                }}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="revenue"
                                fill="#10b981"
                                name="Doanh thu"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="cpm"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                name="CPM"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Ad Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Hiệu Suất Quảng Cáo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-950">
                            <p className="text-sm text-muted-foreground mb-2">Lượt Phát Kiếm Tiền</p>
                            <p className="text-4xl font-bold text-blue-600">
                                {formatNumber(monetizedPlaybacks)}
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-950">
                            <p className="text-sm text-muted-foreground mb-2">Lượt Hiển Thị Quảng Cáo</p>
                            <p className="text-4xl font-bold text-purple-600">
                                {formatNumber(adImpressions)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Revenue Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Doanh Thu Hàng Ngày</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Ngày</th>
                                    <th className="text-right py-3 px-4">Doanh Thu</th>
                                    <th className="text-right py-3 px-4">Doanh Thu QC</th>
                                    <th className="text-right py-3 px-4">CPM</th>
                                    <th className="text-right py-3 px-4">RPM</th>
                                    <th className="text-right py-3 px-4">Playbacks</th>
                                    <th className="text-right py-3 px-4">Impressions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validDailyData.map((day, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">{formatDate(day.date)}</td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant="default">
                                                {formatCurrency(day.estimatedRevenue ?? 0, revenue.currency)}
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatCurrency(day.estimatedAdRevenue ?? 0, revenue.currency)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatCurrency(day.cpm ?? 0, revenue.currency)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatCurrency(day.rpm ?? 0, revenue.currency)}
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
        </div>
    );
}