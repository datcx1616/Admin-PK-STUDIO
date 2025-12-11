// src/pages/channel-analytics/ChannelDetailView.tsx
<<<<<<< HEAD
// UPDATED: Tách TabsList ra ngoài để render ở header area
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8

import * as React from "react";
import { useChannelAnalytics } from "@/hooks/useChannelAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Eye, Users, DollarSign, Clock,
<<<<<<< HEAD
    ThumbsUp, MessageCircle, Share2,
    ChevronLeft, RefreshCw, Download, Printer
=======
    ThumbsUp, MessageCircle, Share2
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
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
<<<<<<< HEAD
import { DateRangePicker } from "@/pages/brand_chi_nhanh/components/DateRangePicker";
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8

// Import utils
import { formatNumber, formatCurrency, formatPercentage } from "./utils/formatters";

<<<<<<< HEAD
interface ChannelDetailViewProps {
    channel: any;
    onBack?: () => void;
    /**
     * Nếu true, component sẽ render TabsList bên ngoài (để parent có thể đặt ở header area)
     * Parent cần render TabsHeader component
     */
    externalHeader?: boolean;
    /** Controlled tab value từ parent */
    activeTab?: string;
    /** Callback khi tab thay đổi */
    onTabChange?: (tab: string) => void;
    /** Controlled date range từ parent */
    startDate?: Date;
    endDate?: Date;
    onDateChange?: (startDate: Date, endDate: Date) => void;
}

export function ChannelDetailView({
    channel,
    onBack,
    externalHeader = false,
    activeTab: controlledActiveTab,
    onTabChange,
    startDate: controlledStartDate,
    endDate: controlledEndDate,
    onDateChange: controlledOnDateChange
}: ChannelDetailViewProps) {
    // Internal date range state (sử dụng khi không có controlled state)
    const [internalStartDate, setInternalStartDate] = React.useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [internalEndDate, setInternalEndDate] = React.useState(new Date());

    // Internal tab state
    const [internalActiveTab, setInternalActiveTab] = React.useState("overview");

    // Sử dụng controlled state nếu có, nếu không dùng internal state
    const startDate = controlledStartDate ?? internalStartDate;
    const endDate = controlledEndDate ?? internalEndDate;
    const activeTab = controlledActiveTab ?? internalActiveTab;
=======
export function ChannelDetailView({ channel, onBack }: { channel: any, onBack?: () => void }) {
    // Date range state
    const [startDate, setStartDate] = React.useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = React.useState(new Date());
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8

    const { analytics, loading, error, setDateRange, refetch } = useChannelAnalytics({
        channelId: channel?._id,
        autoFetch: true
    });

<<<<<<< HEAD
    // Sync controlled date range với useChannelAnalytics
    React.useEffect(() => {
        if (controlledStartDate && controlledEndDate) {
            setDateRange({
                startDate: controlledStartDate.toISOString().split('T')[0],
                endDate: controlledEndDate.toISOString().split('T')[0]
            });
        }
    }, [controlledStartDate, controlledEndDate, setDateRange]);

    // Handle date range change
    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        if (controlledOnDateChange) {
            controlledOnDateChange(newStartDate, newEndDate);
        } else {
            setInternalStartDate(newStartDate);
            setInternalEndDate(newEndDate);
        }
=======
    // Handle date range change
    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
        setDateRange({
            startDate: newStartDate.toISOString().split('T')[0],
            endDate: newEndDate.toISOString().split('T')[0]
        });
    };

<<<<<<< HEAD
    // Handle tab change
    const handleTabChange = (tab: string) => {
        if (onTabChange) {
            onTabChange(tab);
        } else {
            setInternalActiveTab(tab);
        }
    };

=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
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

<<<<<<< HEAD
    // Tab content component để tránh lặp code
    const renderTabContents = () => (
        <>
            <TabsContent value="overview" className="space-y-6 mt-0">
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

            <TabsContent value="engagement" className="space-y-6 mt-0">
                <EngagementTab analytics={analytics} />
            </TabsContent>
            <TabsContent value="revenue" className="space-y-6 mt-0">
                <RevenueTab analytics={analytics} />
            </TabsContent>
            <TabsContent value="audience" className="space-y-6 mt-0">
                <AudienceTab analytics={analytics} />
            </TabsContent>
            <TabsContent value="content" className="space-y-6 mt-0">
                <ContentTab analytics={analytics} />
            </TabsContent>
            <TabsContent value="traffic" className="space-y-6 mt-0">
                <TrafficTab analytics={analytics} />
            </TabsContent>
            <TabsContent value="devices" className="space-y-6 mt-0">
                <DevicesTab analytics={analytics} />
            </TabsContent>
        </>
    );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                        {/* CHANNEL HEADER - Hiển thị thông tin kênh */}
                        {/* <ChannelHeader
=======
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
                                <TabsList className="inline-flex h-auto w-full items-center justify-start gap-1 p-1.5 bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 rounded-xl shadow-sm">
                                    <TabsTrigger value="overview" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3] ">
                                        <span>Tổng Quan</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="engagement" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3]">
                                        <span>Tương Tác</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="revenue" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3]">
                                        <span>Doanh Thu</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="audience" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3] ">
                                        <span>Khán Giả</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="content" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3]">
                                        <span>Nội Dung</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="traffic" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3]">
                                        <span>Nguồn Truy Cập</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="devices" className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 data-[state=active]:!bg-[#DEDFE3]">
                                        <span>Thiết Bị</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        {/* CHANNEL HEADER - Dưới TabsList */}
                        <ChannelHeader
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                            channel={channel}
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={handleDateChange}
                            onRefresh={handleRefresh}
                            isLoading={loading}
                            quotaUsed={analytics.meta?.quotaUsed}
                            processingTimeMs={analytics.meta?.processingTimeMs}
<<<<<<< HEAD
                            showDatePicker={false}
                        /> */}

                        {/* TAB CONTENTS */}
                        {renderTabContents()}
=======
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
                                        {/* icon removed */}
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
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                    </Tabs>
                </div>
            </div>
        </div>
    );
<<<<<<< HEAD
}

/**
 * Component TabsList để render ở header area (ngang hàng với danh sách kênh)
 * Sử dụng trong parent component
 */
export function ChannelDetailTabsList({
    activeTab,
    onTabChange,
    startDate,
    endDate,
    onDateChange,
    onRefresh,
    onBack,
    loading = false
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
    startDate: Date;
    endDate: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
    onRefresh?: () => void;
    onBack?: () => void;
    loading?: boolean;
}) {
    return (
        <div className="flex-1 flex items-center justify-between px-2 h-[42px] border-b border-gray-200">
            {/* Back button + Tabs bên trái */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-7 w-7 text-gray-500 hover:text-gray-700 shrink-0"
                        title="Quay lại"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                <TabsList className="inline-flex h-auto items-center justify-start gap-1 p-1 bg-transparent">
                    <TabsTrigger
                        value="overview"
                        onClick={() => onTabChange("overview")}
                        data-state={activeTab === "overview" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Tổng Quan
                    </TabsTrigger>
                    <TabsTrigger
                        value="engagement"
                        onClick={() => onTabChange("engagement")}
                        data-state={activeTab === "engagement" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Tương Tác
                    </TabsTrigger>
                    <TabsTrigger
                        value="revenue"
                        onClick={() => onTabChange("revenue")}
                        data-state={activeTab === "revenue" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Doanh Thu
                    </TabsTrigger>
                    <TabsTrigger
                        value="audience"
                        onClick={() => onTabChange("audience")}
                        data-state={activeTab === "audience" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Khán Giả
                    </TabsTrigger>
                    <TabsTrigger
                        value="content"
                        onClick={() => onTabChange("content")}
                        data-state={activeTab === "content" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Nội Dung
                    </TabsTrigger>
                    <TabsTrigger
                        value="traffic"
                        onClick={() => onTabChange("traffic")}
                        data-state={activeTab === "traffic" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Traffic
                    </TabsTrigger>
                    <TabsTrigger
                        value="devices"
                        onClick={() => onTabChange("devices")}
                        data-state={activeTab === "devices" ? "active" : "inactive"}
                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                    >
                        Thiết Bị
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Actions + Date Picker bên phải */}
            <div className="shrink-0 ml-4 flex items-center gap-1">
                {onRefresh && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRefresh}
                        disabled={loading}
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-[#F7F7F7]"
                        title="Làm mới"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500  hover:bg-[#F7F7F7]"
                    title="Xuất CSV"
                >
                    <Download className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.print()}
                    className="h-8 w-8 text-gray-500 hover:bg-[#F7F7F7]"
                    title="In"
                >
                    <Printer className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={onDateChange}
                />
            </div>
        </div>
    );
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
}