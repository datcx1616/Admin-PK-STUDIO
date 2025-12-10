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
    const [selectedDays, setSelectedDays] = React.useState(30);
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);

    // ✅ Use Date objects for better date handling
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

    // ✅ Handle preset days change
    const handleDaysChange = (days: number) => {
        console.log('📅 Changing date range to:', days, 'days');
        setSelectedDays(days);
        const newEndDate = new Date();
        const newStartDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // ✅ Handle custom date range change
    const handleCustomDateChange = (newStartDate: Date, newEndDate: Date) => {
        console.log('📅 Custom date range:', {
            start: newStartDate.toISOString().split('T')[0],
            end: newEndDate.toISOString().split('T')[0]
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setSelectedDays(0); // Clear preset selection
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
                                                    value="traffic"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-indigo-600 hover:border-gray-200 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-600 data-[state=active]:font-semibold"
                                                >
                                                    📡 Traffic
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="devices"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-amber-600 hover:border-gray-200 data-[state=active]:text-amber-600 data-[state=active]:border-amber-600 data-[state=active]:font-semibold"
                                                >
                                                    📱 Thiết Bị
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="content"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-red-600 hover:border-gray-200 data-[state=active]:text-red-600 data-[state=active]:border-red-600 data-[state=active]:font-semibold"
                                                >
                                                    🎬 Nội Dung
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="location"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-purple-600 hover:border-gray-200 data-[state=active]:text-purple-600 data-[state=active]:border-purple-600 data-[state=active]:font-semibold"
                                                >
                                                    📍 Vị Trí
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="sharing"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-cyan-600 hover:border-gray-200 data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-600 data-[state=active]:font-semibold"
                                                >
                                                    📤 Chia Sẻ
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="channels"
                                                    className="relative whitespace-nowrap rounded-none px-4 py-3 flex-1 min-w-fit text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:text-rose-600 hover:border-gray-200 data-[state=active]:text-rose-600 data-[state=active]:border-rose-600 data-[state=active]:font-semibold"
                                                >
                                                    📺 Kênh
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
                                        selectedDays={selectedDays}
                                        onDaysChange={handleDaysChange}
                                        onRefresh={refetch}
                                        isLoading={loading}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onCustomDateChange={handleCustomDateChange}
                                    />

                                    {/* Date range display */}
                                    <div className="text-sm text-muted-foreground">
                                        Đang hiển thị dữ liệu từ <strong>{dateRange.startDate}</strong> đến <strong>{dateRange.endDate}</strong>
                                    </div>

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