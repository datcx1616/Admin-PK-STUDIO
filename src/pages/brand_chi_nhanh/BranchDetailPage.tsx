import * as React from "react"
import { useParams } from "react-router-dom"
import { useBranch } from "@/hooks/useBranches"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import {
    Building2, Users, Youtube, TrendingUp, Home,
    Activity, Clock, Eye, DollarSign, Video,
    BarChart3, RefreshCw, Download, Printer
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Import new components
import { LoadingSkeleton } from "./components/LoadingSkeleton"
import { MetricCard } from "./components/MetricCard"
import { OverviewTab } from "./components/OverviewTab"
import { EngagementTab } from "./components/EngagementTab"
import { RevenueTab } from "./components/RevenueTab"
import { AudienceTab } from "./components/AudienceTab"
import { ContentTab } from "./components/ContentTab"
import { AdvancedTab } from "./components/AdvancedTab"

// Import utils and types
import { formatNumber } from "./utils/formatters"
import { type BranchAnalytics, type TeamWithStats, type ChannelWithStats } from "./types"

export default function BranchDetailPagee() {
    const { branchId } = useParams<{ branchId: string }>()
    const { branch, loading, error } = useBranch(branchId!)

    const [analytics, setAnalytics] = React.useState<BranchAnalytics | null>(null)
    const [teams, setTeams] = React.useState<TeamWithStats[]>([])
    const [channels, setChannels] = React.useState<ChannelWithStats[]>([])
    const [loadingAnalytics, setLoadingAnalytics] = React.useState(false)
    const [selectedDays, setSelectedDays] = React.useState(30)
    const [dateRange, setDateRange] = React.useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    })

    const handleDaysChange = (days: number) => {
        setSelectedDays(days)
        const endDate = new Date()
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        setDateRange({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        })
    }

    const fetchAnalytics = React.useCallback(async () => {
        if (!branchId) return

        setLoadingAnalytics(true)
        console.log('🔄 Fetching analytics for branch:', branchId, 'Date range:', dateRange)

        try {
            // ✅ FIX 1: Dùng 'authToken' thay vì 'token'
            const token = localStorage.getItem('authToken')

            // ✅ FIX 2: Validate token exists
            if (!token) {
                console.error('❌ No auth token found in localStorage')
                toast.error('Vui lòng đăng nhập lại')
                setLoadingAnalytics(false)
                return
            }

            const API_URL = import.meta.env.VITE_API_URL || 'https://api.nexachannel.com/api';
            const params = new URLSearchParams({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            })

            const apiEndpoint = `${API_URL}/youtube/analytics/branch/${branchId}?${params.toString()}`
            console.log('📡 API Request:', apiEndpoint)
            console.log('🔑 Token exists:', !!token)
            console.log('🔑 Token preview:', token.substring(0, 20) + '...')

            const analyticsRes = await fetch(apiEndpoint, {
                headers: {
                    // ✅ FIX 3: Dùng 'Authorization: Bearer' format thay vì 'x-access-token'
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            // Check analytics response
            console.log('📊 Analytics status:', analyticsRes.status, analyticsRes.statusText)

            if (analyticsRes.ok) {
                const contentType = analyticsRes.headers.get('content-type')
                console.log('🔍 Content-Type:', contentType)

                // Clone response để có thể đọc text nếu cần
                const responseClone = analyticsRes.clone()

                // Thử parse JSON trước
                try {
                    const response = await analyticsRes.json()
                    console.log('✅ Analytics response:', response)
                    console.log('📈 Data structure:', {
                        hasSuccess: !!response.success,
                        hasData: !!response.data,
                        dataKeys: response.data ? Object.keys(response.data) : []
                    })

                    if (response.success && response.data) {
                        // Map backend structure to frontend expected structure
                        const data = response.data

                        // Extract teams and channels from API response
                        const channelsList = data.channels || []
                        console.log('📺 Channels from API:', channelsList.length)
                        setChannels(channelsList)

                        // Teams are not directly in the response, but we have totalTeams
                        // We'll fetch teams separately if needed, or use the data we already have
                        setTeams([]) // Backend analytics API doesn't return full team details

                        const mappedData: BranchAnalytics = {
                            summary: {
                                totalChannels: data.totalChannels || channelsList.length,
                                totalTeams: data.totalTeams || 0,
                                totalSubscribers: 0, // Will be calculated from channels
                                totalViews: data.basic?.totals?.totalViews || 0,
                                totalVideos: 0, // Will be calculated if available
                                totalWatchTime: data.basic?.totals?.totalWatchTimeMinutes ? data.basic.totals.totalWatchTimeMinutes * 60 : 0,
                                averageViewDuration: data.basic?.totals?.averageViewDuration || 0,
                                totalSubscribersNet: data.basic?.totals?.totalSubscribersNet || 0,
                                totalLikes: data.engagement?.totals?.totalLikes || 0,
                                totalComments: data.engagement?.totals?.totalComments || 0,
                                totalShares: data.engagement?.totals?.totalShares || 0,
                                engagementRate: data.engagement?.totals?.engagementRate || 0
                            },
                            analytics: {
                                views: data.basic?.totals?.totalViews || 0,
                                watchTime: data.basic?.totals?.totalWatchTimeMinutes ? data.basic.totals.totalWatchTimeMinutes * 60 : 0,
                                estimatedRevenue: data.revenue?.totals?.estimatedRevenue || 0,
                                subscribersGained: data.basic?.totals?.totalSubscribersGained || 0,
                                subscribersLost: data.basic?.totals?.totalSubscribersLost || 0,
                                subscribersNet: data.basic?.totals?.totalSubscribersNet || 0,
                                averageViewDuration: data.basic?.totals?.averageViewDuration || 0,
                                likes: data.engagement?.totals?.totalLikes || 0,
                                comments: data.engagement?.totals?.totalComments || 0,
                                shares: data.engagement?.totals?.totalShares || 0,
                                engagementRate: data.engagement?.totals?.engagementRate || 0
                            },
                            revenue: {
                                estimatedRevenue: data.revenue?.totals?.estimatedRevenue || 0,
                                adRevenue: data.revenue?.totals?.estimatedAdRevenue || 0,
                                rpm: data.revenue?.totals?.rpm || 0,
                                cpm: data.revenue?.totals?.cpm || 0,
                                monetizedPlaybacks: data.revenue?.totals?.monetizedPlaybacks || 0,
                                adImpressions: data.revenue?.totals?.adImpressions || 0
                            },
                            channels: channelsList
                        }
                        console.log('📝 Mapped analytics data:', mappedData)
                        setAnalytics(mappedData)
                        toast.success('Analytics loaded successfully')
                    } else {
                        console.warn('⚠️ Unexpected analytics response format:', response)
                        toast.warning('Dữ liệu analytics không đúng định dạng')
                    }
                } catch (jsonError) {
                    // Nếu không parse được JSON, đọc text
                    const text = await responseClone.text()
                    console.error('❌ Failed to parse JSON. Response text (first 500 chars):', text.substring(0, 500))
                    console.error('JSON parse error:', jsonError)
                    toast.error('Lỗi parse dữ liệu analytics')
                }
            } else if (analyticsRes.status === 401) {
                // ✅ Handle 401 specifically
                console.error('❌ 401 Unauthorized - Token invalid or expired')
                toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!')

                // Clear token and redirect to login
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')

                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000)
            } else {
                const errorText = await analyticsRes.text()
                console.warn('❌ Analytics API failed:', analyticsRes.status, analyticsRes.statusText, errorText)
                toast.error(`Lỗi tải analytics: ${analyticsRes.status} ${analyticsRes.statusText}`)
            }
        } catch (err) {
            console.error('Error fetching analytics:', err)
            // Only show toast if it's not a JSON parse error (which we've already handled)
            if (err instanceof Error && !err.message?.includes('JSON')) {
                toast.error('Lỗi khi tải dữ liệu analytics')
            }
        } finally {
            setLoadingAnalytics(false)
        }
    }, [branchId, dateRange])

    React.useEffect(() => {
        // Reset channels khi branchId thay đổi
        if (branchId) {
            setChannels([])
            setTeams([])
            setAnalytics(null)
        }
    }, [branchId])

    React.useEffect(() => {
        if (branchId && branch) {
            fetchAnalytics()
        }
    }, [branchId, branch, fetchAnalytics])

    const totalStats = {
        teams: teams.length,
        channels: analytics?.summary?.totalChannels || channels.length,
        members: teams.reduce((sum, team) => sum + team.membersCount, 0),
        subscribers: analytics?.summary?.totalSubscribers || channels.reduce((sum, ch) => sum + ch.subscriberCount, 0),
        views: analytics?.summary?.totalViews || channels.reduce((sum, ch) => sum + ch.viewCount, 0),
        videos: analytics?.summary?.totalVideos || channels.reduce((sum, ch) => sum + (ch.videoCount || 0), 0)
    }

    if (loading) {
        return <LoadingSkeleton />
    }

    if (error || !branch) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Chi nhánh", href: "/brand" },
                        { label: "Lỗi", icon: <Building2 className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar branchId={branchId} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-6">
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error || "Không tìm thấy chi nhánh"}
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ContentHeader
                breadcrumbs={[
                    { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Chi nhánh", href: "/brand" },
                    { label: branch.name, icon: <Building2 className="h-4 w-4" /> },
                ]}
            />

            <div className="flex flex-1 overflow-hidden">
                <ChannelSidebar branchId={branchId} side="left" mode="inline" />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 space-y-8">
                        {/* Branch Header Card */}
                        <Card className="border rounded-lg">
                            <CardHeader className="space-y-3">
                                {/* First Row: Icon + Branch name + Code + Date range selector (all in one line) */}
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-6 w-6" />
                                        <h1 className="text-2xl font-bold">{branch.name}</h1>
                                        {branch.code && (
                                            <Badge variant="secondary" className="text-sm font-normal">
                                                {branch.code}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Date range selector - right side of first row */}
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

                                {/* Second Row: Branch info + Director + Action buttons */}
                                <div className="flex items-center justify-between gap-6 text-sm text-muted-foreground">
                                    {/* Branch name and channels list */}
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{branch.name}</span>
                                        <span>·</span>
                                        {channels.length > 0 ? (
                                            <div className="flex items-center gap-1">
                                                {channels.slice(0, 3).map((ch, idx) => (
                                                    <span key={ch._id}>
                                                        {ch.name}
                                                        {idx < channels.slice(0, 3).length - 1 && ', '}
                                                    </span>
                                                ))}
                                                {channels.length > 3 && (
                                                    <span className="text-muted-foreground">
                                                        +{channels.length - 3} khác
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{totalStats.channels} kênh</span>
                                        )}
                                    </div>

                                    {/* Director info */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <span>Trưởng nhóm:</span>
                                        <span className="text-foreground">{branch.director?.name || 'Chưa chỉ định'}</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchAnalytics()}
                                            disabled={loadingAnalytics}
                                            className="gap-2"
                                        >
                                            <RefreshCw className={cn("h-4 w-4", loadingAnalytics && "animate-spin")} />
                                            Làm mới
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => {
                                                toast.info('Chức năng xuất CSV đang được phát triển')
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                            Xuất CSV
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => {
                                                window.print()
                                            }}
                                        >
                                            <Printer className="h-4 w-4" />
                                            In/PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Users}
                                title="Tổng Teams"
                                value={totalStats.teams.toString()}
                                subtitle={`${totalStats.members} thành viên`}
                                gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                            />
                            <MetricCard
                                icon={Youtube}
                                title="Tổng Kênh"
                                value={totalStats.channels.toString()}
                                subtitle={`${formatNumber(totalStats.subscribers)} subscribers`}
                                gradient="bg-gradient-to-br from-red-500 to-rose-600"
                            />
                            <MetricCard
                                icon={Eye}
                                title="Tổng Lượt Xem"
                                value={formatNumber(totalStats.views)}
                                subtitle={`${totalStats.videos} videos`}
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                            />
                            <MetricCard
                                icon={TrendingUp}
                                title="Hiệu Suất"
                                value={formatNumber(analytics?.analytics?.views || 0)}
                                subtitle={`Trong khoảng thời gian`}
                                gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                            />
                        </div>

                        {/* Tabs Content */}
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
                                <TabsTrigger value="content" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                    <Video className="h-4 w-4 mr-2" />
                                    Nội Dung
                                </TabsTrigger>
                                <TabsTrigger value="advanced" className="rounded-md px-3 py-2.5 whitespace-nowrap">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Nâng Cao
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab 1: Tổng Quan */}
                            <TabsContent value="overview" className="space-y-6">
                                <OverviewTab analytics={analytics} />
                            </TabsContent>
                            {/* Tab 2: Tương Tác */}
                            <TabsContent value="engagement" className="space-y-6">
                                <EngagementTab analytics={analytics} />
                            </TabsContent>

                            {/* Tab 3: Doanh Thu */}
                            <TabsContent value="revenue" className="space-y-6">
                                <RevenueTab analytics={analytics} />
                            </TabsContent>

                            {/* Tab 4: Khán Giả (Teams) */}
                            <TabsContent value="audience" className="space-y-6">
                                <AudienceTab teams={teams} totalMembers={totalStats.members} />
                            </TabsContent>

                            {/* Tab 5: Nội Dung (Channels) */}
                            <TabsContent value="content" className="space-y-6">
                                <ContentTab channels={channels} totalSubscribers={totalStats.subscribers} />
                            </TabsContent>

                            {/* Tab 6: Nâng Cao */}
                            <TabsContent value="advanced" className="space-y-6">
                                <AdvancedTab analytics={analytics} isLoading={loadingAnalytics} onRefresh={fetchAnalytics} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
