// src/pages/teams_chi_nhanh/TeamDetailPage.tsx
// UPDATED: Tabs moved to header area, aligned with sidebar

import * as React from "react";
import { useParams } from "react-router-dom";
import { ContentHeader } from "@/pages/components/ContentHeader";
import { ChannelSidebar } from "@/pages/components/ChannelSidebar";
import { ChannelDetailView, ChannelDetailTabsList } from "@/pages/channel-analytics/ChannelDetailView";
import type { Channel } from "@/types/channel.types";
import { Home, Users, ChevronLeft, ChevronRight, RefreshCw, Download, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeamAnalytics } from "./hooks/useTeamAnalytics";
import { useTeams } from "@/hooks/useTeams";
import { DateRangePicker } from "@/pages/brand_chi_nhanh/components/DateRangePicker";
import {
    TeamHeader,
    TeamOverviewTab,
    TeamEngagementTab,
    TeamRevenueTab,
    TeamTrafficTab,
    TeamDevicesTab,
    TeamVideosTab,
    TeamChannelsTab,
    TeamRetentionTab
} from "./components";

// Skeleton cho ContentHeader
function SkeletonContentHeader() {
    return (
        <div className="px-6 pt-6 pb-2 border-b bg-background">
            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-40 rounded" />
        </div>
    );
}

export default function TeamAnalyticsPage() {
    const { teamId } = useParams();

    // Fetch team data
    const { teams, loading: loadingTeam } = useTeams({ autoFetch: true });
    const team = teams.find(t => t._id === teamId);

    // Selected channel state
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);

    // Sidebar open/close state
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    // Channel detail tabs state (khi chọn một kênh)
    const [channelActiveTab, setChannelActiveTab] = React.useState("overview");

    // Date range state
    const [dateRange, setDateRange] = React.useState<'7' | '30' | '90' | '180'>('30');

    // Custom date range state for DateRangePicker
    const [customStartDate, setCustomStartDate] = React.useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [customEndDate, setCustomEndDate] = React.useState(new Date());

    // Calculate actual dates from customStartDate/customEndDate
    const { startDate, endDate } = React.useMemo(() => {
        return {
            startDate: customStartDate.toISOString().split('T')[0],
            endDate: customEndDate.toISOString().split('T')[0]
        };
    }, [customStartDate, customEndDate]);

    // Handle custom date change
    const handleCustomDateChange = (newStartDate: Date, newEndDate: Date) => {
        setCustomStartDate(newStartDate);
        setCustomEndDate(newEndDate);
    };

    // Fetch analytics data
    const { analytics, loading, error, refetch } = useTeamAnalytics({
        teamId: teamId!,
        startDate,
        endDate,
        autoFetch: true
    });

    // Export to CSV
    const handleExportCSV = () => {
        if (!analytics?.data) return;

        const { basic, engagement, revenue } = analytics.data;

        const csvData = [
            ['Team Analytics Export'],
            ['Team', team?.name || 'Unknown'],
            ['Date Range', `${startDate} to ${endDate}`],
            [''],
            ['Metric', 'Value'],
            ['Total Views', basic.totals.totalViews],
            ['Total Watch Time (hours)', basic.totals.totalWatchTimeHours],
            ['Total Subscribers Gained', basic.totals.totalSubscribersGained],
            ['Total Subscribers Lost', basic.totals.totalSubscribersLost],
            ['Total Subscribers Net', basic.totals.totalSubscribersNet],
            ['Total Likes', engagement.totals.totalLikes],
            ['Total Comments', engagement.totals.totalComments],
            ['Total Shares', engagement.totals.totalShares],
            ['Engagement Rate (%)', engagement.totals.engagementRate],
            ['Estimated Revenue', revenue.totals.estimatedRevenue],
            ['CPM', revenue.totals.cpm],
            ['RPM', revenue.totals.rpm],
        ];

        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `team-analytics-${teamId}-${startDate}-${endDate}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    // Print/PDF
    const handlePrint = () => {
        window.print();
    };

    // Loading state
    if (loadingTeam) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <SkeletonContentHeader />
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Skeleton */}
                    <div className="w-[480px] border-r bg-background">
                        <div className="p-4 border-b">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="p-3 space-y-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="p-3 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-6 space-y-6">
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <Card key={i}>
                                        <CardContent className="p-6 space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-8 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state - team not found
    if (!team) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Nhóm", href: "/teams" },
                        { label: "Lỗi", icon: <Users className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar
                        teamId={teamId}
                        side="left"
                        mode="inline"
                        onChannelSelect={setSelectedChannel}
                    />
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-6">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Không tìm thấy team này
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const teamName = team?.name || analytics?.data?.team?.name || "Team";
    const totalChannels = analytics?.data?.totalChannels || team?.channels?.length || 0;
    const channels = analytics?.data?.channels || [];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ContentHeader */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Nhóm", href: "/teams" },
                    {
                        label: (
                            <span
                                style={{
                                    fontFamily: `gitbook-content-font, ui-sans-serif, system-ui, sans-serif,
          "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol", "Noto Color Emoji"`,
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    color: "rgb(107, 114, 128)",
                                }}
                            >
                                {teamName}
                            </span>
                        ),
                        // icon: <Users className="h-4 w-4" />
                    }

                ]}
            />

            {/* Tabs Container - nằm trên cùng, ngang hàng với sidebar header */}
            <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
                {/* Header Row: Sidebar Header | Tabs | Date Picker */}
                <div className="flex items-center bg-white shrink-0">
                    {/* Sidebar header area - có thể đóng/mở */}
                    <div
                        className={`shrink-0 flex items-center justify-between px-2 h-[42px] border-b border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-[280px] border-r' : 'w-[40px]'
                            }`}
                    >
                        {isSidebarOpen ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <h3
                                        style={{
                                            fontFamily: `gitbook-content-font, ui-sans-serif, system-ui, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol", "Noto Color Emoji"`,
                                            fontStyle: "normal",
                                            fontWeight: 500,
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                            color: "rgb(107, 114, 128)",
                                        }}
                                    >
                                        Danh sách kênh
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="h-5 w-5 text-gray-500 hover:text-gray-700"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(true)}
                                className="h-6 w-6 text-gray-500 hover:text-gray-700 mx-auto"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* Tabs area - flex-1 */}
                    {selectedChannel ? (
                        /* Khi có kênh được chọn: Hiển thị tabs của ChannelDetailView */
                        <ChannelDetailTabsList
                            activeTab={channelActiveTab}
                            onTabChange={setChannelActiveTab}
                            startDate={customStartDate}
                            endDate={customEndDate}
                            onDateChange={handleCustomDateChange}
                            onBack={() => {
                                setSelectedChannel(null);
                                setChannelActiveTab("overview");
                            }}
                            loading={loading}
                        />
                    ) : (
                        /* Khi không có kênh được chọn: Hiển thị tabs của Team */
                        <div className="flex-1 flex items-center justify-between px-2 h-[42px] border-b border-gray-200">
                            {/* Tabs bên trái */}
                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                <TabsList className="inline-flex h-auto items-center justify-start gap-1 p-1 bg-transparent">
                                    <TabsTrigger
                                        value="overview"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Tổng Quan
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="engagement"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Tương Tác
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="revenue"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Doanh Thu
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="traffic"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Traffic
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="devices"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Thiết Bị
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="videos"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Videos
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="channels"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Kênh
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="retention"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Retention
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Actions + Date Picker bên phải */}
                            <div className="shrink-0 ml-4 flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={refetch}
                                    disabled={loading}
                                    className="h-8 w-8 text-gray-500 hover:bg-[#F7F7F7]"
                                    title="Làm mới"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:bg-[#F7F7F7]"
                                    title="Xuất CSV"
                                    onClick={handleExportCSV}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrint}
                                    className="h-8 w-8 text-gray-500 hover:bg-[#F7F7F7]"
                                    title="In"
                                >
                                    <Printer className="h-4 w-4" />
                                </Button>
                                <div className="w-px h-6 bg-gray-200 mx-1" />
                                <DateRangePicker
                                    startDate={customStartDate}
                                    endDate={customEndDate}
                                    onDateChange={handleCustomDateChange}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Row: Sidebar | Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* ChannelSidebar - Left Side (headerHeight=0 vì header đã render ở trên) */}
                    <ChannelSidebar
                        teamId={teamId}
                        teamName={teamName}
                        side="left"
                        mode="inline"
                        onChannelSelect={setSelectedChannel}
                        headerHeight={0}
                        isOpen={isSidebarOpen}
                        onToggle={setIsSidebarOpen}
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedChannel ? (
                            // Show Channel Detail View when a channel is selected
                            <ChannelDetailView
                                channel={selectedChannel}
                                activeTab={channelActiveTab}
                                onTabChange={setChannelActiveTab}
                                startDate={customStartDate}
                                endDate={customEndDate}
                                onDateChange={handleCustomDateChange}
                            />
                        ) : (
                            // Show Team Analytics
                            <div className="max-w-7xl mx-auto p-6 space-y-6">
                                {/* Loading State for Analytics */}
                                {loading && !analytics ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                        <div className="h-96 w-full bg-muted animate-pulse rounded-lg" />
                                    </div>
                                ) : error ? (
                                    // Error State for Analytics
                                    <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-900 dark:text-blue-100">
                                            Team <strong>{teamName}</strong> chưa có dữ liệu analytics.
                                            Vui lòng thêm kênh YouTube và đợi dữ liệu được đồng bộ.
                                        </AlertDescription>
                                    </Alert>
                                ) : !analytics ? (
                                    // No Data State
                                    <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-900 dark:text-blue-100">
                                            Team <strong>{teamName}</strong> chưa có dữ liệu analytics.
                                            Vui lòng thêm kênh YouTube và đợi dữ liệu được đồng bộ.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    // Analytics Content
                                    <div className="space-y-6">
                                        {/* Team Header */}
                                        {/* <TeamHeader
                                            teamName={teamName}
                                            totalChannels={totalChannels}
                                            channels={channels}
                                            startDate={customStartDate}
                                            endDate={customEndDate}
                                            isLoading={loading}
                                            onDateChange={handleCustomDateChange}
                                            onRefresh={refetch}
                                            onExport={handleExportCSV}
                                            onPrint={handlePrint}
                                            showDatePicker={false}
                                        /> */}

                                        {/* TAB CONTENTS */}
                                        <TabsContent value="overview" className="mt-0">
                                            <TeamOverviewTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="engagement" className="mt-0">
                                            <TeamEngagementTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="revenue" className="mt-0">
                                            <TeamRevenueTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="traffic" className="mt-0">
                                            <TeamTrafficTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="devices" className="mt-0">
                                            <TeamDevicesTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="videos" className="mt-0">
                                            <TeamVideosTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="channels" className="mt-0">
                                            <TeamChannelsTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="retention" className="mt-0">
                                            <TeamRetentionTab analytics={analytics} />
                                        </TabsContent>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    );
}