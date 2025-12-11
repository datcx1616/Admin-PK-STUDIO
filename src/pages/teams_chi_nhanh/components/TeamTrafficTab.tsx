// src/pages/team-analytics/components/TeamTrafficTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatNumber, formatPercentage, TRAFFIC_SOURCE_NAMES } from "../utils/formatters";

interface TeamTrafficTabProps {
    analytics: TeamAnalyticsData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export function TeamTrafficTab({ analytics }: TeamTrafficTabProps) {
    const { traffic } = analytics.data;

    // Prepare chart data
    const chartData = traffic.sources.map(source => ({
        name: TRAFFIC_SOURCE_NAMES[source.sourceType] || source.sourceType,
        views: source.views,
        watchTime: source.watchTimeMinutes,
        percentage: source.percentage
    }));

    return (
        <div className="space-y-6">
            {/* Top Source */}
            <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Radio className="h-5 w-5 text-primary" />
                        Nguồn Traffic Hàng Đầu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-primary">
                        {TRAFFIC_SOURCE_NAMES[traffic.topSource] || traffic.topSource}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Nguồn đóng góp nhiều lượt xem nhất
                    </p>
                </CardContent>
            </Card>

            {/* Traffic Sources Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Radio className="h-5 w-5" />
                            Phân Bố Nguồn Traffic
                        </CardTitle>
                        <CardDescription>
                            Tỷ lệ % từng nguồn traffic
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="views"
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

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Lượt Xem Theo Nguồn
                        </CardTitle>
                        <CardDescription>
                            Số lượt xem từ mỗi nguồn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
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
                    <CardDescription>
                        Thống kê chi tiết từng nguồn traffic
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-semibold">Nguồn</th>
                                    <th className="p-3 text-right font-semibold">Lượt Xem</th>
                                    <th className="p-3 text-right font-semibold">Thời Gian Xem</th>
                                    <th className="p-3 text-right font-semibold">Tỷ Lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {traffic.sources.map((source, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="font-medium">
                                                    {TRAFFIC_SOURCE_NAMES[source.sourceType] || source.sourceType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            {formatNumber(source.views)}
                                        </td>
                                        <td className="p-3 text-right text-muted-foreground">
                                            {formatNumber(source.watchTimeMinutes)} phút
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="font-semibold text-primary">
                                                {source.percentage.toFixed(2)}%
                                            </span>
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