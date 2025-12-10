// src/pages/teams_chi_nhanh/TeamDetailPage.tsx
// FIXED: TabsList now inside Tabs component

import * as React from "react";
import { useParams } from "react-router-dom";
import { ContentHeader } from "@/pages/components/ContentHeader";
import { ChannelSidebar } from "@/pages/components/ChannelSidebar";
import { ChannelDetailView } from "@/pages/channel-analytics/ChannelDetailView";
import type { Channel } from "@/types/channel.types";
import { Home, Users, BarChart3, Activity, DollarSign, Radio, Monitor, Video, Youtube, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useTeamAnalytics } from "./hooks/useTeamAnalytics";
import { useTeams } from "@/hooks/useTeams";
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

    // Date range state
    const [dateRange, setDateRange] = React.useState<'7' | '30' | '90' | '180'>('30');

    // Calculate actual dates from dateRange
    const { startDate, endDate } = React.useMemo(() => {
        const end = new Date();
        const days = parseInt(dateRange);
        const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    }, [dateRange]);

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
                        showDialog={false}
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
                    { label: teamName, icon: <Users className="h-4 w-4" /> },
                ]}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* ChannelSidebar - Left Side */}
                <ChannelSidebar
                    teamId={teamId}
                    side="left"
                    mode="inline"
                    onChannelSelect={setSelectedChannel}
                    showDialog={false}
                />

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {selectedChannel ? (
                        // Show Channel Detail View when a channel is selected
                        <ChannelDetailView
                            channel={selectedChannel}
                            onBack={() => setSelectedChannel(null)}
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
                                // ============================================
                                //  TABS - Modern White Design
                                // ============================================
                                <Tabs defaultValue="overview" className="space-y-6">
                                    {/* TABS LIST - Modern Glass Morphism Style */}
                                    <div className="tabs-sticky-container">
                                        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                            <TabsList className="inline-flex h-auto w-full items-center justify-start gap-1 p-1.5 bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 rounded-xl border border-gray-200/60 shadow-sm">
                                                {/* Overview Tab */}
                                                <TabsTrigger
                                                    value="overview"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-blue-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10"
                                                >
                                                    <BarChart3 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-blue-500" />
                                                    <span>Tổng Quan</span>
                                                </TabsTrigger>

                                                {/* Engagement Tab */}
                                                <TabsTrigger
                                                    value="engagement"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-pink-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md data-[state=active]:shadow-pink-500/10"
                                                >
                                                    <Activity className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-pink-500" />
                                                    <span>Tương Tác</span>
                                                </TabsTrigger>

                                                {/* Revenue Tab */}
                                                <TabsTrigger
                                                    value="revenue"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-emerald-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md data-[state=active]:shadow-emerald-500/10"
                                                >
                                                    <DollarSign className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-emerald-500" />
                                                    <span>Doanh Thu</span>
                                                </TabsTrigger>

                                                {/* Traffic Tab */}
                                                <TabsTrigger
                                                    value="traffic"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-violet-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-md data-[state=active]:shadow-violet-500/10"
                                                >
                                                    <Radio className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-violet-500" />
                                                    <span>Traffic</span>
                                                </TabsTrigger>

                                                {/* Devices Tab */}
                                                <TabsTrigger
                                                    value="devices"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-amber-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md data-[state=active]:shadow-amber-500/10"
                                                >
                                                    <Monitor className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-amber-500" />
                                                    <span>Thiết Bị</span>
                                                </TabsTrigger>

                                                {/* Videos Tab */}
                                                <TabsTrigger
                                                    value="videos"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-red-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:shadow-red-500/10"
                                                >
                                                    <Video className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-500" />
                                                    <span>Videos</span>
                                                </TabsTrigger>

                                                {/* Channels Tab */}
                                                <TabsTrigger
                                                    value="channels"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-indigo-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/10"
                                                >
                                                    <Youtube className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-indigo-500" />
                                                    <span>Kênh</span>
                                                </TabsTrigger>

                                                {/* Retention Tab */}
                                                <TabsTrigger
                                                    value="retention"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-cyan-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/10"
                                                >
                                                    <TrendingUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-cyan-500" />
                                                    <span>Retention</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>
                                    </div>

                                    {/* Team Header - Below tabs */}
                                    <TeamHeader
                                        teamName={teamName}
                                        totalChannels={totalChannels}
                                        channels={channels}
                                        selectedDays={parseInt(dateRange)}
                                        startDate={new Date(startDate)}
                                        endDate={new Date(endDate)}
                                        loading={loading}
                                        onDaysChange={(days) => setDateRange(days.toString() as '7' | '30' | '90' | '180')}
                                        onCustomDateChange={() => { }}
                                        onRefresh={refetch}
                                        onExport={handleExportCSV}
                                        onPrint={handlePrint}
                                    />

                                    {/* TAB CONTENTS */}
                                    <TabsContent value="overview" className="space-y-6">
                                        <TeamOverviewTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="engagement" className="space-y-6">
                                        <TeamEngagementTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="revenue" className="space-y-6">
                                        <TeamRevenueTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="traffic" className="space-y-6">
                                        <TeamTrafficTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="devices" className="space-y-6">
                                        <TeamDevicesTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="videos" className="space-y-6">
                                        <TeamVideosTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="channels" className="space-y-6">
                                        <TeamChannelsTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="retention" className="space-y-6">
                                        <TeamRetentionTab analytics={analytics} />
                                    </TabsContent>
                                </Tabs>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}