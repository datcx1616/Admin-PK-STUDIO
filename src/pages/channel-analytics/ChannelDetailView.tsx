// src/pages/channel-analytics/ChannelAnalyticsDetailPage.tsx
// UPDATED: Tabs moved to top with underline style

import * as React from "react";
import { useParams } from "react-router-dom";
import { useChannelAnalytics } from "@/hooks/useChannelAnalytics";
import { useChannel } from "@/hooks/useChannels";
import { ContentHeader } from "@/pages/components/ContentHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Home, Youtube, Eye, Users, DollarSign, Clock,
    ThumbsUp, MessageCircle, Share2, Video, Globe, Smartphone,
    BarChart3, Activity, RefreshCw,
    Download, Printer, Calendar, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import sub-components
import { MetricCard } from "@/pages/channel-analytics/components/MetricCard";
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
    const [selectedDays, setSelectedDays] = React.useState(30);

    const { analytics, loading, error, dateRange, setDateRange, refetch } = useChannelAnalytics({
        channelId: channel?._id,
        autoFetch: true
    });

    const handleDaysChange = (days: number) => {
        setSelectedDays(days);
        const endDate = new Date();
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        setDateRange({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    };

    const handleRefresh = () => {
        refetch();
        toast.success('Đang làm mới dữ liệu...');
    };

    const handleExportCSV = () => {
        toast.info('Chức năng xuất CSV đang được phát triển');
    };

    const handlePrint = () => {
        window.print();
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
                         TABS - Moved to Top with Underline Style
                        ============================================ */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        {/* TABS LIST - Sticky with Underline Style */}
                        <div className="tabs-sticky-container">
                            <div className="w-full overflow-x-auto">
                                <TabsList className="inline-flex h-auto w-full items-center justify-start bg-white rounded-none p-0 gap-0 border-t border-gray-200">
                                    <TabsTrigger
                                        value="overview"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-blue-600 hover:border-gray-200 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:font-semibold"
                                    >
                                        📊 Tổng Quan
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="engagement"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-pink-600 hover:border-gray-200 data-[state=active]:text-pink-600 data-[state=active]:border-pink-600 data-[state=active]:font-semibold"
                                    >
                                        ❤️ Tương Tác
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="revenue"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-emerald-600 hover:border-gray-200 data-[state=active]:text-emerald-600 data-[state=active]:border-emerald-600 data-[state=active]:font-semibold"
                                    >
                                        💰 Doanh Thu
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="audience"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-violet-600 hover:border-gray-200 data-[state=active]:text-violet-600 data-[state=active]:border-violet-600 data-[state=active]:font-semibold"
                                    >
                                        👥 Khán Giả
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="content"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-amber-600 hover:border-gray-200 data-[state=active]:text-amber-600 data-[state=active]:border-amber-600 data-[state=active]:font-semibold"
                                    >
                                        🎬 Nội Dung
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="traffic"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-indigo-600 hover:border-gray-200 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600 data-[state=active]:font-semibold"
                                    >
                                        🌐 Nguồn Truy Cập
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="devices"
                                        className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-cyan-600 hover:border-gray-200 data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-600 data-[state=active]:font-semibold"
                                    >
                                        📱 Thiết Bị
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        {/* Channel Header - Below Tabs */}
                        <Card
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                            }}
                            className="rounded-lg"
                        >
                            <CardHeader className="space-y-4">
                                {/* Row 1: Channel Info + Date Range */}
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={channel?.thumbnailUrl} alt={channel?.name} />
                                            <AvatarFallback className="bg-red-100 text-red-700">
                                                <Youtube className="h-8 w-8" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h1 className="text-2xl font-bold">{channel?.name}</h1>
                                            <div className="flex items-center gap-2 mt-1">
                                                {channel?.customUrl && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {channel.customUrl}
                                                    </span>
                                                )}
                                                <Badge variant={channel?.isConnected ? "default" : "secondary"}>
                                                    {channel?.isConnected ? "Connected" : "Disconnected"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Date Range Selector */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Khoảng thời gian:</span>
                                        <div className="flex items-center gap-1 border rounded-md p-1">
                                            <Button
                                                variant={selectedDays === 7 ? "secondary" : "ghost"}
                                                size="sm"
                                                className="h-8 px-3 text-sm"
                                                onClick={() => handleDaysChange(7)}
                                            >
                                                7 ngày
                                            </Button>
                                            <Button
                                                variant={selectedDays === 30 ? "secondary" : "ghost"}
                                                size="sm"
                                                className="h-8 px-3 text-sm"
                                                onClick={() => handleDaysChange(30)}
                                            >
                                                30 ngày
                                            </Button>
                                            <Button
                                                variant={selectedDays === 90 ? "secondary" : "ghost"}
                                                size="sm"
                                                className="h-8 px-3 text-sm"
                                                onClick={() => handleDaysChange(90)}
                                            >
                                                90 ngày
                                            </Button>
                                            <Button
                                                variant={selectedDays === 180 ? "secondary" : "ghost"}
                                                size="sm"
                                                className="h-8 px-3 text-sm"
                                                onClick={() => handleDaysChange(180)}
                                            >
                                                180 ngày
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {/* Row 2: Metadata + Actions */}
                                <div className="flex items-center justify-between gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(analytics.dateRange.startDate).toLocaleDateString('vi-VN')}
                                                {' - '}
                                                {new Date(analytics.dateRange.endDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                Quota: {analytics.meta.quotaUsed}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {analytics.meta.processingTimeMs}ms
                                            </Badge>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {channel?.customUrl && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`https://youtube.com/${channel.customUrl}`, '_blank')}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                YouTube
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            disabled={loading}
                                        >
                                            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                                            Làm mới
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportCSV}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Xuất CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrint}
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            In
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Key Metrics Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Eye}
                                title="Tổng Lượt Xem"
                                value={formatNumber(analytics.basic.totals.totalViews)}
                                subtitle={`Trong ${selectedDays} ngày`}
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

                        {/* Engagement Metrics */}
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

                        {/* TAB CONTENTS */}
                        <TabsContent value="overview" className="space-y-6">
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