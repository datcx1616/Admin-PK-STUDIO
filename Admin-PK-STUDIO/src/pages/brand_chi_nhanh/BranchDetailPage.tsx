// src/pages/branch-analytics/BranchAnalyticsPage.tsx
// UPDATED: Tabs moved to top with underline style

import * as React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentHeader } from "@/pages/components/ContentHeader";
import { ChannelSidebar } from "@/pages/components/ChannelSidebar";
import { ChannelDetailView, ChannelDetailTabsList } from "@/pages/channel-analytics/ChannelDetailView";
import type { Channel } from "@/types/channel.types";
import { useBranchAnalytics } from "./hooks/useBranchAnalytics";
import { useBranch } from "@/hooks/useBranches";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { BranchHeader } from "./components/BranchHeader";
import { DateRangePicker } from "./components/DateRangePicker";
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
    Users,
    AlertCircle,
    Home,
    Building2,
    Info,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BranchAnalyticsPage() {
    const { branchId } = useParams<{ branchId: string }>();
    const { branch, loading: loadingBranch, error: branchError } = useBranch(branchId!);
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null);

    // Sidebar open/close state
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    // Channel detail tabs state (khi chọn một kênh)
    const [channelActiveTab, setChannelActiveTab] = React.useState("overview");

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
                                {branchName}
                            </span>
                        ),
                        // icon: <Building2 className="h-4 w-4" />
                    }

                ]}
            />

            {/* Tabs Container - nằm trên cùng, ngang hàng với sidebar header */}
            <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
                {/* Header Row: Sidebar Header | Tabs | Date Picker */}
                <div className="flex items-center bg-white shrink-0">
                    {/* Sidebar header area - có thể đóng/mở */}
                    <div
                        className={`shrink-0 flex items-center justify-between px-2 h-[42px] border-b border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-[230px] border-r' : 'w-[40px]'
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
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={handleCustomDateChange}
                            onBack={() => {
                                setSelectedChannel(null);
                                setChannelActiveTab("overview");
                            }}
                            loading={loading}
                        />
                    ) : (
                        /* Khi không có kênh được chọn: Hiển thị tabs của Branch */
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
                                        value="audience"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Khán Giả
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
                                        value="content"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Nội Dung
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="location"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Vị Trí
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sharing"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Chia Sẻ
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="channels"
                                        className="group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:!bg-[#F7F7F7]"
                                    >
                                        Kênh
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
                                    className="h-8 w-8 text-gray-500  hover:bg-[#F7F7F7]"
                                    title="Làm mới"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:bg-[#F7F7F7]"
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
                        branchId={branchId}
                        branchName={branchName}
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
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={handleCustomDateChange}
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
                                    // Analytics Content
                                    <div className="space-y-6">
                                        {/* Branch Header */}
                                        {/* <BranchHeader
                                            branchName={branchName}
                                            branchCode={branchCode}
                                            totalChannels={totalChannels}
                                            channelNames={channelNames}
                                            startDate={startDate}
                                            endDate={endDate}
                                        /> */}

                                        {/* TAB CONTENTS */}
                                        <TabsContent value="overview" className="mt-0">
                                            <OverviewTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="engagement" className="mt-0">
                                            <EngagementTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="revenue" className="mt-0">
                                            <RevenueTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="audience" className="mt-0">
                                            <AudienceTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="traffic" className="mt-0">
                                            <TrafficTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="devices" className="mt-0">
                                            <DevicesTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="content" className="mt-0">
                                            <ContentTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="location" className="mt-0">
                                            <LocationTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="sharing" className="mt-0">
                                            <SharingTab analytics={analytics} />
                                        </TabsContent>

                                        <TabsContent value="channels" className="mt-0">
                                            <ChannelsTab analytics={analytics} />
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