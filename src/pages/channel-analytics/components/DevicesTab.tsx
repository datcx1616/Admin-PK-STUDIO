// src/pages/channel-analytics/components/DevicesTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./ChartCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import { CHART_COLORS, getChartColor } from "../utils/chartHelpers";
import type { ChannelAnalyticsData } from "@/types/channel-analytics.types";
import { Smartphone, Monitor, Tablet, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DevicesTabProps {
    analytics: ChannelAnalyticsData;
}

export function DevicesTab({ analytics }: DevicesTabProps) {
    const devicesData = analytics.devices.types.map(device => ({
        name: getDeviceName(device.deviceType),
        value: device.views,
        percentage: device.percentage,
        watchTime: device.watchTimeMinutes
    }));

    const osData = analytics.operatingSystem.systems.slice(0, 10).map(os => ({
        name: os.osName,
        value: os.views,
        percentage: parseFloat(os.percentage),
        watchTime: os.watchTimeMinutes
    }));

    function getDeviceName(deviceType: string): string {
        const names: { [key: string]: string } = {
            'MOBILE': 'Di động',
            'DESKTOP': 'Máy tính',
            'TABLET': 'Máy tính bảng',
            'TV': 'TV'
        };
        return names[deviceType] || deviceType;
    }

    function getDeviceIcon(deviceType: string) {
        switch (deviceType) {
            case 'MOBILE':
                return <Smartphone className="h-5 w-5 text-blue-600" />;
            case 'DESKTOP':
                return <Monitor className="h-5 w-5 text-green-600" />;
            case 'TABLET':
                return <Tablet className="h-5 w-5 text-purple-600" />;
            case 'TV':
                return <Tv className="h-5 w-5 text-orange-600" />;
            default:
                return <Monitor className="h-5 w-5 text-gray-600" />;
        }
    }

    return (
        <div className="space-y-6">
            {/* Device Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analytics.devices.types.map((device, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {getDeviceName(device.deviceType)}
                            </CardTitle>
                            {getDeviceIcon(device.deviceType)}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(device.views)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {device.percentage.toFixed(2)}% tổng lượt xem
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Device Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title="Phân Bố Thiết Bị"
                    description="Lượt xem theo loại thiết bị"
                >
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={devicesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {devicesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatNumber(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <Card>
                    <CardHeader>
                        <CardTitle>Chi Tiết Theo Thiết Bị</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analytics.devices.types.map((device, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                    {getDeviceIcon(device.deviceType)}
                                    <div>
                                        <p className="text-sm font-medium">{getDeviceName(device.deviceType)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatNumber(device.watchTimeMinutes)} phút xem
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{formatNumber(device.views)}</p>
                                    <Badge variant="outline" className="text-xs">
                                        {device.percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Operating Systems Chart */}
            <ChartCard
                title="Top 10 Hệ Điều Hành"
                description="Lượt xem theo hệ điều hành"
            >
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={osData}
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
                            dataKey="name"
                            fontSize={12}
                            width={100}
                        />
                        <Tooltip
                            formatter={(value: any) => formatNumber(value)}
                        />
                        <Legend />
                        <Bar
                            dataKey="value"
                            name="Lượt xem"
                            fill={CHART_COLORS.blue}
                        >
                            {osData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Operating Systems Table */}
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
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                    <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.operatingSystem.systems.map((os, index) => (
                                    <tr key={index} className="border-b hover:bg-accent/50">
                                        <td className="py-3 px-4 font-medium">
                                            {os.osName}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            {formatNumber(os.views)}
                                        </td>
                                        <td className="text-right py-3 px-4">
                                            <Badge variant="outline">
                                                {os.percentage}%
                                            </Badge>
                                        </td>
                                        <td className="text-right py-3 px-4 text-muted-foreground">
                                            {formatNumber(os.watchTimeMinutes)} phút
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Tóm Tắt Thiết Bị</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Thiết bị phổ biến nhất</span>
                                <span className="font-medium">{getDeviceName(analytics.devices.topDevice)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">Hệ điều hành phổ biến nhất</span>
                                <span className="font-medium">{analytics.operatingSystem.topOS}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Tổng lượt xem từ TV</span>
                                <span className="font-medium text-orange-600">
                                    {formatNumber(analytics.devices.types.find(d => d.deviceType === 'TV')?.views || 0)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">% Di động</span>
                                <span className="font-medium">
                                    {analytics.devices.types.find(d => d.deviceType === 'MOBILE')?.percentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-sm text-muted-foreground">% Máy tính</span>
                                <span className="font-medium">
                                    {analytics.devices.types.find(d => d.deviceType === 'DESKTOP')?.percentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">Tổng hệ điều hành</span>
                                <span className="font-medium text-blue-600">
                                    {analytics.operatingSystem.systems.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}