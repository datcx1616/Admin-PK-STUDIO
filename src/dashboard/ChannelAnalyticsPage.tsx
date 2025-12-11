// src/pages/dashboard/ChannelAnalyticsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
    Youtube,
    Eye,
    Clock,
    DollarSign,
    UserPlus,
    ThumbsUp,
    MessageSquare,
    Share2,
    ArrowLeft,
    Calendar,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ChannelAnalytics {
    channel: {
        _id: string;
        name: string;
    };
    analytics: {
        views: number;
        watchTime: number;
        estimatedRevenue: number;
        subscribersGained: number;
        likes: number;
        comments: number;
        shares: number;
        averageViewDuration: number;
        averageViewPercentage: number;
    };
    dailyBreakdown: Array<{
        date: string;
        views: number;
        watchTime: number;
        subscribersGained: number;
    }>;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
};

export default function ChannelAnalyticsPage() {
    const { channelId } = useParams<{ channelId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<ChannelAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    // Default to last 30 days
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchAnalytics = async () => {
        if (!channelId) {
            toast.error("Channel ID is required");
            return;
        }

        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(
                `${API_URL}/dashboard/channels/${channelId}/analytics?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch analytics');
            const result = await response.json();
            setData(result);
        } catch (error) {
            toast.error("Failed to load channel analytics");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleRefresh = () => {
        fetchAnalytics();
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Analytics not available</h2>
                    <Button onClick={() => navigate(-1)} className="mt-4">
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                                <Youtube className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 to-orange-700 bg-clip-text text-transparent">
                                    {data.channel.name}
                                </h1>
                                <p className="text-slate-600 mt-1">Channel Analytics Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Range Selector */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <Label htmlFor="startDate" className="text-sm font-medium text-slate-700">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="endDate" className="text-sm font-medium text-slate-700">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                onClick={handleRefresh}
                                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Main Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Views</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.analytics.views)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Watch Time</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.analytics.watchTime)}
                            </CardTitle>
                            <p className="text-xs text-slate-600 mt-1">seconds</p>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Estimated Revenue</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                ${formatNumber(data.analytics.estimatedRevenue)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Subscribers Gained</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {data.analytics.subscribersGained > 0 ? '+' : ''}{formatNumber(data.analytics.subscribersGained)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Engagement Metrics */}
                <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900">Engagement Metrics</CardTitle>
                        <CardDescription>Audience interaction and engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-100 border border-pink-200">
                                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
                                    <ThumbsUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Likes</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatNumber(data.analytics.likes)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-100 border border-indigo-200">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-lg">
                                    <MessageSquare className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Comments</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatNumber(data.analytics.comments)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-100 border border-emerald-200">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                    <Share2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Shares</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatNumber(data.analytics.shares)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-100 border border-violet-200">
                                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Avg Duration</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatDuration(data.analytics.averageViewDuration)}
                                    </p>
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                        {data.analytics.averageViewPercentage.toFixed(1)}% completion
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Breakdown */}
                {data.dailyBreakdown && data.dailyBreakdown.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-6 h-6" />
                                Daily Performance
                            </CardTitle>
                            <CardDescription>Day-by-day breakdown of channel performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-700">Date</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Views</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Watch Time</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Subscribers</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Trend</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.dailyBreakdown.map((day, index) => {
                                            const prevDay = index > 0 ? data.dailyBreakdown[index - 1] : null;
                                            const viewsChange = prevDay ? day.views - prevDay.views : 0;
                                            const isTrendingUp = viewsChange > 0;

                                            return (
                                                <TableRow key={day.date} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="font-medium text-slate-900">
                                                        {new Date(day.date).toLocaleDateString('vi-VN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                            {formatNumber(day.views)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-slate-600 font-medium">
                                                            {formatDuration(day.watchTime)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary" className={day.subscribersGained > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>
                                                            {day.subscribersGained > 0 ? '+' : ''}{day.subscribersGained}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {prevDay && (
                                                            <div className="flex items-center justify-end gap-1">
                                                                {isTrendingUp ? (
                                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                                )}
                                                                <span className={`text-sm font-medium ${isTrendingUp ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {Math.abs(viewsChange)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
