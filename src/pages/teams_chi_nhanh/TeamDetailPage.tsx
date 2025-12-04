import * as React from "react"
import { useParams } from "react-router-dom"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import {
    Home,
    Users,
    Youtube,
    User,
    Eye,
    Clock,
    TrendingUp,
    Activity,
    MessageSquare,
    ThumbsUp,
    Share2,
    Award,
    Calendar,
    Dot,
    Building2,
    UserCircle,
    Video,
    BarChart3,
    Download,
    Printer,
    RefreshCw
} from "lucide-react"
import { teamsAPI } from "@/lib/teams-api"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Using ToggleGroup for range instead of Select
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ButtonGroup } from "@/components/ui/button-group"
import { cn } from "@/lib/utils"
import { OverviewSummary } from "./components/OverviewSummary"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Types
interface TeamData {
    _id: string
    name: string
    description?: string
    branch?: {
        _id: string
        name: string
        code?: string
    }
    leader?: {
        _id: string
        name: string
        email: string
        role: string
    }
    members?: Array<{
        _id: string
        name: string
        email: string
        role: string
    }>
    channels?: Array<{
        _id: string
        name: string
        customUrl?: string
        youtubeChannelId: string
        subscriberCount?: number
        viewCount?: number
        videoCount?: number
        isConnected: boolean
    }>
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
}

interface OverviewData {
    team?: TeamData
    statistics?: {
        totalMembers: number
        totalChannels: number
        totalVideos?: number
        totalSubscribers: number
        totalViews: number
        totalWatchTimeHours?: number
        totalWatchTimeMinutes?: number
        averageViewDuration?: number
        totalLikes?: number
        totalComments?: number
        totalShares?: number
        engagementRate?: number
        subscribersGained?: number
        subscribersLost?: number
        subscribersNet?: number
    }
    channelAssignments?: Array<{
        channelId: string
        channelName: string
        editorsAssigned: number
        editors?: Array<{
            userId: string
            userName: string
            email: string
            assignedAt: string
        }>
    }>
    recentVideos?: Array<{
        _id: string
        title: string
        status: string
        channel?: {
            name: string
        }
        createdAt: string
    }>
}

interface YouTubeAnalyticsData {
    success?: boolean
    data?: {
        team?: {
            id: string
            name: string
        }
        totalChannels?: number
        channels?: Array<{
            id: string
            name: string
            thumbnail?: string
        }>
        dateRange?: {
            startDate: string
            endDate: string
        }
        basic?: {
            totals: {
                totalViews: number
                totalWatchTimeMinutes: number
                totalWatchTimeHours: number
                totalSubscribersGained: number
                totalSubscribersLost: number
                totalSubscribersNet: number
                averageViewDuration: number
            }
        }
        engagement?: {
            totals: {
                totalLikes: number
                totalDislikes: number
                totalComments: number
                totalShares: number
                engagementRate: number
                likeDislikeRatio: number
            }
        }
        revenue?: {
            totals: {
                estimatedRevenue: number
                estimatedAdRevenue: number
                monetizedPlaybacks: number
                adImpressions: number
                cpm: number
                rpm: number
            }
            monetizationStatus: string
            currency: string
        }
        traffic?: {
            sources: Array<{
                sourceType: string
                views: number
                watchTimeMinutes: number
                percentage: number
            }>
            topSource: string
        }
        devices?: {
            types: Array<{
                deviceType: string
                views: number
                watchTimeMinutes: number
                percentage: number
            }>
            topDevice: string
        }
        demographics?: {
            ageGroups: Array<{
                ageGroup: string
                viewsPercentage: number
            }>
            gender: {
                male: number
                female: number
            }
            topCountries: Array<{
                country: string
                countryName: string
                views: number
                watchTimeMinutes: number
                percentage: number
            }>
        }
        videos?: {
            topByViews: Array<{
                videoId: string
                title: string
                views: number
                watchTimeMinutes: number
                likes: number
                comments: number
                shares: number
                channelName?: string
            }>
            topByWatchTime: Array<Record<string, unknown>>
            topByEngagement: Array<Record<string, unknown>>
        }
        retention?: {
            averageViewPercentage: number
            cardClickRate: number
            impressions: number
            impressionClickThroughRate: number
        }
        playbackLocation?: {
            locations: Array<{
                locationType: string
                locationName: string
                views: number
                watchTimeMinutes: number
                percentage: number
            }>
            topLocation: string
        }
        operatingSystem?: {
            systems: Array<{
                osType: string
                osName: string
                views: number
                watchTimeMinutes: number
                percentage: number
            }>
            topOS: string
        }
        subscriptionStatus?: {
            statuses: Array<{
                status: string
                statusName: string
                views: number
                percentage: number
            }>
            subscribedPercentage: number
            unsubscribedPercentage: number
        }
        sharingServices?: {
            services: Array<{
                service: string
                serviceName: string
                shares: number
                percentage: number
            }>
            topService: string
            totalShares: number
        }
        channelAnalytics?: Array<ChannelAnalyticsItem>
    }
}

interface ChannelAnalyticsItem {
    channelId: string
    channelName: string
    basic?: {
        totals?: {
            totalViews?: number
            totalWatchTimeMinutes?: number
            totalWatchTimeHours?: number
            totalSubscribersGained?: number
            totalSubscribersLost?: number
            totalSubscribersNet?: number
            averageViewDuration?: number
        }
    }
    engagement?: {
        totals?: {
            totalLikes?: number
            totalComments?: number
            totalShares?: number
        }
    }
}

export default function TeamDetailPage() {
    const { teamId } = useParams()
    const [team, setTeam] = React.useState<TeamData | null>(null)
    const [overview, setOverview] = React.useState<OverviewData | null>(null)
    const [youtubeAnalytics, setYoutubeAnalytics] = React.useState<YouTubeAnalyticsData | null>(null)
    const [loading, setLoading] = React.useState(true)
    // Đã lược bỏ cờ loading chi tiết (overviewLoading, analyticsLoading) sau khi tách UI
    const [dateRange, setDateRange] = React.useState<'7' | '30' | '90' | '180'>('30')

    React.useEffect(() => {
        const fetchData = async () => {
            if (!teamId) return

            try {
                setLoading(true)


                // Fetch team basic info
                const teamData = await teamsAPI.getById(teamId)
                console.log('📊 Team Data:', teamData)
                setTeam(teamData)

                // Fetch team overview with statistics
                try {
                    const overviewData = await teamsAPI.getOverview(teamId)
                    console.log('📈 Overview Data:', overviewData)
                    setOverview(overviewData)
                } catch (err) {
                    console.error('❌ Error fetching overview:', err)
                }

                // Fetch YouTube Analytics data
                try {
                    const endDate = new Date().toISOString().split('T')[0]
                    const days = parseInt(dateRange)
                    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

                    const analyticsData = await apiClient.getTeamAnalytics(teamId, {
                        startDate,
                        endDate
                    })
                    console.log('📊 Dữ liệu YouTube Analytics:', analyticsData)
                    setYoutubeAnalytics(analyticsData)
                } catch (err) {
                    console.error('❌ Lỗi khi lấy dữ liệu YouTube Analytics:', err)
                }
            } catch (error) {
                console.error('❌ Error fetching team:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [teamId, dateRange])

    // Refresh data
    const handleRefresh = () => {
        window.location.reload()
    }

    // Export to CSV
    const handleExportCSV = () => {
        if (!ytData) return

        const csvData = [
            ['Chỉ số', 'Giá trị'],
            ['Tổng lượt xem', ytData.basic?.totals?.totalViews || 0],
            ['Thời gian xem (giờ)', ytData.basic?.totals?.totalWatchTimeHours || 0],
            ['Tổng lượt thích', ytData.engagement?.totals?.totalLikes || 0],
            ['Tổng bình luận', ytData.engagement?.totals?.totalComments || 0],
            ['Subscriber tăng', ytData.basic?.totals?.totalSubscribersGained || 0],
            ['Subscriber giảm', ytData.basic?.totals?.totalSubscribersLost || 0],
            ['Tỷ lệ tương tác', `${ytData.engagement?.totals?.engagementRate || 0}%`],
        ]

        const csv = csvData.map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `team-${team?.name}-phan-tich-${dateRange}-ngay.csv`
        a.click()
    }

    // Print / PDF
    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                {/* Skeleton Breadcrumb */}
                <div className="border-b px-6 py-4 bg-background/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-16" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Channel Sidebar Skeleton */}
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

                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-6 space-y-6">
                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <Card key={i}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-4" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-8 w-16 mb-2" />
                                            <Skeleton className="h-3 w-24" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Members Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!team) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Trang chủ", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Đội", href: "/teams" },
                        { label: "Lỗi", icon: <Users className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar teamId={teamId} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="text-center text-muted-foreground">Không tìm thấy đội</div>
                    </div>
                </div>
            </div>
        )
    }

    // Calculate statistics from both API data and local data
    const channels = team?.channels || []

    // Merge data from overview và YouTube Analytics API - Sử dụng cấu trúc mới
    const ytData = youtubeAnalytics?.data

    const stats = {
        totalMembers: overview?.statistics?.totalMembers ?? (team?.members?.length || 0),
        totalChannels: overview?.statistics?.totalChannels ?? channels.length,
        totalVideos: overview?.statistics?.totalVideos ?? (channels.reduce((sum, ch) => sum + (ch.videoCount || 0), 0)),
        totalSubscribers: overview?.statistics?.totalSubscribers ?? (channels.reduce((sum, ch) => sum + (ch.subscriberCount || 0), 0)),
        totalViews: ytData?.basic?.totals?.totalViews ?? overview?.statistics?.totalViews ?? (channels.reduce((sum, ch) => sum + (ch.viewCount || 0), 0)),
        totalWatchTimeHours: ytData?.basic?.totals?.totalWatchTimeHours ?? (overview?.statistics?.totalWatchTimeHours ?? 0),
        totalWatchTimeMinutes: ytData?.basic?.totals?.totalWatchTimeMinutes ?? (overview?.statistics?.totalWatchTimeMinutes ?? 0),
        averageViewDuration: ytData?.basic?.totals?.averageViewDuration ?? (overview?.statistics?.averageViewDuration ?? 0),
        totalLikes: ytData?.engagement?.totals?.totalLikes ?? (overview?.statistics?.totalLikes ?? 0),
        totalDislikes: ytData?.engagement?.totals?.totalDislikes ?? 0,
        totalComments: ytData?.engagement?.totals?.totalComments ?? (overview?.statistics?.totalComments ?? 0),
        totalShares: ytData?.engagement?.totals?.totalShares ?? (overview?.statistics?.totalShares ?? 0),
        engagementRate: ytData?.engagement?.totals?.engagementRate ?? (overview?.statistics?.engagementRate ?? 0),
        likeDislikeRatio: ytData?.engagement?.totals?.likeDislikeRatio ?? 0,
        subscribersGained: ytData?.basic?.totals?.totalSubscribersGained ?? (overview?.statistics?.subscribersGained ?? 0),
        subscribersLost: ytData?.basic?.totals?.totalSubscribersLost ?? (overview?.statistics?.subscribersLost ?? 0),
        subscribersNet: ytData?.basic?.totals?.totalSubscribersNet ?? (overview?.statistics?.subscribersNet ?? ((overview?.statistics?.subscribersGained ?? 0) - (overview?.statistics?.subscribersLost ?? 0)))
    }

    // Các cờ tổng hợp (không dùng sau khi lược bỏ phần tổng quan nhanh)

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Teams", href: "/teams" },
                    { label: team.name, icon: <Users className="h-4 w-4" /> },
                ]}
            />

            {/* Layout: Channel Sidebar on left, Content on right */}
            <div className="flex flex-1 overflow-hidden">
                {/* Channel Sidebar - fetches channels from API based on teamId */}
                <ChannelSidebar teamId={teamId} side="left" mode="inline" />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 space-y-6">
                        {/* Modern Header - compact toolbar style */}
                        <Card className="border shadow-sm">
                            <CardHeader className="space-y-3">
                                {/* Row 1: Title + channel count + range selector */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Users className="h-6 w-6 text-primary" />
                                        <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
                                        <Badge variant="secondary" className="ml-1 gap-1">
                                            <Dot className="h-4 w-4" />
                                            {stats.totalChannels} kênh
                                        </Badge>
                                        {team.branch && (
                                            <Badge variant="outline" className="gap-1.5">
                                                <Building2 className="h-3 w-3" />
                                                {team.branch.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Khoảng thời gian:</span>
                                        <ToggleGroup
                                            type="single"
                                            value={dateRange}
                                            onValueChange={(v) => v && setDateRange(v as '7' | '30' | '90' | '180')}
                                            variant="outline"
                                            size="sm"
                                            spacing={0}
                                            className="border bg-background shadow-xs"
                                            aria-label="Chọn khoảng thời gian"
                                        >
                                            <ToggleGroupItem value="7" className="px-4 font-semibold">7 ngày</ToggleGroupItem>
                                            <ToggleGroupItem value="30" className="px-4 font-semibold">30 ngày</ToggleGroupItem>
                                            <ToggleGroupItem value="90" className="px-4 font-semibold">90 ngày</ToggleGroupItem>
                                            <ToggleGroupItem value="180" className="px-4 font-semibold">180 ngày</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>

                                {/* Row 2: Actions + Leader */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <ButtonGroup>
                                        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                                            <RefreshCw className="h-4 w-4" />
                                            Làm mới
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                                            <Download className="h-4 w-4" />
                                            Xuất CSV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                                            <Printer className="h-4 w-4" />
                                            In/PDF
                                        </Button>
                                    </ButtonGroup>

                                    {team.leader && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Trưởng nhóm:</span>
                                            <span className="font-medium">{team.leader.name}</span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Khối thống kê tổng quan với các ô màu */}
                        <OverviewSummary stats={stats} />

                        {/* Tabs chi tiết */}
                        <Tabs defaultValue="members" className="space-y-6">
                            <TabsList className="inline-flex h-auto w-full items-center justify-start rounded-lg bg-muted p-1 gap-1">
                                <TabsTrigger
                                    value="members"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Thành viên ({team.members?.length || 0})
                                </TabsTrigger>

                                <TabsTrigger
                                    value="channels"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <Youtube className="h-4 w-4 mr-2" />
                                    Kênh ({team.channels?.length || 0})
                                </TabsTrigger>

                                {overview?.channelAssignments && overview.channelAssignments.length > 0 && (
                                    <TabsTrigger
                                        value="assignments"
                                        className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                    >
                                        <UserCircle className="h-4 w-4 mr-2" />
                                        Phân công
                                    </TabsTrigger>
                                )}

                                {overview?.recentVideos && overview.recentVideos.length > 0 && (
                                    <TabsTrigger
                                        value="videos"
                                        className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                    >
                                        <Video className="h-4 w-4 mr-2" />
                                        Video gần đây
                                    </TabsTrigger>
                                )}

                                {ytData?.channelAnalytics && ytData.channelAnalytics.length > 0 && (
                                    <TabsTrigger
                                        value="analytics"
                                        className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                    >
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Phân tích theo kênh
                                    </TabsTrigger>
                                )}

                                <TabsTrigger
                                    value="details"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Chi tiết
                                </TabsTrigger>
                            </TabsList>

                            {/* Members Tab */}
                            <TabsContent value="members" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Thành viên đội
                                        </CardTitle>
                                        <CardDescription>
                                            Tất cả thành viên trong đội
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {team.members && team.members.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-muted/50">
                                                            <TableHead className="font-semibold">Thành viên</TableHead>
                                                            <TableHead className="font-semibold">Email</TableHead>
                                                            <TableHead className="font-semibold">Vai trò</TableHead>
                                                            <TableHead className="font-semibold text-right">Trạng thái</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {team.members.map((member: { _id: string; name: string; email: string; role: string }) => (
                                                            <TableRow key={member._id} className="hover:bg-muted/50">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar>
                                                                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white">
                                                                                {member.name?.charAt(0).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="font-medium">{member.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-muted-foreground">
                                                                    {member.email}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary">
                                                                        {member.role}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {team.leader?._id === member._id && (
                                                                        <Badge className="bg-amber-500 hover:bg-amber-600">
                                                                            <Award className="h-3 w-3 mr-1" />
                                                                            Trưởng nhóm
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={User}
                                                title="Chưa có thành viên"
                                                description="Đội này chưa có thành viên"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Channels Tab */}
                            <TabsContent value="channels" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Youtube className="h-5 w-5" />
                                            Kênh YouTube
                                        </CardTitle>
                                        <CardDescription>
                                            Tất cả kênh do đội quản lý
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {team.channels && team.channels.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {team.channels.map((channel: { _id: string; name: string; youtubeChannelId: string; subscriberCount?: number; isConnected: boolean }) => (
                                                    <Card key={channel._id} className="border-2 hover:border-primary transition-colors">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-linear-to-br from-red-500 to-pink-600 shrink-0">
                                                                    <Youtube className="h-7 w-7 text-white" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-lg mb-1 truncate">
                                                                        {channel.name}
                                                                    </h3>
                                                                    <p className="text-xs text-muted-foreground mb-3 font-mono truncate">
                                                                        {channel.youtubeChannelId}
                                                                    </p>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                                            <span className="text-sm font-medium">
                                                                                {channel.subscriberCount?.toLocaleString() || 0}
                                                                            </span>
                                                                        </div>
                                                                        <Badge variant={channel.isConnected ? "default" : "secondary"}>
                                                                            {channel.isConnected ? '✓ Đã kết nối' : 'Ngoại tuyến'}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={Youtube}
                                                title="Chưa có kênh"
                                                description="Đội này chưa có kênh YouTube"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Channel Assignments Tab */}
                            {
                                overview?.channelAssignments && overview.channelAssignments.length > 0 && (
                                    <TabsContent value="assignments" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <UserCircle className="h-5 w-5" />
                                                    Phân công kênh
                                                </CardTitle>
                                                <CardDescription>
                                                    Phân công biên tập cho từng kênh
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {overview.channelAssignments.map((assignment) => (
                                                        <Card key={assignment.channelId} className="border-2">
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                                                                            <Youtube className="h-5 w-5 text-red-600" />
                                                                        </div>
                                                                        <div>
                                                                            <CardTitle className="text-base">{assignment.channelName}</CardTitle>
                                                                            <CardDescription className="text-xs">
                                                                                {assignment.editorsAssigned} biên tập được phân công
                                                                            </CardDescription>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {assignment.editorsAssigned} Biên tập
                                                                    </Badge>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                {assignment.editors && assignment.editors.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {assignment.editors.map((editor) => (
                                                                            <div
                                                                                key={editor.userId}
                                                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <Avatar className="h-8 w-8">
                                                                                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs">
                                                                                            {editor.userName.charAt(0).toUpperCase()}
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                    <div>
                                                                                        <p className="font-medium text-sm">{editor.userName}</p>
                                                                                        <p className="text-xs text-muted-foreground">{editor.email}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-xs text-muted-foreground">
                                                                                    {formatDate(editor.assignedAt)}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground text-center py-4">
                                                                        Chưa phân công biên tập
                                                                    </p>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )
                            }

                            {/* Recent Videos Tab */}
                            {
                                overview?.recentVideos && overview.recentVideos.length > 0 && (
                                    <TabsContent value="videos" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Video className="h-5 w-5" />
                                                    Video gần đây
                                                </CardTitle>
                                                <CardDescription>
                                                    Các video mới nhất từ các kênh của đội
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {overview.recentVideos.map((video) => (
                                                        <div
                                                            key={video._id}
                                                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                                                        >
                                                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 shrink-0">
                                                                <Video className="h-6 w-6 text-red-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium mb-1 line-clamp-2">
                                                                    {video.title}
                                                                </h4>
                                                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {video.status}
                                                                    </Badge>
                                                                    {video.channel && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Youtube className="h-3 w-3" />
                                                                            {video.channel.name}
                                                                        </span>
                                                                    )}
                                                                    {video.createdAt && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {formatDate(video.createdAt)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )
                            }

                            {/* Analytics by Channel Tab - Thống kê từ YouTube API */}
                            {
                                ytData?.channelAnalytics && ytData.channelAnalytics.length > 0 && (
                                    <TabsContent value="analytics" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <BarChart3 className="h-5 w-5" />
                                                    Phân tích YouTube theo kênh
                                                </CardTitle>
                                                <CardDescription>
                                                    Dữ liệu thống kê từ YouTube API ({ytData.dateRange?.startDate} - {ytData.dateRange?.endDate})
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {ytData.channelAnalytics.map((item: ChannelAnalyticsItem) => (
                                                        <Card key={item.channelId} className="border-2">
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 shrink-0">
                                                                        <Youtube className="h-5 w-5 text-red-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <CardTitle className="text-lg">{item.channelName}</CardTitle>
                                                                        <CardDescription className="text-xs">
                                                                            ID: {item.channelId}
                                                                        </CardDescription>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Eye className="h-4 w-4" />
                                                                            Lượt xem
                                                                        </div>
                                                                        <p className="text-2xl font-bold">{(item.basic?.totals?.totalViews || 0).toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Clock className="h-4 w-4" />
                                                                            Thời gian xem
                                                                        </div>
                                                                        <p className="text-2xl font-bold">
                                                                            {(item.basic?.totals?.totalWatchTimeHours || 0).toLocaleString()}h
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {(item.basic?.totals?.totalWatchTimeMinutes || 0).toLocaleString()} phút
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <ThumbsUp className="h-4 w-4" />
                                                                            Lượt thích
                                                                        </div>
                                                                        <p className="text-2xl font-bold">{(item.engagement?.totals?.totalLikes || 0).toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <MessageSquare className="h-4 w-4" />
                                                                            Bình luận
                                                                        </div>
                                                                        <p className="text-2xl font-bold">{(item.engagement?.totals?.totalComments || 0).toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Share2 className="h-4 w-4" />
                                                                            Chia sẻ
                                                                        </div>
                                                                        <p className="text-2xl font-bold">{(item.engagement?.totals?.totalShares || 0).toLocaleString()}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                                            Subscriber tăng
                                                                        </div>
                                                                        <p className="text-2xl font-bold text-green-600">
                                                                            +{(item.basic?.totals?.totalSubscribersGained || 0).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                                                                            Subscriber giảm
                                                                        </div>
                                                                        <p className="text-2xl font-bold text-red-600">
                                                                            -{(item.basic?.totals?.totalSubscribersLost || 0).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Activity className="h-4 w-4" />
                                                                            Thời lượng xem TB
                                                                        </div>
                                                                        <p className="text-2xl font-bold">
                                                                            {Math.round(item.basic?.totals?.averageViewDuration || 0)}s
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                {/* Summary Card */}
                                                {ytData?.basic && ytData?.engagement && (
                                                    <Card className="mt-6 border-2 border-primary/20 bg-primary/5">
                                                        <CardHeader>
                                                            <CardTitle className="flex items-center gap-2">
                                                                <Award className="h-5 w-5 text-primary" />
                                                                Tổng Hợp Toàn Team
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Eye className="h-4 w-4" />
                                                                        Tổng lượt xem
                                                                    </div>
                                                                    <p className="text-3xl font-bold text-primary">
                                                                        {(ytData.basic.totals.totalViews || 0).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Clock className="h-4 w-4" />
                                                                        Thời gian xem
                                                                    </div>
                                                                    <p className="text-3xl font-bold text-primary">
                                                                        {(ytData.basic.totals.totalWatchTimeHours || 0).toLocaleString()}h
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <ThumbsUp className="h-4 w-4" />
                                                                        Tổng lượt thích
                                                                    </div>
                                                                    <p className="text-3xl font-bold text-primary">
                                                                        {(ytData.engagement.totals.totalLikes || 0).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                                                        Subscribers thuần
                                                                    </div>
                                                                    <p className={cn(
                                                                        "text-3xl font-bold",
                                                                        (ytData.basic.totals.totalSubscribersNet || 0) > 0 ? "text-green-600" : "text-red-600"
                                                                    )}>
                                                                        {(ytData.basic.totals.totalSubscribersNet || 0) > 0 ? '+' : ''}
                                                                        {(ytData.basic.totals.totalSubscribersNet || 0).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Activity className="h-4 w-4" />
                                                                        Tỷ lệ tương tác
                                                                    </div>
                                                                    <p className="text-3xl font-bold text-primary">
                                                                        {(ytData.engagement.totals.engagementRate || 0).toFixed(2)}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )
                            }

                            {/* Details Tab - Chi tiết tổng hợp */}
                            <TabsContent value="details" className="space-y-4">
                                {/* Statistics Summary Table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5" />
                                            Bảng Chi Tiết Thống Kê
                                        </CardTitle>
                                        <CardDescription>
                                            Tổng hợp số liệu từ {stats.totalChannels} kênh
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead className="font-semibold">Chỉ số</TableHead>
                                                        <TableHead className="font-semibold text-right">Tổng</TableHead>
                                                        <TableHead className="font-semibold text-right">TB/Kênh</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <MetricRow
                                                        icon={Eye}
                                                        label="Lượt xem"
                                                        total={stats.totalViews}
                                                        avg={stats.totalChannels ? Math.round(stats.totalViews / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={Clock}
                                                        label="Thời gian xem (giờ)"
                                                        total={stats.totalWatchTimeHours}
                                                        avg={stats.totalChannels ? Math.round(stats.totalWatchTimeHours / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={Activity}
                                                        label="Thời lượng TB (giây)"
                                                        total={Math.round(stats.averageViewDuration)}
                                                        avg={stats.totalChannels && stats.averageViewDuration ? Math.round(stats.averageViewDuration) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={Users}
                                                        label="Subscribers mới"
                                                        total={stats.subscribersGained}
                                                        avg={stats.totalChannels ? Math.round(stats.subscribersGained / stats.totalChannels) : 0}
                                                        prefix="+"
                                                        variant="success"
                                                    />
                                                    <MetricRow
                                                        icon={Users}
                                                        label="Subscribers mất"
                                                        total={stats.subscribersLost}
                                                        avg={stats.totalChannels ? Math.round(stats.subscribersLost / stats.totalChannels) : 0}
                                                        prefix="-"
                                                        variant="destructive"
                                                    />
                                                    <MetricRow
                                                        icon={TrendingUp}
                                                        label="Subscribers thuần"
                                                        total={stats.subscribersNet}
                                                        avg={stats.totalChannels ? Math.round(stats.subscribersNet / stats.totalChannels) : 0}
                                                        highlight
                                                    />
                                                    <MetricRow
                                                        icon={ThumbsUp}
                                                        label="Lượt thích"
                                                        total={stats.totalLikes}
                                                        avg={stats.totalChannels ? Math.round(stats.totalLikes / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={MessageSquare}
                                                        label="Bình luận"
                                                        total={stats.totalComments}
                                                        avg={stats.totalChannels ? Math.round(stats.totalComments / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={Share2}
                                                        label="Chia sẻ"
                                                        total={stats.totalShares}
                                                        avg={stats.totalChannels ? Math.round(stats.totalShares / stats.totalChannels) : 0}
                                                    />
                                                    <TableRow className="bg-primary/5 font-medium">
                                                        <TableCell className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-primary" />
                                                            Tỷ lệ tương tác
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {stats.engagementRate.toFixed(2)}%
                                                        </TableCell>
                                                        <TableCell />
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Team Information Table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Thông tin đội
                                        </CardTitle>
                                        <CardDescription>
                                            Thông tin đầy đủ về đội
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableBody>
                                                    <DetailRow label="Mã đội" value={team._id} icon={BarChart3} />
                                                    <DetailRow label="Tên đội" value={team.name} icon={Users} />
                                                    <DetailRow label="Mô tả" value={team.description || 'Không có'} icon={MessageSquare} />
                                                    <DetailRow
                                                        label="Chi nhánh"
                                                        value={team.branch ? `${team.branch.name}${team.branch.code ? ` (${team.branch.code})` : ''}` : 'Không có'}
                                                        icon={Building2}
                                                    />
                                                    <DetailRow
                                                        label="Trưởng nhóm"
                                                        value={team.leader ? `${team.leader.name} (${team.leader.email})` : 'Chưa phân công'}
                                                        icon={UserCircle}
                                                    />
                                                    <DetailRow
                                                        label="Trạng thái"
                                                        value={team.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                        icon={Activity}
                                                        highlight={team.isActive}
                                                    />
                                                    <DetailRow label="Ngày tạo" value={formatDate(team.createdAt)} icon={Calendar} />
                                                    <DetailRow label="Ngày cập nhật" value={formatDate(team.updatedAt)} icon={Clock} />
                                                    <DetailRow label="Tổng thành viên" value={team.members?.length || 0} icon={User} />
                                                    <DetailRow label="Tổng kênh" value={team.channels?.length || 0} icon={Youtube} />
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Average Performance Card */}
                                {stats.totalChannels > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Award className="h-5 w-5" />
                                                Hiệu suất trung bình mỗi kênh
                                            </CardTitle>
                                            <CardDescription>
                                                Trung bình trên {stats.totalChannels} kênh YouTube
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <AverageCard
                                                    icon={Eye}
                                                    title="Lượt xem/Kênh"
                                                    value={Math.round(stats.totalViews / stats.totalChannels).toLocaleString()}
                                                    color="text-emerald-600"
                                                    bgColor="bg-emerald-50 dark:bg-emerald-950"
                                                />
                                                <AverageCard
                                                    icon={Clock}
                                                    title="Thời gian xem/Kênh"
                                                    value={`${Math.round(stats.totalWatchTimeHours / stats.totalChannels)}h`}
                                                    color="text-rose-600"
                                                    bgColor="bg-rose-50 dark:bg-rose-950"
                                                />
                                                <AverageCard
                                                    icon={Users}
                                                    title="Subscribers thuần/Kênh"
                                                    value={Math.round(stats.subscribersNet / stats.totalChannels).toLocaleString()}
                                                    color="text-sky-600"
                                                    bgColor="bg-sky-50 dark:bg-sky-950"
                                                />
                                                <AverageCard
                                                    icon={Activity}
                                                    title="Tỷ lệ tương tác"
                                                    value={`${stats.engagementRate.toFixed(2)}%`}
                                                    color="text-indigo-600"
                                                    bgColor="bg-indigo-50 dark:bg-indigo-950"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs >
                    </div >
                </div >
            </div >
        </div >
    )
}

// Metric Card đã tách sang components/MetricCard (không dùng trực tiếp tại đây)

// Metric Row Component for Statistics Table
function MetricRow({
    icon: Icon,
    label,
    total,
    avg,
    prefix = '',
    highlight = false,
    variant
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    total: number
    avg: number
    prefix?: string
    highlight?: boolean
    variant?: 'success' | 'destructive'
}) {
    return (
        <TableRow className={cn(
            highlight && "bg-primary/5 font-medium",
            variant === 'success' && "bg-green-50 dark:bg-green-950",
            variant === 'destructive' && "bg-red-50 dark:bg-red-950"
        )}>
            <TableCell className="flex items-center gap-2">
                <Icon className={cn(
                    "h-4 w-4",
                    variant === 'success' && "text-green-600",
                    variant === 'destructive' && "text-red-600",
                    !variant && "text-muted-foreground"
                )} />
                {label}
            </TableCell>
            <TableCell className="text-right font-medium">
                {prefix}{Number(total).toLocaleString()}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
                {prefix}{Number(avg).toLocaleString()}
            </TableCell>
        </TableRow>
    )
}


import { DetailRow } from "./components/DetailRow"


import { AverageCard } from "./components/AverageCard"


function EmptyState({
    icon: Icon,
    title,
    description
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
}) {
    return (
        <div className="py-12 text-center">
            <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-2 font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
