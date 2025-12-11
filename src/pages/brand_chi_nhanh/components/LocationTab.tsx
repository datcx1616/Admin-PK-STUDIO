// src/pages/branch-analytics/components/LocationTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { MapPin, Monitor, Smartphone, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface LocationTabProps {
    analytics: BranchAnalyticsData | null;
}

export function LocationTab({ analytics }: LocationTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.playbackLocation?.locations) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu vị trí phát không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const { playbackLocation } = analytics.data;
    const locations = playbackLocation.locations || [];

    // ✅ Check minimum data
    if (locations.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu vị trí phát trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Calculate totals
    const totalViews = locations.reduce((sum, l) => sum + (l.views || 0), 0);

    // Top location
    const topLocation = locations[0];

    // Prepare chart data
    const chartData = locations.map(location => ({
        name: location.locationName,
        value: parseFloat(location.percentage) || 0,
        views: location.views
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    icon={MapPin}
                    title="Vị Trí Hàng Đầu"
                    value={topLocation.locationName}
                    subtitle={`${parseFloat(topLocation.percentage).toFixed(1)}% views`}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={Monitor}
                    title="Tổng Vị Trí"
                    value={locations.length.toString()}
                    subtitle="Vị trí phát khác nhau"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Smartphone}
                    title="Tổng Lượt Xem"
                    value={formatNumber(totalViews)}
                    subtitle="Trên tất cả vị trí"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Location Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Vị Trí Phát</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Vị Trí</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {locations.map((location, index) => {
                                const percentage = parseFloat(location.percentage) || 0;
                                return (
                                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <div>
                                                <p className="font-medium">{location.locationName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatNumber(location.views)} lượt xem
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {percentage.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {(location.watchTimeMinutes / 60).toFixed(1)}h
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Bảng Chi Tiết Vị Trí Phát</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Vị Trí</th>
                                    <th className="text-right py-3 px-4">Lượt Xem</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map((location, index) => {
                                    const percentage = parseFloat(location.percentage) || 0;
                                    return (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-medium">
                                                {location.locationName}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(location.views)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {(location.watchTimeMinutes / 60).toFixed(1)}h
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span className={`font-semibold ${percentage > 50 ? 'text-green-600' :
                                                    percentage > 20 ? 'text-blue-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                    {percentage.toFixed(1)}%
                                                </span>
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