import { useEffect, useState } from "react"
import {
    Users, Eye, Clock, TrendingUp, TrendingDown, DollarSign, Video,
    ThumbsUp, ThumbsDown, MessageSquare, Share2, UserPlus, UserMinus,
    PlayCircle, Calendar, Target, MousePointer, BarChart3, PieChart,
    Activity, Zap, Globe, Monitor, Smartphone, Tablet, Percent,
    ArrowUpRight, ArrowDownRight, TrendingDownIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/pages/examples/analytics/components/site-header"
import axios from "axios"

interface Channel {
    _id: string
    name: string
    channelId: string
    thumbnail?: string
}

interface AnalyticsData {
    success: boolean
    dateRange: {
        startDate: string
        endDate: string
    }
    totals: {
        totalViews: number
        totalWatchTimeMinutes: number
        totalWatchTimeHours: string
        totalSubscribersGained: number
        totalSubscribersLost: number
        totalSubscribersNet: number
        totalLikes?: number
        totalDislikes?: number
        totalComments?: number
        totalShares?: number
        estimatedRevenue?: number
        estimatedAdRevenue?: number
        estimatedRedPartnerRevenue?: number
        cpm?: number
        rpm?: number
        playbackBasedCpm?: number
        grossRevenue?: number
        monetizedPlaybacks?: number
        adImpressions?: number
        ctr?: number
        averageViewPercentage?: number
        annotationClickThroughRate?: number
        annotationCloseRate?: number
        cardClickRate?: number
        cardTeaserClickRate?: number
    }
    dailyData: Array<{
        date: string
        views: number
        watchTimeMinutes: number
        watchTimeHours: string
        averageViewDuration: number
        averageViewPercentage?: number
        subscribersGained: number
        subscribersLost: number
        subscribersNet: number
        likes?: number
        dislikes?: number
        comments?: number
        shares?: number
        estimatedRevenue?: number
        impressions?: number
        impressionCtr?: number
        cardClicks?: number
        cardClickRate?: number
    }>
    // Additional metrics từ YouTube Analytics API
    trafficSources?: Array<{
        sourceType: string
        views: number
        percentage: number
    }>
    deviceTypes?: Array<{
        deviceType: string
        views: number
        percentage: number
    }>
    demographics?: {
        ageGroups?: Array<{
            ageGroup: string
            viewsPercentage: number
        }>
        gender?: {
            male: number
            female: number
        }
    }
    topCountries?: Array<{
        country: string
        views: number
        watchTimeMinutes: number
    }>
    topVideos?: Array<{
        videoId: string
        title: string
        views: number
        watchTimeMinutes: number
        likes: number
        comments: number
        shares: number
        averageViewDuration: number
        ctr: number
    }>
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
}

const formatVND = (num: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(num)
}

const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatPercent = (num: number): string => {
    return num.toFixed(2) + '%'
}

export default function DetailedAnalytics() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<string>("")
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(false)
    const [channelsLoading, setChannelsLoading] = useState(true)
    const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days'>('30days')
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        fetchChannels()
    }, [])

    useEffect(() => {
        if (selectedChannel) {
            fetchAnalytics()
        }
    }, [selectedChannel, dateRange])

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) return

            const response = await axios.get<{ success: boolean; data: Channel[] }>(
                'http://localhost:3000/api/channels/my-channels',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )

            if (response.data.success && response.data.data.length > 0) {
                setChannels(response.data.data)
                setSelectedChannel(response.data.data[0]._id)
            }
        } catch (error) {
            console.error('Error fetching channels:', error)
        } finally {
            setChannelsLoading(false)
        }
    }

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('authToken')
            if (!token) return

            const endDate = new Date()
            const startDate = new Date()

            switch (dateRange) {
                case '7days':
                    startDate.setDate(endDate.getDate() - 7)
                    break
                case '30days':
                    startDate.setDate(endDate.getDate() - 30)
                    break
                case '90days':
                    startDate.setDate(endDate.getDate() - 90)
                    break
            }

            const formatDate = (date: Date) => date.toISOString().split('T')[0]

            const response = await axios.get<AnalyticsData>(
                'http://localhost:3000/api/youtube/analytics',
                {
                    params: {
                        channelId: selectedChannel,
                        startDate: formatDate(startDate),
                        endDate: formatDate(endDate)
                    },
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            )

            if (response.data.success) {
                setAnalytics(response.data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculated metrics
    const calculateEngagementRate = () => {
        if (!analytics?.totals) return 0
        const { totalViews, totalLikes, totalComments, totalShares } = analytics.totals
        if (!totalViews) return 0
        return ((totalLikes || 0) + (totalComments || 0) + (totalShares || 0)) / totalViews * 100
    }

    const calculateAvgViewDuration = () => {
        if (!analytics?.totals) return 0
        const { totalWatchTimeMinutes, totalViews } = analytics.totals
        if (!totalViews) return 0
        return (totalWatchTimeMinutes * 60) / totalViews
    }

    const calculateRetentionRate = () => {
        return analytics?.totals.averageViewPercentage || 0
    }

    const likeDislikeRatio = () => {
        if (!analytics?.totals) return 0
        const { totalLikes, totalDislikes } = analytics.totals
        if (!totalLikes || !totalDislikes) return 0
        return (totalLikes / (totalLikes + totalDislikes)) * 100
    }

    const estimatedRevenue = analytics?.totals.estimatedRevenue ||
        (analytics?.totals.rpm ? (analytics.totals.totalViews / 1000) * analytics.totals.rpm * 25000 : 0)

    const cpm = analytics?.totals.cpm || analytics?.totals.playbackBasedCpm || 5.0
    const rpm = analytics?.totals.rpm || 0
    const ctr = analytics?.totals.ctr || 0

    // Overview Stats Cards
    const overviewCards = [
        {
            label: "Lượt xem",
            value: analytics?.totals.totalViews || 0,
            formatted: formatNumber(analytics?.totals.totalViews || 0),
            icon: Eye,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            change: "+12.5%", // Would calculate from previous period
            changePositive: true
        },
        {
            label: "Giờ xem",
            value: parseFloat(analytics?.totals.totalWatchTimeHours || '0'),
            formatted: analytics?.totals.totalWatchTimeHours || '0',
            icon: Clock,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            subtitle: `${formatNumber(analytics?.totals.totalWatchTimeMinutes || 0)} phút`,
            change: "+8.3%",
            changePositive: true
        },
        {
            label: "Người đăng ký (Net)",
            value: analytics?.totals.totalSubscribersNet || 0,
            formatted: (analytics?.totals.totalSubscribersNet || 0) >= 0
                ? `+${formatNumber(analytics?.totals.totalSubscribersNet || 0)}`
                : formatNumber(analytics?.totals.totalSubscribersNet || 0),
            icon: Users,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            subtitle: `+${formatNumber(analytics?.totals.totalSubscribersGained || 0)} / -${formatNumber(analytics?.totals.totalSubscribersLost || 0)}`,
            change: "+15.7%",
            changePositive: true
        },
        {
            label: "Thời lượng TB",
            value: calculateAvgViewDuration(),
            formatted: formatDuration(Math.floor(calculateAvgViewDuration())),
            icon: PlayCircle,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            subtitle: "Mỗi lượt xem",
            change: "+5.2%",
            changePositive: true
        },
    ]

    // Engagement Cards
    const engagementCards = [
        {
            label: "Engagement Rate",
            value: calculateEngagementRate(),
            formatted: formatPercent(calculateEngagementRate()),
            icon: ThumbsUp,
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600",
            progress: Math.min(calculateEngagementRate() * 10, 100)
        },
        {
            label: "Likes",
            value: analytics?.totals.totalLikes || 0,
            formatted: formatNumber(analytics?.totals.totalLikes || 0),
            icon: ThumbsUp,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            progress: analytics?.totals.totalViews ? Math.min((analytics.totals.totalLikes || 0) / analytics.totals.totalViews * 1000, 100) : 0
        },
        {
            label: "Comments",
            value: analytics?.totals.totalComments || 0,
            formatted: formatNumber(analytics?.totals.totalComments || 0),
            icon: MessageSquare,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            progress: analytics?.totals.totalViews ? Math.min((analytics.totals.totalComments || 0) / analytics.totals.totalViews * 1000, 100) : 0
        },
        {
            label: "Shares",
            value: analytics?.totals.totalShares || 0,
            formatted: formatNumber(analytics?.totals.totalShares || 0),
            icon: Share2,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            progress: analytics?.totals.totalViews ? Math.min((analytics.totals.totalShares || 0) / analytics.totals.totalViews * 1000, 100) : 0
        },
        {
            label: "Like/Dislike Ratio",
            value: likeDislikeRatio(),
            formatted: formatPercent(likeDislikeRatio()),
            icon: Activity,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            progress: likeDislikeRatio()
        },
        {
            label: "Retention Rate",
            value: calculateRetentionRate(),
            formatted: formatPercent(calculateRetentionRate()),
            icon: Target,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            progress: calculateRetentionRate()
        },
    ]

    // Revenue Cards
    const revenueCards = [
        {
            label: "Estimated Revenue",
            value: estimatedRevenue,
            formatted: formatVND(estimatedRevenue),
            icon: DollarSign,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            subtitle: `${dateRange === '7days' ? '7' : dateRange === '30days' ? '30' : '90'} ngày`,
            large: true
        },
        {
            label: "Ad Revenue",
            value: analytics?.totals.estimatedAdRevenue || 0,
            formatted: formatVND((analytics?.totals.estimatedAdRevenue || 0) * 25000),
            icon: DollarSign,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            subtitle: "Từ quảng cáo"
        },
        {
            label: "RPM",
            value: rpm,
            formatted: `$${rpm.toFixed(2)}`,
            icon: TrendingUp,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            subtitle: "Revenue/1000 views"
        },
        {
            label: "CPM",
            value: cpm,
            formatted: `$${cpm.toFixed(2)}`,
            icon: BarChart3,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            subtitle: "Cost/1000 impressions"
        },
        {
            label: "Monetized Playbacks",
            value: analytics?.totals.monetizedPlaybacks || 0,
            formatted: formatNumber(analytics?.totals.monetizedPlaybacks || 0),
            icon: PlayCircle,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            subtitle: "Lượt xem có quảng cáo"
        },
        {
            label: "Ad Impressions",
            value: analytics?.totals.adImpressions || 0,
            formatted: formatNumber(analytics?.totals.adImpressions || 0),
            icon: Eye,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            subtitle: "Lần hiển thị quảng cáo"
        },
    ]

    // Audience Cards
    const audienceCards = [
        {
            label: "CTR (Click-through Rate)",
            value: ctr,
            formatted: formatPercent(ctr),
            icon: MousePointer,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            progress: ctr * 10,
            subtitle: "Tỷ lệ click vào video"
        },
        {
            label: "Average View %",
            value: analytics?.totals.averageViewPercentage || 0,
            formatted: formatPercent(analytics?.totals.averageViewPercentage || 0),
            icon: Percent,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            progress: analytics?.totals.averageViewPercentage || 0,
            subtitle: "% video được xem"
        },
        {
            label: "Card Click Rate",
            value: analytics?.totals.cardClickRate || 0,
            formatted: formatPercent(analytics?.totals.cardClickRate || 0),
            icon: MousePointer,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            progress: (analytics?.totals.cardClickRate || 0) * 10,
            subtitle: "Clicks on cards"
        },
        {
            label: "Annotation CTR",
            value: analytics?.totals.annotationClickThroughRate || 0,
            formatted: formatPercent(analytics?.totals.annotationClickThroughRate || 0),
            icon: Target,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            progress: (analytics?.totals.annotationClickThroughRate || 0) * 10,
            subtitle: "Annotation clicks"
        },
    ]

    // Top Videos
    const topVideos = analytics?.topVideos?.slice(0, 10) ||
        analytics?.dailyData?.sort((a, b) => b.views - a.views).slice(0, 10).map((day, index) => ({
            videoId: day.date,
            title: new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
            views: day.views,
            watchTimeMinutes: day.watchTimeMinutes,
            likes: day.likes || 0,
            comments: day.comments || 0,
            shares: day.shares || 0,
            averageViewDuration: day.averageViewDuration,
            ctr: day.impressionCtr || 0
        })) || []

    // Traffic Sources (mock if not from API)
    const trafficSources = analytics?.trafficSources || [
        { sourceType: "YouTube Search", views: Math.floor((analytics?.totals.totalViews || 0) * 0.35), percentage: 35 },
        { sourceType: "Suggested Videos", views: Math.floor((analytics?.totals.totalViews || 0) * 0.25), percentage: 25 },
        { sourceType: "External", views: Math.floor((analytics?.totals.totalViews || 0) * 0.15), percentage: 15 },
        { sourceType: "Direct/Unknown", views: Math.floor((analytics?.totals.totalViews || 0) * 0.12), percentage: 12 },
        { sourceType: "Channel Pages", views: Math.floor((analytics?.totals.totalViews || 0) * 0.08), percentage: 8 },
        { sourceType: "Others", views: Math.floor((analytics?.totals.totalViews || 0) * 0.05), percentage: 5 },
    ]

    // Device Types (mock if not from API)
    const deviceTypes = analytics?.deviceTypes || [
        { deviceType: "Mobile", views: Math.floor((analytics?.totals.totalViews || 0) * 0.60), percentage: 60 },
        { deviceType: "Computer", views: Math.floor((analytics?.totals.totalViews || 0) * 0.30), percentage: 30 },
        { deviceType: "Tablet", views: Math.floor((analytics?.totals.totalViews || 0) * 0.07), percentage: 7 },
        { deviceType: "TV", views: Math.floor((analytics?.totals.totalViews || 0) * 0.03), percentage: 3 },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader />

            {/* Header Controls */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 p-4 px-6">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Chọn kênh:
                        </label>
                        {channelsLoading ? (
                            <Skeleton className="h-10 w-full md:w-[400px]" />
                        ) : (
                            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                                <SelectTrigger className="w-full md:w-[400px]">
                                    <SelectValue placeholder="Chọn kênh" />
                                </SelectTrigger>
                                <SelectContent>
                                    {channels.map(channel => (
                                        <SelectItem key={channel._id} value={channel._id}>
                                            {channel.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Khoảng thời gian:
                        </label>
                        <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                            <SelectTrigger className="w-full md:w-[250px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">7 ngày qua</SelectItem>
                                <SelectItem value="30days">30 ngày qua</SelectItem>
                                <SelectItem value="90days">90 ngày qua</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button onClick={fetchAnalytics} disabled={loading || !selectedChannel}>
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </Button>
                    </div>
                </div>

                {analytics && (
                    <div className="px-6 pb-4">
                        <Badge variant="outline" className="flex items-center gap-2 w-fit">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {new Date(analytics.dateRange.startDate).toLocaleDateString('vi-VN')} - {new Date(analytics.dateRange.endDate).toLocaleDateString('vi-VN')}
                            </span>
                        </Badge>
                    </div>
                )}
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pt-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-5">
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="engagement">Tương tác</TabsTrigger>
                    <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                    <TabsTrigger value="audience">Khán giả</TabsTrigger>
                    <TabsTrigger value="content">Nội dung</TabsTrigger>
                </TabsList>

                {/* Tab: Overview */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-24" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            overviewCards.map((stat, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                            </div>
                                            {stat.change && (
                                                <Badge variant={stat.changePositive ? "default" : "destructive"} className="text-xs">
                                                    {stat.changePositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                                    {stat.change}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stat.formatted}
                                        </div>
                                        {stat.subtitle && (
                                            <div className="text-xs text-gray-500 mt-2">{stat.subtitle}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Subscriber Growth Detail */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-purple-600" />
                                Subscriber Growth
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserPlus className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-700">Gained</span>
                                        </div>
                                        <div className="text-3xl font-bold text-green-900">
                                            +{formatNumber(analytics?.totals.totalSubscribersGained || 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-red-50 border-red-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserMinus className="h-4 w-4 text-red-600" />
                                            <span className="text-sm text-red-700">Lost</span>
                                        </div>
                                        <div className="text-3xl font-bold text-red-900">
                                            -{formatNumber(analytics?.totals.totalSubscribersLost || 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm text-blue-700">Net Change</span>
                                        </div>
                                        <div className={`text-3xl font-bold ${(analytics?.totals.totalSubscribersNet || 0) >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                                            {(analytics?.totals.totalSubscribersNet || 0) >= 0 ? '+' : ''}
                                            {formatNumber(analytics?.totals.totalSubscribersNet || 0)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Engagement */}
                <TabsContent value="engagement" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-24" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            engagementCards.map((stat, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                            </div>
                                            <span className="text-sm text-gray-600">{stat.label}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-3">
                                            {stat.formatted}
                                        </div>
                                        <Progress
                                            value={stat.progress}
                                            className="h-2"
                                        />
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Tab: Revenue */}
                <TabsContent value="revenue" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-24" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            revenueCards.map((stat, index) => (
                                <Card key={index} className={`hover:shadow-lg transition-shadow ${stat.large ? 'md:col-span-2 lg:col-span-3' : ''} ${stat.large ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : ''}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`${stat.large ? 'bg-white/20' : stat.iconBg} p-2 rounded-lg`}>
                                                <stat.icon className={`w-5 h-5 ${stat.large ? 'text-white' : stat.iconColor}`} />
                                            </div>
                                            <span className={`text-sm ${stat.large ? 'text-white/90' : 'text-gray-600'}`}>{stat.label}</span>
                                        </div>
                                        <div className={`${stat.large ? 'text-4xl' : 'text-2xl'} font-bold ${stat.large ? 'text-white' : 'text-gray-900'} mb-2`}>
                                            {stat.formatted}
                                        </div>
                                        {stat.subtitle && (
                                            <div className={`text-xs ${stat.large ? 'text-white/70' : 'text-gray-500'}`}>{stat.subtitle}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Tab: Audience */}
                <TabsContent value="audience" className="space-y-6 mt-6">
                    {/* Audience Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-24" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            audienceCards.map((stat, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                                        <div className="text-2xl font-bold text-gray-900 mb-3">
                                            {stat.formatted}
                                        </div>
                                        <Progress value={stat.progress} className="h-2" />
                                        {stat.subtitle && (
                                            <div className="text-xs text-gray-500 mt-2">{stat.subtitle}</div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Traffic Sources & Device Types */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Traffic Sources */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                    Traffic Sources
                                </CardTitle>
                                <CardDescription>Nguồn lưu lượng truy cập</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {trafficSources.map((source, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">{source.sourceType}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900">{formatNumber(source.views)}</span>
                                                    <Badge variant="secondary" className="text-xs">{source.percentage}%</Badge>
                                                </div>
                                            </div>
                                            <Progress value={source.percentage} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Device Types */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Monitor className="h-5 w-5 text-green-600" />
                                    Device Types
                                </CardTitle>
                                <CardDescription>Loại thiết bị xem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {deviceTypes.map((device, index) => {
                                        const icons = {
                                            'Mobile': Smartphone,
                                            'Computer': Monitor,
                                            'Tablet': Tablet,
                                            'TV': Monitor
                                        }
                                        const Icon = icons[device.deviceType as keyof typeof icons] || Monitor

                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4 text-gray-600" />
                                                        <span className="text-sm text-gray-600">{device.deviceType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-900">{formatNumber(device.views)}</span>
                                                        <Badge variant="secondary" className="text-xs">{device.percentage}%</Badge>
                                                    </div>
                                                </div>
                                                <Progress value={device.percentage} className="h-2" />
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Content */}
                <TabsContent value="content" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-red-600" />
                                Top Performing Days/Videos
                            </CardTitle>
                            <CardDescription>Các ngày có hiệu suất tốt nhất</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topVideos.map((video, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                            index === 1 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                                                index === 2 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                                    'bg-gradient-to-br from-blue-500 to-blue-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{video.title}</h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {formatNumber(video.views)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatNumber(video.watchTimeMinutes)} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    {formatNumber(video.likes)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    {formatNumber(video.comments)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatDuration(video.averageViewDuration)}
                                            </div>
                                            <div className="text-xs text-gray-500">Avg Duration</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
