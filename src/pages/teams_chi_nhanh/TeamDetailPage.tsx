// src/pages/team-analytics/TeamAnalyticsPage.tsx - COMPLETE WITH SIDEBAR

import * as React from "react";
import { useParams } from "react-router-dom";
import { ContentHeader } from "@/pages/components/ContentHeader";
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
import { ChannelSidebar } from "@/pages/components/ChannelSidebar";
import { ChannelDetailView } from "@/pages/channel-analytics/ChannelDetailView";
import type { Channel } from "@/types/channel.types";
import { Home, Users, BarChart3, Building2 } from "lucide-react";
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

export default function TeamAnalyticsPage() {
    const { teamId } = useParams();

    // Fetch team data
    const { teams, loading: loadingTeam } = useTeams({ autoFetch: true });
    const team = teams.find(t => t._id === teamId);

    // Selected channel state
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);

    // Date range state - BRANCH STYLE
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
                        { label: "nhóm", href: "/teams" },
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
    const branchName = team?.branch?.name || "N/A";

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ContentHeader */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "nhóm", href: "/teams" },
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
                            {/* Team Header */}
                            <TeamHeader
                                teamName={teamName}
                                totalChannels={totalChannels}
                                channels={channels}
                                dateRange={dateRange}
                                onDateRangeChange={(value) => setDateRange(value as '7' | '30' | '90' | '180')}
                                onRefresh={refetch}
                                onExportCSV={handleExportCSV}
                                onPrint={handlePrint}
                            />

                            {/* Date range display */}
                            <div className="text-sm text-muted-foreground">
                                Đang hiển thị dữ liệu từ <strong>{startDate}</strong> đến <strong>{endDate}</strong>
                                {branchName !== "N/A" && (
                                    <span className="ml-2">
                                        • Chi nhánh: <strong>{branchName}</strong>
                                    </span>
                                )}
                            </div>

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
                                // Analytics Tabs
                                <Tabs defaultValue="overview" className="space-y-6">
                                    <TabsList className="inline-flex h-auto w-full items-center justify-start rounded-lg bg-muted p-1 gap-1 flex-wrap overflow-x-auto">
                                        <TabsTrigger value="overview" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            📊 Tổng Quan
                                        </TabsTrigger>
                                        <TabsTrigger value="engagement" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            ❤️ Tương Tác
                                        </TabsTrigger>
                                        <TabsTrigger value="revenue" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            💰 Doanh Thu
                                        </TabsTrigger>
                                        <TabsTrigger value="traffic" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            📡 Traffic
                                        </TabsTrigger>
                                        <TabsTrigger value="devices" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            📱 Thiết Bị
                                        </TabsTrigger>
                                        <TabsTrigger value="videos" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            🎬 Videos
                                        </TabsTrigger>
                                        <TabsTrigger value="channels" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            📺 Kênh
                                        </TabsTrigger>
                                        <TabsTrigger value="retention" className="flex-1 min-w-[120px] rounded-md px-3 py-2.5">
                                            📈 Retention
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview">
                                        <TeamOverviewTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="engagement">
                                        <TeamEngagementTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="revenue">
                                        <TeamRevenueTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="traffic">
                                        <TeamTrafficTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="devices">
                                        <TeamDevicesTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="videos">
                                        <TeamVideosTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="channels">
                                        <TeamChannelsTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="retention">
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