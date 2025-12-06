// src/pages/branch-analytics/BranchAnalyticsPage.tsx

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
                    { label: branchName, icon: <Users className="h-4 w-4" /> },
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
                            {/* Branch Header */}
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
                                // Analytics Tabs
                                <Tabs defaultValue="overview" className="space-y-6">
                                    <TabsList className="inline-flex h-auto w-full items-center justify-start rounded-lg bg-muted p-1 gap-1 overflow-x-auto">
                                        <TabsTrigger value="overview" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Tổng Quan
                                        </TabsTrigger>
                                        <TabsTrigger value="engagement" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Activity className="h-4 w-4 mr-2" />
                                            Tương Tác
                                        </TabsTrigger>
                                        <TabsTrigger value="revenue" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            Doanh Thu
                                        </TabsTrigger>
                                        <TabsTrigger value="audience" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Users className="h-4 w-4 mr-2" />
                                            Khán Giả
                                        </TabsTrigger>
                                        <TabsTrigger value="traffic" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Radio className="h-4 w-4 mr-2" />
                                            Traffic
                                        </TabsTrigger>
                                        <TabsTrigger value="devices" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Monitor className="h-4 w-4 mr-2" />
                                            Thiết Bị
                                        </TabsTrigger>
                                        <TabsTrigger value="content" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Video className="h-4 w-4 mr-2" />
                                            Nội Dung
                                        </TabsTrigger>
                                        <TabsTrigger value="location" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Vị Trí
                                        </TabsTrigger>
                                        <TabsTrigger value="sharing" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Chia Sẻ
                                        </TabsTrigger>
                                        <TabsTrigger value="channels" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                            <Youtube className="h-4 w-4 mr-2" />
                                            Kênh
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Tab 1: Tổng Quan */}
                                    <TabsContent value="overview">
                                        <OverviewTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 2: Tương Tác */}
                                    <TabsContent value="engagement">
                                        <EngagementTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 3: Doanh Thu */}
                                    <TabsContent value="revenue">
                                        <RevenueTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 4: Khán Giả */}
                                    <TabsContent value="audience">
                                        <AudienceTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 5: Traffic */}
                                    <TabsContent value="traffic">
                                        <TrafficTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 6: Thiết Bị */}
                                    <TabsContent value="devices">
                                        <DevicesTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 7: Nội Dung */}
                                    <TabsContent value="content">
                                        <ContentTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 8: Vị Trí */}
                                    <TabsContent value="location">
                                        <LocationTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 9: Chia Sẻ */}
                                    <TabsContent value="sharing">
                                        <SharingTab analytics={analytics} />
                                    </TabsContent>

                                    {/* Tab 10: Kênh */}
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