// src/pages/BranchDetailPage.tsx - COMPREHENSIVE BRANCH DETAIL PAGE
import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useBranch } from "@/hooks/useBranches"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import {
    Building2, Users, Youtube, TrendingUp, MapPin, Home,
    Activity, Clock, Eye, DollarSign, Video,
    Calendar, ArrowUpRight, ArrowDownRight,
    BarChart3, PieChart, RefreshCw
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ============================================================================
// INTERFACES
// ============================================================================

interface BranchAnalytics {
    summary: {
        totalChannels: number
        totalTeams: number
        totalSubscribers: number
        totalViews: number
        totalVideos: number
    }
    analytics: {
        views: number
        watchTime: number
        estimatedRevenue: number
        subscribersGained: number
        subscribersLost?: number
        subscribersNet?: number
    }
    dailyBreakdown?: Array<{
        date: string
        views: number
        watchTime: number
        subscribersGained: number
    }>
}

interface TeamWithStats {
    _id: string
    name: string
    description?: string
    membersCount: number
    channelsCount?: number
    leader?: {
        _id: string
        name: string
        email: string
    }
    stats?: {
        totalViews: number
        totalSubscribers: number
    }
}

interface ChannelWithStats {
    _id: string
    name: string
    youtubeChannelId: string
    subscriberCount: number
    viewCount: number
    videoCount?: number
    thumbnailUrl?: string
    team?: {
        _id: string
        name: string
    }
}

// ============================================================================
// COMPONENTS
// ============================================================================

function LoadingSkeleton() {
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
                    <div className="max-w-7xl mx-auto p-6 space-y-8">
                        {/* Header Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-72" />
                            <Skeleton className="h-5 w-64" />
                        </div>

                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-24 mb-4" />
                                        <Skeleton className="h-8 w-20 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Content Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    trendValue,
    gradient,
    onClick
}: {
    icon: any
    title: string
    value: string
    subtitle?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    gradient: string
    onClick?: () => void
}) {
    return (
        <Card
            className={cn(
                "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all",
                onClick && "cursor-pointer"
            )}
            onClick={onClick}
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
            <CardContent className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                    <Icon className="h-6 w-6 opacity-80" />
                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                            {trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                            {trendValue && (
                                <span className="text-xs font-medium">{trendValue}</span>
                            )}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium opacity-90">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs opacity-75">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function TeamCard({ team, onClick }: { team: TeamWithStats; onClick: () => void }) {
    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                        </div>
                        {team.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {team.description}
                            </p>
                        )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                        {team.membersCount} members
                    </Badge>
                </div>

                <Separator className="my-3" />

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Channels</p>
                        <p className="text-lg font-bold">{team.channelsCount || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Views</p>
                        <p className="text-lg font-bold">
                            {team.stats?.totalViews ? formatNumber(team.stats.totalViews) : '0'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Subs</p>
                        <p className="text-lg font-bold">
                            {team.stats?.totalSubscribers ? formatNumber(team.stats.totalSubscribers) : '0'}
                        </p>
                    </div>
                </div>

                {team.leader && (
                    <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                    {team.leader.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Team Leader</p>
                                <p className="text-sm font-medium truncate">{team.leader.name}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function ChannelCard({ channel, onClick }: { channel: ChannelWithStats; onClick: () => void }) {
    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                        <AvatarFallback className="bg-red-100 text-red-700">
                            <Youtube className="h-6 w-6" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate mb-1">{channel.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {formatNumber(channel.subscriberCount)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(channel.viewCount)}
                            </div>
                            {channel.videoCount !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    {channel.videoCount}
                                </div>
                            )}
                        </div>
                        {channel.team && (
                            <Badge variant="outline" className="mt-2 text-xs">
                                {channel.team.name}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount)
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BranchDetailPagee() {
    const { branchId } = useParams<{ branchId: string }>()
    const navigate = useNavigate()
    const { branch, loading, error, refetch } = useBranch(branchId!)

    // State
    const [analytics, setAnalytics] = React.useState<BranchAnalytics | null>(null)
    const [teams, setTeams] = React.useState<TeamWithStats[]>([])
    const [channels, setChannels] = React.useState<ChannelWithStats[]>([])
    const [loadingAnalytics, setLoadingAnalytics] = React.useState(false)
    const [dateRange, setDateRange] = React.useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    })

    // Fetch analytics data
    const fetchAnalytics = React.useCallback(async () => {
        if (!branchId) return

        setLoadingAnalytics(true)
        try {
            const [analyticsData, teamsData, channelsData] = await Promise.all([
                apiClient.getBranchAnalytics(branchId, dateRange),
                apiClient.getTeams({ branchId }),
                apiClient.getChannelsForAnalytics({ branchId })
            ])

            setAnalytics(analyticsData)
            setTeams(teamsData.teams || teamsData.data || teamsData || [])
            setChannels(channelsData.channels || channelsData.data || channelsData || [])
        } catch (err: any) {
            console.error('Error fetching analytics:', err)
            toast.error('Failed to load analytics data')
        } finally {
            setLoadingAnalytics(false)
        }
    }, [branchId, dateRange])

    React.useEffect(() => {
        if (branchId && branch) {
            fetchAnalytics()
        }
    }, [branchId, branch, fetchAnalytics])

    // Loading state
    if (loading) {
        return <LoadingSkeleton />
    }

    // Error state
    if (error || !branch) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Branches", href: "/brand" },
                        { label: "Error", icon: <Building2 className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar branchId={branchId} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-7xl mx-auto p-6">
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {error || "Branch not found"}
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Calculate totals
    const totalStats = {
        teams: teams.length,
        channels: channels.length,
        members: teams.reduce((sum, team) => sum + team.membersCount, 0),
        subscribers: analytics?.summary?.totalSubscribers ||
            channels.reduce((sum, ch) => sum + ch.subscriberCount, 0),
        views: analytics?.summary?.totalViews ||
            channels.reduce((sum, ch) => sum + ch.viewCount, 0),
        videos: analytics?.summary?.totalVideos ||
            channels.reduce((sum, ch) => sum + (ch.videoCount || 0), 0)
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Branches", href: "/brand" },
                    { label: branch.name, icon: <Building2 className="h-4 w-4" /> },
                ]}
            />

            {/* Layout: Channel Sidebar + Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Channel Sidebar */}
                <ChannelSidebar branchId={branchId} side="left" mode="inline" />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 space-y-8">
                        {/* Branch Header Card */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 via-primary/3 to-background">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Building2 className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-3xl font-bold">
                                                    {branch.name}
                                                </CardTitle>
                                                {branch.code && (
                                                    <Badge variant="secondary" className="mt-1">
                                                        {branch.code}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {branch.description && (
                                            <CardDescription className="text-base">
                                                {branch.description}
                                            </CardDescription>
                                        )}
                                        {branch.location && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                {branch.location}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchAnalytics()}
                                            disabled={loadingAnalytics}
                                        >
                                            <RefreshCw className={cn(
                                                "h-4 w-4 mr-2",
                                                loadingAnalytics && "animate-spin"
                                            )} />
                                            Refresh
                                        </Button>
                                        <Badge
                                            variant={branch.isActive ? "default" : "secondary"}
                                            className="px-3 py-1"
                                        >
                                            {branch.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Users}
                                title="Total Teams"
                                value={totalStats.teams.toString()}
                                subtitle={`${totalStats.members} total members`}
                                gradient="from-blue-500 to-indigo-600"
                                onClick={() => document.getElementById('teams-section')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                            <MetricCard
                                icon={Youtube}
                                title="Total Channels"
                                value={totalStats.channels.toString()}
                                subtitle={`${formatNumber(totalStats.subscribers)} subscribers`}
                                gradient="from-red-500 to-rose-600"
                                onClick={() => document.getElementById('channels-section')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                            <MetricCard
                                icon={Eye}
                                title="Total Views"
                                value={formatNumber(totalStats.views)}
                                subtitle={`${totalStats.videos} videos`}
                                gradient="from-emerald-500 to-teal-600"
                            />
                            <MetricCard
                                icon={TrendingUp}
                                title="Performance"
                                value={analytics ? formatNumber(analytics.analytics.views) : '0'}
                                subtitle={`Last ${Math.floor((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`}
                                gradient="from-amber-500 to-orange-600"
                                onClick={() => document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                        </div>

                        {/* Tabs Content */}
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList className="inline-flex h-auto w-full items-center justify-center rounded-lg bg-muted p-1 gap-1">
                                <TabsTrigger
                                    value="overview"
                                    className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <Activity className="h-4 w-4 mr-2" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="teams"
                                    className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Teams ({totalStats.teams})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="channels"
                                    className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <Youtube className="h-4 w-4 mr-2" />
                                    Channels ({totalStats.channels})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="analytics"
                                    className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Analytics
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <PieChart className="h-5 w-5" />
                                            Branch Overview
                                        </CardTitle>
                                        <CardDescription>
                                            Complete summary of {branch.name}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead className="font-semibold">Metric</TableHead>
                                                        <TableHead className="font-semibold text-right">Value</TableHead>
                                                        <TableHead className="font-semibold">Details</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-blue-600" />
                                                            Teams
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {totalStats.teams}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {totalStats.members} members across all teams
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Youtube className="h-4 w-4 text-red-600" />
                                                            Channels
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {totalStats.channels}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            Active YouTube channels
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="flex items-center gap-2">
                                                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                                                            Subscribers
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {formatNumber(totalStats.subscribers)}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            Total across all channels
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4 text-amber-600" />
                                                            Views
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {formatNumber(totalStats.views)}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            Total video views
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Video className="h-4 w-4 text-purple-600" />
                                                            Videos
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {totalStats.videos}
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            Published videos
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Teams Tab */}
                            <TabsContent value="teams" className="space-y-6" id="teams-section">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Teams in {branch.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {totalStats.teams} teams with {totalStats.members} total members
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {teams.length > 0 ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {teams.map((team) => (
                                                    <TeamCard
                                                        key={team._id}
                                                        team={team}
                                                        onClick={() => navigate(`/teams/${team._id}`)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                                                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                                <p className="text-muted-foreground">No teams found in this branch</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Channels Tab */}
                            <TabsContent value="channels" className="space-y-6" id="channels-section">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Youtube className="h-5 w-5" />
                                            Channels in {branch.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {totalStats.channels} channels with {formatNumber(totalStats.subscribers)} subscribers
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100">
                                            <div className="flex items-start gap-3">
                                                <Youtube className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium mb-1">Channels in Sidebar</p>
                                                    <p className="text-sm">
                                                        All channels for this branch are displayed in the left sidebar.
                                                        Click on any channel to view detailed information including stats,
                                                        analytics, team assignment, and recent videos.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {channels.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {channels.map((channel) => (
                                                    <ChannelCard
                                                        key={channel._id}
                                                        channel={channel}
                                                        onClick={() => navigate(`/channels/${channel._id}`)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                                                <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                                <p className="text-muted-foreground">No channels found in this branch</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Analytics Tab */}
                            <TabsContent value="analytics" className="space-y-6" id="analytics-section">
                                {loadingAnalytics ? (
                                    <Card>
                                        <CardContent className="p-12">
                                            <div className="flex flex-col items-center gap-4">
                                                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                                                <p className="text-muted-foreground">Loading analytics...</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : analytics ? (
                                    <>
                                        {/* Performance Metrics */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <BarChart3 className="h-5 w-5" />
                                                    Performance Metrics
                                                </CardTitle>
                                                <CardDescription>
                                                    Analytics for {branch.name} from {dateRange.startDate} to {dateRange.endDate}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <Card className="border-2">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950">
                                                                    <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
                                                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                                {formatNumber(analytics.analytics.views)}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="border-2">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
                                                                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-1">Watch Time</p>
                                                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                                                {formatDuration(analytics.analytics.watchTime)}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="border-2">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                                                                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-1">Subscribers Gained</p>
                                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                                +{formatNumber(analytics.analytics.subscribersGained)}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="border-2">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                                                                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-1">Est. Revenue</p>
                                                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                                {formatCurrency(analytics.analytics.estimatedRevenue)}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Summary Statistics */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Summary Statistics</CardTitle>
                                                <CardDescription>
                                                    Overall branch performance
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/50">
                                                                <TableHead className="font-semibold">Metric</TableHead>
                                                                <TableHead className="font-semibold text-right">Total</TableHead>
                                                                <TableHead className="font-semibold text-right">Avg/Channel</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="flex items-center gap-2">
                                                                    <Youtube className="h-4 w-4 text-muted-foreground" />
                                                                    Channels
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {analytics.summary.totalChannels}
                                                                </TableCell>
                                                                <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="flex items-center gap-2">
                                                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                                    Subscribers
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {formatNumber(analytics.summary.totalSubscribers)}
                                                                </TableCell>
                                                                <TableCell className="text-right text-muted-foreground">
                                                                    {analytics.summary.totalChannels > 0
                                                                        ? formatNumber(Math.round(analytics.summary.totalSubscribers / analytics.summary.totalChannels))
                                                                        : '0'}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="flex items-center gap-2">
                                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                                    Views
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {formatNumber(analytics.summary.totalViews)}
                                                                </TableCell>
                                                                <TableCell className="text-right text-muted-foreground">
                                                                    {analytics.summary.totalChannels > 0
                                                                        ? formatNumber(Math.round(analytics.summary.totalViews / analytics.summary.totalChannels))
                                                                        : '0'}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="flex items-center gap-2">
                                                                    <Video className="h-4 w-4 text-muted-foreground" />
                                                                    Videos
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {analytics.summary.totalVideos}
                                                                </TableCell>
                                                                <TableCell className="text-right text-muted-foreground">
                                                                    {analytics.summary.totalChannels > 0
                                                                        ? Math.round(analytics.summary.totalVideos / analytics.summary.totalChannels)
                                                                        : '0'}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : (
                                    <Card>
                                        <CardContent className="p-12">
                                            <div className="text-center">
                                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                                <p className="text-muted-foreground mb-4">No analytics data available</p>
                                                <Button onClick={fetchAnalytics} variant="outline">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Load Analytics
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
