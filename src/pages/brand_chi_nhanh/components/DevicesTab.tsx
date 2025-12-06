// src/pages/branch-analytics/components/DevicesTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from "../utils/formatters";
import { getDeviceName } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Smartphone, Monitor, Tv, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface DevicesTabProps {
    analytics: BranchAnalyticsData | null;
}

export function DevicesTab({ analytics }: DevicesTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.devices?.types || !analytics?.data?.operatingSystem?.systems) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu thiết bị không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const { devices, operatingSystem } = analytics.data;
    const deviceTypes = devices.types || [];
    const osSystems = operatingSystem.systems || [];

    // ✅ Check minimum data
    if (deviceTypes.length === 0 && osSystems.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu thiết bị trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Calculate totals
    const totalViews = deviceTypes.reduce((sum, d) => sum + (d.views || 0), 0);

    // Top device
    const topDevice = deviceTypes[0];

    // Prepare chart data
    const deviceChartData = deviceTypes.map(device => ({
        name: getDeviceName(device.deviceType),
        views: device.views,
        percentage: device.percentage
    }));

    const osChartData = osSystems.slice(0, 10).map(os => ({
        name: os.osName,
        views: os.views,
        percentage: parseFloat(os.percentage) || 0
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Monitor}
                    title="Thiết Bị Hàng Đầu"
                    value={getDeviceName(topDevice.deviceType)}
                    subtitle={`${topDevice.percentage.toFixed(1)}% views`}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={Smartphone}
                    title="Loại Thiết Bị"
                    value={deviceTypes.length.toString()}
                    subtitle="Số loại thiết bị"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Tv}
                    title="Hệ Điều Hành"
                    value={osSystems.length.toString()}
                    subtitle="Số HĐH khác nhau"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <MetricCard
                    icon={Monitor}
                    title="Tổng Lượt Xem"
                    value={formatNumber(totalViews)}
                    subtitle="Trên tất cả thiết bị"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Device Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {deviceTypes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Phân Bố Thiết Bị</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={deviceChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="percentage"
                                    >
                                        {deviceChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {osSystems.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 10 Hệ Điều Hành</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={osChartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" fontSize={12} />
                                    <YAxis dataKey="name" type="category" width={80} fontSize={10} />
                                    <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
                                    <Bar dataKey="views" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Device Types Table */}
            {deviceTypes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Thiết Bị</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Thiết Bị</th>
                                        <th className="text-right py-3 px-4">Lượt Xem</th>
                                        <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                        <th className="text-right py-3 px-4">% Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deviceTypes.map((device, index) => (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-medium">
                                                {getDeviceName(device.deviceType)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(device.views)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {(device.watchTimeMinutes / 60).toFixed(1)}h
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span className={`font-semibold ${device.percentage > 40 ? 'text-green-600' :
                                                    device.percentage > 20 ? 'text-blue-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                    {device.percentage.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Operating Systems Table */}
            {osSystems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Hệ Điều Hành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Hệ Điều Hành</th>
                                        <th className="text-right py-3 px-4">Lượt Xem</th>
                                        <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                        <th className="text-right py-3 px-4">% Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {osSystems.map((os, index) => {
                                        const percentage = parseFloat(os.percentage) || 0;
                                        return (
                                            <tr key={index} className="border-b hover:bg-accent/50">
                                                <td className="py-3 px-4 font-medium">
                                                    {os.osName}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {formatNumber(os.views)}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {(os.watchTimeMinutes / 60).toFixed(1)}h
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {percentage.toFixed(1)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}