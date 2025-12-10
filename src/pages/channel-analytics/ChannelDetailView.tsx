// src/pages/channel-analytics/ChannelDetailView.tsx

import * as React from "react";
import { useChannelAnalytics } from "@/hooks/useChannelAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Eye, Users, DollarSign, Clock,
    ThumbsUp, MessageCircle, Share2, Video,
    BarChart3, Activity, Radio, Monitor
} from "lucide-react";
import { toast } from "sonner";

// Import sub-components
import { MetricCard } from "@/pages/channel-analytics/components/MetricCard";
import { ChannelHeader } from "@/pages/channel-analytics/components/ChannelHeader";
import { OverviewTab } from "@/pages/channel-analytics/components/OverviewTab";
import { EngagementTab } from "@/pages/channel-analytics/components/EngagementTab";
import { RevenueTab } from "@/pages/channel-analytics/components/RevenueTab";
import { AudienceTab } from "@/pages/channel-analytics/components/AudienceTab";
import { ContentTab } from "@/pages/channel-analytics/components/ContentTab";
import { TrafficTab } from "@/pages/channel-analytics/components/TrafficTab";
import { DevicesTab } from "@/pages/channel-analytics/components/DevicesTab";

// Import utils
import { formatNumber, formatCurrency, formatPercentage } from "./utils/formatters";

export function ChannelDetailView({ channel, onBack }: { channel: any, onBack?: () => void }) {
    // Date range state
    const [startDate, setStartDate] = React.useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = React.useState(new Date());

    const { analytics, loading, error, setDateRange, refetch } = useChannelAnalytics({
        channelId: channel?._id,
        autoFetch: true
    });

    // Handle date range change
    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setDateRange({
            startDate: newStartDate.toISOString().split('T')[0],
            endDate: newEndDate.toISOString().split('T')[0]
        });
    };

    const handleRefresh = () => {
        refetch();
        toast.success('Đang làm mới dữ liệu...');
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Skeleton className="h-32" />
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-32" />
                            ))}
                        </div>
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        <Alert variant="destructive">
                            <AlertDescription>
                                {error || "Không thể tải dữ liệu analytics"}
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    {/* Back button for sidebar layout */}
                    {onBack && (
                        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Quay lại
                        </Button>
                    )}

                    {/* ============================================
                         TABS - TabsList ở trên cùng
                        ============================================ */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        {/* TABS LIST - Ở TRÊN CÙNG */}
                        <div className="tabs-sticky-container">
                            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                <TabsList className="inline-flex h-auto w-full items-center justify-start gap-1 p-1.5 bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 rounded-xl border border-gray-200/60 shadow-sm">
                                    <TabsTrigger value="overview" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-blue-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10">
                                        <BarChart3 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-blue-500" />
                                        <span>Tổng Quan</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="engagement" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-pink-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md data-[state=active]:shadow-pink-500/10">
                                        <Activity className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-pink-500" />
                                        <span>Tương Tác</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="revenue" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-emerald-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md data-[state=active]:shadow-emerald-500/10">
                                        <DollarSign className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-emerald-500" />
                                        <span>Doanh Thu</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="audience" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-violet-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-md data-[state=active]:shadow-violet-500/10">
                                        <Users className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-violet-500" />
                                        <span>Khán Giả</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="content" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-amber-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md data-[state=active]:shadow-amber-500/10">
                                        <Video className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-amber-500" />
                                        <span>Nội Dung</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="traffic" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-indigo-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/10">
                                        <Radio className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-indigo-500" />
                                        <span>Nguồn Truy Cập</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="devices" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-cyan-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/10">
                                        <Monitor className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-cyan-500" />
                                        <span>Thiết Bị</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        {/* CHANNEL HEADER - Dưới TabsList */}
                        <ChannelHeader
                            channel={channel}
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={handleDateChange}
                            onRefresh={handleRefresh}
                            isLoading={loading}
                            quotaUsed={analytics.meta?.quotaUsed}
                            processingTimeMs={analytics.meta?.processingTimeMs}
                        />

                        {/* TAB CONTENTS */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Key Metrics Overview - CHỈ HIỆN Ở TAB TỔNG QUAN */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    icon={Eye}
                                    title="Tổng Lượt Xem"
                                    value={formatNumber(analytics.basic.totals.totalViews)}
                                    subtitle="Trong khoảng thời gian đã chọn"
                                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                                />
                                <MetricCard
                                    icon={Clock}
                                    title="Thời Gian Xem"
                                    value={`${formatNumber(parseFloat(analytics.basic.totals.totalWatchTimeHours))}h`}
                                    subtitle={`${formatNumber(analytics.basic.totals.totalWatchTimeMinutes)} phút`}
                                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                                />
                                <MetricCard
                                    icon={Users}
                                    title="Subscribers Mới"
                                    value={`+${formatNumber(analytics.basic.totals.totalSubscribersNet)}`}
                                    subtitle={`Gained: ${formatNumber(analytics.basic.totals.totalSubscribersGained)} | Lost: ${formatNumber(analytics.basic.totals.totalSubscribersLost)}`}
                                    gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                                />
                                <MetricCard
                                    icon={DollarSign}
                                    title="Doanh Thu"
                                    value={formatCurrency(analytics.revenue?.totals?.estimatedRevenue ?? 0)}
                                    subtitle={`CPM: ${formatCurrency(analytics.revenue?.totals?.cpm ?? 0)} | RPM: ${formatCurrency(analytics.revenue?.totals?.rpm ?? 0)}`}
                                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                                />
                            </div>

                            {/* Engagement Metrics - CHỈ HIỆN Ở TAB TỔNG QUAN */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Likes</CardTitle>
                                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatNumber(analytics.engagement.totals.totalLikes)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ratio: {typeof analytics.engagement.totals.likeDislikeRatio === 'number' && analytics.engagement.totals.likeDislikeRatio !== null ? analytics.engagement.totals.likeDislikeRatio.toFixed(2) : '0.00'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatNumber(analytics.engagement.totals.totalComments)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tương tác người xem
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Shares</CardTitle>
                                        <Share2 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatNumber(analytics.engagement.totals.totalShares)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Chia sẻ nội dung
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {formatPercentage(analytics.engagement.totals.engagementRate)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tỷ lệ tương tác
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Overview Tab Content */}
                            <OverviewTab analytics={analytics} />
                        </TabsContent>

                        <TabsContent value="engagement" className="space-y-6">
                            <EngagementTab analytics={analytics} />
                        </TabsContent>
                        <TabsContent value="revenue" className="space-y-6">
                            <RevenueTab analytics={analytics} />
                        </TabsContent>
                        <TabsContent value="audience" className="space-y-6">
                            <AudienceTab analytics={analytics} />
                        </TabsContent>
                        <TabsContent value="content" className="space-y-6">
                            <ContentTab analytics={analytics} />
                        </TabsContent>
                        <TabsContent value="traffic" className="space-y-6">
                            <TrafficTab analytics={analytics} />
                        </TabsContent>
                        <TabsContent value="devices" className="space-y-6">
                            <DevicesTab analytics={analytics} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}