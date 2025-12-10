// src/pages/team-analytics/components/TeamDevicesTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import type { TeamAnalyticsData } from "../types/team-analytics.types";
import { formatNumber, DEVICE_TYPE_NAMES, OS_NAMES } from "../utils/formatters";

interface TeamDevicesTabProps {
    analytics: TeamAnalyticsData;
}

const DEVICE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
const OS_COLORS = ['#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ef4444', '#14b8a6'];

export function TeamDevicesTab({ analytics }: TeamDevicesTabProps) {
    const { devices, operatingSystem } = analytics.data;

    // Prepare device chart data
    const deviceData = devices.types.map(device => ({
        name: DEVICE_TYPE_NAMES[device.deviceType] || device.deviceType,
        views: device.views,
        watchTime: device.watchTimeMinutes,
        percentage: device.percentage
    }));

    // Prepare OS chart data
    const osData = operatingSystem.systems.map(os => ({
        name: OS_NAMES[os.osType] || os.osName,
        views: os.views,
        watchTime: os.watchTimeMinutes,
        percentage: parseFloat(os.percentage)
    }));

    return (
        <div className="space-y-6">
            {/* Top Device & OS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <Smartphone className="h-5 w-5" />
                            Thiết Bị Hàng Đầu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                            {DEVICE_TYPE_NAMES[devices.topDevice] || devices.topDevice}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Thiết bị được sử dụng nhiều nhất
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <Monitor className="h-5 w-5" />
                            Hệ Điều Hành Hàng Đầu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                            {OS_NAMES[operatingSystem.topOS] || operatingSystem.topOS}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            OS được sử dụng nhiều nhất
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Device Types Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Phân Tích Theo Thiết Bị
                    </CardTitle>
                    <CardDescription>
                        Thống kê lượt xem theo loại thiết bị
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Device Pie Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="views"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Device Bar Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={deviceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#10b981" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Device Table */}
                    <div className="rounded-md border mt-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-semibold">Thiết Bị</th>
                                    <th className="p-3 text-right font-semibold">Lượt Xem</th>
                                    <th className="p-3 text-right font-semibold">Thời Gian Xem</th>
                                    <th className="p-3 text-right font-semibold">Tỷ Lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.types.map((device, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }}
                                                />
                                                <span className="font-medium">
                                                    {DEVICE_TYPE_NAMES[device.deviceType] || device.deviceType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            {formatNumber(device.views)}
                                        </td>
                                        <td className="p-3 text-right text-muted-foreground">
                                            {formatNumber(device.watchTimeMinutes)} phút
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="font-semibold text-primary">
                                                {device.percentage.toFixed(2)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Operating Systems Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Phân Tích Theo Hệ Điều Hành
                    </CardTitle>
                    <CardDescription>
                        Thống kê lượt xem theo OS
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* OS Pie Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={osData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="views"
                                >
                                    {osData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={OS_COLORS[index % OS_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* OS Bar Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={osData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* OS Table */}
                    <div className="rounded-md border mt-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-semibold">Hệ Điều Hành</th>
                                    <th className="p-3 text-right font-semibold">Lượt Xem</th>
                                    <th className="p-3 text-right font-semibold">Thời Gian Xem</th>
                                    <th className="p-3 text-right font-semibold">Tỷ Lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operatingSystem.systems.map((os, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: OS_COLORS[index % OS_COLORS.length] }}
                                                />
                                                <span className="font-medium">
                                                    {OS_NAMES[os.osType] || os.osName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            {formatNumber(os.views)}
                                        </td>
                                        <td className="p-3 text-right text-muted-foreground">
                                            {formatNumber(os.watchTimeMinutes)} phút
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="font-semibold text-primary">
                                                {os.percentage}%
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