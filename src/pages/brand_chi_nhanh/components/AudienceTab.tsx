// src/pages/branch-analytics/components/AudienceTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber, formatPercentage } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Users, Globe, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface AudienceTabProps {
    analytics: BranchAnalyticsData | null;
}

export function AudienceTab({ analytics }: AudienceTabProps) {
    // ✅ Early validation for required data
    if (!analytics?.data?.basic?.totals || !analytics?.data?.demographics?.topCountries || !analytics?.data?.subscriptionStatus) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu khán giả không khả dụng. Vui lòng thử lại sau.
                </AlertDescription>
            </Alert>
        );
    }

    const { basic, demographics, subscriptionStatus, retention } = analytics.data;

    // ✅ Safe defaults for totals
    const totalViews = basic.totals.totalViews ?? 0;
    const totalSubscribersGained = basic.totals.totalSubscribersGained ?? 0;
    const totalSubscribersLost = basic.totals.totalSubscribersLost ?? 0;
    const totalSubscribersNet = basic.totals.totalSubscribersNet ?? 0;

    // ✅ Safe subscription status parsing
    const subscribedPercentage = subscriptionStatus.subscribedPercentage
        ? parseFloat(subscriptionStatus.subscribedPercentage)
        : 0;
    const unsubscribedPercentage = subscriptionStatus.unsubscribedPercentage
        ? parseFloat(subscriptionStatus.unsubscribedPercentage)
        : 0;

    // ✅ Safe arrays with filtering
    const topCountries = (demographics.topCountries || []).filter(c => c && c.country);
    const statuses = (subscriptionStatus.statuses || []).filter(s => s && s.status);

    // ✅ Safe find with default
    const subscribedViews = statuses.find(s => s?.status === 'SUBSCRIBED')?.views ?? 0;
    const unsubscribedViews = statuses.find(s => s?.status === 'UNSUBSCRIBED')?.views ?? 0;

    // ✅ Safe retention metrics
    const averageViewPercentage = retention?.averageViewPercentage ?? 0;
    const ctr = retention?.ctr ?? 0;
    const impressions = retention?.impressions ?? 0;

    // ✅ Check minimum data
    if (topCountries.length === 0 && statuses.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu khán giả trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Subscription data for pie chart
    const subscriptionData = [
        { name: 'Đã đăng ký', value: subscribedPercentage },
        { name: 'Chưa đăng ký', value: unsubscribedPercentage },
    ];

    // Top countries data for bar chart
    const countriesData = topCountries.map(country => ({
        name: country.countryName || country.country,
        views: country.views,
        watchTime: country.watchTimeMinutes,
        percentage: parseFloat(country.percentage) || 0
    }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    title="Subscribers Mới"
                    value={`+${formatNumber(totalSubscribersGained)}`}
                    subtitle={`Net: ${totalSubscribersNet >= 0 ? '+' : ''}${formatNumber(totalSubscribersNet)}`}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Users}
                    title="Subscribers Mất"
                    value={`-${formatNumber(totalSubscribersLost)}`}
                    subtitle="Trong khoảng thời gian"
                    gradient="bg-gradient-to-br from-red-500 to-red-600"
                />
                <MetricCard
                    icon={Globe}
                    title="Quốc Gia"
                    value={topCountries.length.toString()}
                    subtitle="Số quốc gia tiếp cận"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="Tỷ Lệ Giữ Chân"
                    value={formatPercentage(averageViewPercentage)}
                    subtitle="Average view percentage"
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Subscription Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Only show if we have data */}
                {statuses.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Trạng Thái Đăng Ký</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={subscriptionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {subscriptionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Đã đăng ký</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatNumber(subscribedViews)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {subscribedPercentage.toFixed(1)}% lượt xem
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Chưa đăng ký</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatNumber(unsubscribedViews)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {unsubscribedPercentage.toFixed(1)}% lượt xem
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Subscriber Growth */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tăng Trưởng Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground mb-2">Subscribers Mới</p>
                                <p className="text-4xl font-bold text-green-600">
                                    +{formatNumber(totalSubscribersGained)}
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-lg bg-red-50 dark:bg-red-950">
                                <p className="text-sm text-muted-foreground mb-2">Subscribers Mất</p>
                                <p className="text-4xl font-bold text-red-600">
                                    -{formatNumber(totalSubscribersLost)}
                                </p>
                            </div>
                            <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <p className="text-sm text-muted-foreground mb-2">Thay Đổi Ròng</p>
                                <p className="text-4xl font-bold text-blue-600">
                                    {totalSubscribersNet >= 0 ? '+' : ''}{formatNumber(totalSubscribersNet)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Geographic Distribution - Only show if we have data */}
            {countriesData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Địa Lý</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={countriesData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" fontSize={12} />
                                <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                <Tooltip
                                    formatter={(value: any) => formatNumber(Number(value))}
                                />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" name="Lượt xem" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Top Countries Table - Only show if we have data */}
            {topCountries.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Quốc Gia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Quốc Gia</th>
                                        <th className="text-right py-3 px-4">Lượt Xem</th>
                                        <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                        <th className="text-right py-3 px-4">% Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCountries.map((country, index) => {
                                        const percentage = parseFloat(country.percentage) || 0;
                                        return (
                                            <tr key={index} className="border-b hover:bg-accent/50">
                                                <td className="py-3 px-4 font-medium">
                                                    {country.countryName || country.country}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {formatNumber(country.views)}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {(country.watchTimeMinutes / 60).toFixed(1)}h
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

            {/* Retention Metrics - Only show if we have data */}
            {retention && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hiệu Suất Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <p className="text-sm text-muted-foreground mb-2">Avg View %</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatPercentage(averageViewPercentage)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                                <p className="text-sm text-muted-foreground mb-2">CTR</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {formatPercentage(ctr)}
                                </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                                <p className="text-sm text-muted-foreground mb-2">Impressions</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {formatNumber(impressions)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}