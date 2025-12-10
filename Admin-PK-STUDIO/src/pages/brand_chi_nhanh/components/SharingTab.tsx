// src/pages/branch-analytics/components/SharingTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Share2, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

interface SharingTabProps {
    analytics: BranchAnalyticsData | null;
}

export function SharingTab({ analytics }: SharingTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.sharingServices?.services) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu chia sẻ không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const { sharingServices } = analytics.data;
    const services = sharingServices.services || [];
    const totalShares = sharingServices.totalShares || 0;

    // ✅ Check minimum data
    if (services.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu chia sẻ trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Top service
    const topService = services[0];

    // Prepare chart data
    const chartData = services.map(service => ({
        name: service.serviceName,
        shares: service.shares,
        percentage: parseFloat(service.percentage) || 0
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    icon={Share2}
                    title="Tổng Chia Sẻ"
                    value={formatNumber(totalShares)}
                    subtitle="Trên tất cả dịch vụ"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Dịch Vụ Hàng Đầu"
                    value={topService.serviceName}
                    subtitle={`${parseFloat(topService.percentage).toFixed(1)}% shares`}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Share2}
                    title="Số Dịch Vụ"
                    value={services.length.toString()}
                    subtitle="Nền tảng chia sẻ"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Sharing Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Chia Sẻ</CardTitle>
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
                        <CardTitle>Lượt Chia Sẻ Theo Dịch Vụ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={100} />
                                <YAxis fontSize={12} />
                                <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
                                <Legend />
                                <Bar dataKey="shares" fill="#10b981" name="Lượt chia sẻ" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Chi Tiết Dịch Vụ Chia Sẻ</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">Dịch Vụ</th>
                                    <th className="text-right py-3 px-4">Lượt Chia Sẻ</th>
                                    <th className="text-right py-3 px-4">% Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service, index) => {
                                    const percentage = parseFloat(service.percentage) || 0;
                                    return (
                                        <tr key={index} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-medium">
                                                {service.serviceName}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(service.shares)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span className={`font-semibold ${percentage > 20 ? 'text-green-600' :
                                                    percentage > 10 ? 'text-blue-600' :
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