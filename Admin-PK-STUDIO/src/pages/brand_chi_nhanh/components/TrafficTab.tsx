// src/pages/branch-analytics/components/TrafficTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from "../utils/formatters";
import { getSourceName } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Radio, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

interface TrafficTabProps {
    analytics: BranchAnalyticsData | null;
}

export function TrafficTab({ analytics }: TrafficTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.traffic?.sources) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu nguồn traffic không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const { traffic } = analytics.data;
    const sources = traffic.sources || [];

    // ✅ Check minimum data
    if (sources.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu nguồn traffic trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Calculate totals
    const totalViews = sources.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalWatchTime = sources.reduce((sum, s) => sum + (s.watchTimeMinutes || 0), 0);

    // Top source
    const topSource = sources[0];

    // Prepare chart data
    const chartData = sources.map(source => ({
        name: getSourceName(source.sourceType),
        views: source.views,
        watchTime: source.watchTimeMinutes,
        percentage: source.percentage
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    icon={Radio}
                    title="Tổng Nguồn"
                    value={sources.length.toString()}
                    subtitle="Nguồn traffic"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Nguồn Hàng Đầu"
                    value={getSourceName(topSource.sourceType)}
                    subtitle={`${topSource.percentage.toFixed(1)}% traffic`}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Lượt Xem"
                    value={formatNumber(totalViews)}
                    subtitle="Tổng lượt xem"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Traffic Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Nguồn Traffic</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="percentage"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lượt Xem Theo Nguồn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={100} />
                                <YAxis fontSize={12} />
                                <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Traffic Sources Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Nguồn Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Nguồn</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                    <th className="text-right py-3 px-4">Avg Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sources.map((source, index) => {
                                    const avgDuration = source.views > 0
                                        ? (source.watchTimeMinutes * 60) / source.views
                                        : 0;
                                    return (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-medium">
                                                {getSourceName(source.sourceType)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(source.views)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {(source.watchTimeMinutes / 60).toFixed(1)}h
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span className={`font-semibold ${source.percentage > 20 ? 'text-green-600' :
                                                    source.percentage > 10 ? 'text-blue-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                    {source.percentage.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {avgDuration.toFixed(0)}s
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}