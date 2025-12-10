// src/pages/branch-analytics/BranchAnalyticsPage.tsx
// UPDATED: Tabs moved to top with underline style

import * as React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentHeader } from "@/pages/components/ContentHeader";
import { ChannelSidebar } from "@/pages/components/ChannelSidebar";
import { ChannelDetailView } from "@/pages/channel-analytics/ChannelDetailView";
import type { Channel } from "@/types/channel.types";
import { useBranchAnalytics } from "./hooks/useBranchAnalytics";
import { useBranch } from "@/hooks/useBranches";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { BranchHeader } from "./components/BranchHeader";
import { OverviewTab } from "./components/OverviewTab";
import { EngagementTab } from "./components/EngagementTab";
import { RevenueTab } from "./components/RevenueTab";
import { AudienceTab } from "./components/AudienceTab";
import { TrafficTab } from "./components/TrafficTab";
import { DevicesTab } from "./components/DevicesTab";
import { ContentTab } from "./components/ContentTab";
import { LocationTab } from "./components/LocationTab";
import { SharingTab } from "./components/SharingTab";
import { ChannelsTab } from "./components/ChannelsTab";
import {
    BarChart3,
    Activity,
    DollarSign,
    Users,
    Radio,
    Monitor,
    Video,
    MapPin,
    Share2,
    Youtube,
    AlertCircle,
    Home,
    Building2,
    Info
} from "lucide-react";

export default function BranchAnalyticsPage() {
    const { branchId } = useParams<{ branchId: string }>();
    const { branch, loading: loadingBranch, error: branchError } = useBranch(branchId!);
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);

    // Date range state
    const [startDate, setStartDate] = React.useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = React.useState(new Date());

    // Calculate date range for API
    const dateRange = React.useMemo(() => ({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    }), [startDate, endDate]);

    // Fetch analytics
    const { analytics, loading, error, refetch } = useBranchAnalytics({
        branchId: branchId!,
        dateRange,
        autoFetch: true
    });

    // Handle date range change
    const handleCustomDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // ✅ Loading state
    if (loadingBranch) {
        return <LoadingSkeleton />;
    }

    // ✅ Error state
    if (branchError || !branch) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Chi nhánh", href: "/brand" },
                        { label: "Lỗi", icon: <Users className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar
                        branchId={branchId}
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
                                    {branchError || "Không tìm thấy chi nhánh"}
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Extract branch info
    const branchName = branch?.name || analytics?.data?.branch?.name || "Chi nhánh";
    const branchCode = branch?.code || analytics?.data?.branch?.code || "N/A";
    const totalChannels = analytics?.data?.totalChannels || 0;
    const channelNames = (analytics?.data?.channels || []).map(c => c.name);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ContentHeader */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Chi nhánh", href: "/brand" },
                    { label: branchName, icon: <Building2 className="h-4 w-4" /> },
                ]}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* ChannelSidebar - Left Side */}
                <ChannelSidebar
                    branchId={branchId}
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
                        // Show Branch Analytics
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
                                        Chi nhánh <strong>{branchName}</strong> chưa có dữ liệu analytics.
                                        Vui lòng thêm kênh YouTube và đợi dữ liệu được đồng bộ.
                                    </AlertDescription>
                                </Alert>
                            ) : !analytics ? (
                                // No Data State
                                <Alert variant="default" className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                                    <Info className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-900 dark:text-blue-100">
                                        Chi nhánh <strong>{branchName}</strong> chưa có dữ liệu analytics.
                                        Vui lòng thêm kênh YouTube và đợi dữ liệu được đồng bộ.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                // ============================================
                                //  TABS - Moved to Top with Underline Style
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

                                                {/* Audience Tab */}
                                                <TabsTrigger
                                                    value="audience"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-violet-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-md data-[state=active]:shadow-violet-500/10"
                                                >
                                                    <Users className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-violet-500" />
                                                    <span>Khán Giả</span>
                                                </TabsTrigger>

                                                {/* Traffic Tab */}
                                                <TabsTrigger
                                                    value="traffic"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-indigo-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/10"
                                                >
                                                    <Radio className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-indigo-500" />
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

                                                {/* Content Tab */}
                                                <TabsTrigger
                                                    value="content"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-red-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md data-[state=active]:shadow-red-500/10"
                                                >
                                                    <Video className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-red-500" />
                                                    <span>Nội Dung</span>
                                                </TabsTrigger>

                                                {/* Location Tab */}
                                                <TabsTrigger
                                                    value="location"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-purple-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md data-[state=active]:shadow-purple-500/10"
                                                >
                                                    <MapPin className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-purple-500" />
                                                    <span>Vị Trí</span>
                                                </TabsTrigger>

                                                {/* Sharing Tab */}
                                                <TabsTrigger
                                                    value="sharing"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-cyan-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md data-[state=active]:shadow-cyan-500/10"
                                                >
                                                    <Share2 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-cyan-500" />
                                                    <span>Chia Sẻ</span>
                                                </TabsTrigger>

                                                {/* Channels Tab */}
                                                <TabsTrigger
                                                    value="channels"
                                                    className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-rose-600 hover:bg-white/60 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-md data-[state=active]:shadow-rose-500/10"
                                                >
                                                    <Youtube className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-data-[state=active]:text-rose-500" />
                                                    <span>Kênh</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>
                                    </div>

                                    {/* Branch Header - Below Tabs */}
                                    <BranchHeader
                                        branchName={branchName}
                                        branchCode={branchCode}
                                        totalChannels={totalChannels}
                                        channelNames={channelNames}
                                        onRefresh={refetch}
                                        isLoading={loading}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onDateChange={handleCustomDateChange}
                                    />

                                    {/* TAB CONTENTS */}
                                    <TabsContent value="overview">
                                        <OverviewTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="engagement">
                                        <EngagementTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="revenue">
                                        <RevenueTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="audience">
                                        <AudienceTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="traffic">
                                        <TrafficTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="devices">
                                        <DevicesTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="content">
                                        <ContentTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="location">
                                        <LocationTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="sharing">
                                        <SharingTab analytics={analytics} />
                                    </TabsContent>

                                    <TabsContent value="channels">
                                        <ChannelsTab analytics={analytics} />
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