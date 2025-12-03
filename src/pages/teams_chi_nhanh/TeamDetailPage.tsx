// src/pages/TeamDetailPage.tsx - REDESIGNED WITH FULL DATA AND BEAUTIFUL UI
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
    Building2,
    UserCircle,
    Video,
    BarChart3
} from "lucide-react"
import { teamsAPI } from "@/lib/teams-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
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

export default function TeamDetailPage() {
    const { teamId } = useParams()
    const [team, setTeam] = React.useState<TeamData | null>(null)
    const [overview, setOverview] = React.useState<OverviewData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [overviewLoading, setOverviewLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            if (!teamId) return

            try {
                setLoading(true)
                setOverviewLoading(true)

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
                } finally {
                    setOverviewLoading(false)
                }
            } catch (error) {
                console.error('❌ Error fetching team:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [teamId])

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
                        { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Teams", href: "/teams" },
                        { label: "Error", icon: <Users className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar teamId={teamId} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="text-center text-muted-foreground">Team not found</div>
                    </div>
                </div>
            </div>
        )
    }

    // Calculate statistics from both API data and local data
    const channels = team?.channels || []
    const stats = {
        totalMembers: overview?.statistics?.totalMembers ?? (team?.members?.length || 0),
        totalChannels: overview?.statistics?.totalChannels ?? channels.length,
        totalVideos: overview?.statistics?.totalVideos ?? (channels.reduce((sum, ch) => sum + (ch.videoCount || 0), 0)),
        totalSubscribers: overview?.statistics?.totalSubscribers ?? (channels.reduce((sum, ch) => sum + (ch.subscriberCount || 0), 0)),
        totalViews: overview?.statistics?.totalViews ?? (channels.reduce((sum, ch) => sum + (ch.viewCount || 0), 0)),
        totalWatchTimeHours: overview?.statistics?.totalWatchTimeHours ?? 0,
        totalWatchTimeMinutes: overview?.statistics?.totalWatchTimeMinutes ?? 0,
        averageViewDuration: overview?.statistics?.averageViewDuration ?? 0,
        totalLikes: overview?.statistics?.totalLikes ?? 0,
        totalComments: overview?.statistics?.totalComments ?? 0,
        totalShares: overview?.statistics?.totalShares ?? 0,
        engagementRate: overview?.statistics?.engagementRate ?? 0,
        subscribersGained: overview?.statistics?.subscribersGained ?? 0,
        subscribersLost: overview?.statistics?.subscribersLost ?? 0,
        subscribersNet: overview?.statistics?.subscribersNet ?? ((overview?.statistics?.subscribersGained ?? 0) - (overview?.statistics?.subscribersLost ?? 0))
    }

    const hasWatchTime = (stats.totalWatchTimeHours || stats.totalWatchTimeMinutes || stats.averageViewDuration)
    const hasEngagement = (stats.totalLikes || stats.totalComments || stats.totalShares || stats.engagementRate)

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
            {/* Header with breadcrumb */}
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
                        {/* Header Card with Team Info */}
                        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 via-primary/3 to-background">
                            <CardHeader className="space-y-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-3">
                                        <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                            <Users className="h-8 w-8 text-primary" />
                                            {team.name}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            {team.description || 'No description provided'}
                                        </CardDescription>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {team.branch && (
                                                <Badge variant="secondary" className="px-3 py-1.5">
                                                    <Building2 className="h-4 w-4 mr-2" />
                                                    {team.branch.name}
                                                    {team.branch.code && ` (${team.branch.code})`}
                                                </Badge>
                                            )}
                                            {team.isActive !== undefined && (
                                                <Badge
                                                    variant={team.isActive ? "default" : "secondary"}
                                                    className="px-3 py-1.5"
                                                >
                                                    <Activity className="h-4 w-4 mr-2" />
                                                    {team.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            )}
                                            {team.createdAt && (
                                                <Badge variant="outline" className="px-3 py-1.5">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Created: {formatDate(team.createdAt)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {team.leader && (
                                        <Card className="min-w-[280px]">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Award className="h-4 w-4" />
                                                    Team Leader
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                                                            {team.leader.name?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-base truncate">{team.leader.name}</p>
                                                        <p className="text-sm text-muted-foreground truncate">{team.leader.email}</p>
                                                        <Badge variant="outline" className="mt-1 text-xs">
                                                            {team.leader.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Statistics Overview - Main Metrics */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                    Team Statistics Overview
                                </CardTitle>
                                <CardDescription>
                                    Tổng hợp số liệu từ {stats.totalChannels} kênh YouTube
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {overviewLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <Card key={i}>
                                                <CardContent className="p-6">
                                                    <Skeleton className="h-4 w-20 mb-2" />
                                                    <Skeleton className="h-8 w-16 mb-1" />
                                                    <Skeleton className="h-3 w-24" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Tabs defaultValue="overview" className="space-y-4">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                                            {hasEngagement ? (
                                                <TabsTrigger value="engagement">Tương Tác</TabsTrigger>
                                            ) : null}
                                            <TabsTrigger value="performance">Hiệu Suất</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <MetricCard
                                                    icon={Eye}
                                                    title="Tổng Lượt Xem"
                                                    value={stats.totalViews.toLocaleString()}
                                                    subtitle={stats.totalChannels ? `~${Math.round(stats.totalViews / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                    gradient="from-emerald-500 to-teal-600"
                                                />
                                                {hasWatchTime ? (
                                                    <MetricCard
                                                        icon={Clock}
                                                        title="Thời Gian Xem"
                                                        value={`${stats.totalWatchTimeHours.toLocaleString()}h`}
                                                        subtitle={`${Math.round(stats.totalWatchTimeMinutes).toLocaleString()} phút`}
                                                        gradient="from-amber-500 to-orange-600"
                                                    />
                                                ) : null}
                                                <MetricCard
                                                    icon={Users}
                                                    title="Subscribers Thuần"
                                                    value={`${stats.subscribersNet >= 0 ? '+' : ''}${stats.subscribersNet.toLocaleString()}`}
                                                    subtitle={`+${stats.subscribersGained.toLocaleString()} / -${stats.subscribersLost.toLocaleString()}`}
                                                    gradient="from-pink-500 to-rose-600"
                                                    trend={stats.subscribersNet >= 0 ? 'up' : 'down'}
                                                />
                                                {stats.averageViewDuration ? (
                                                    <MetricCard
                                                        icon={Activity}
                                                        title="Thời Lượng TB"
                                                        value={`${Math.round(stats.averageViewDuration)}s`}
                                                        subtitle={`${Math.round(stats.averageViewDuration / 60 * 10) / 10} phút`}
                                                        gradient="from-sky-500 to-cyan-600"
                                                    />
                                                ) : null}
                                            </div>
                                        </TabsContent>

                                        {hasEngagement ? (
                                            <TabsContent value="engagement" className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <MetricCard
                                                        icon={ThumbsUp}
                                                        title="Tổng Likes"
                                                        value={stats.totalLikes.toLocaleString()}
                                                        subtitle={stats.totalChannels ? `~${Math.round(stats.totalLikes / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                        gradient="from-green-500 to-emerald-600"
                                                    />
                                                    <MetricCard
                                                        icon={MessageSquare}
                                                        title="Tổng Comments"
                                                        value={stats.totalComments.toLocaleString()}
                                                        subtitle={stats.totalChannels ? `~${Math.round(stats.totalComments / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                        gradient="from-amber-500 to-orange-600"
                                                    />
                                                    <MetricCard
                                                        icon={Share2}
                                                        title="Tổng Shares"
                                                        value={stats.totalShares.toLocaleString()}
                                                        subtitle={stats.totalChannels ? `~${Math.round(stats.totalShares / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                        gradient="from-pink-500 to-rose-600"
                                                    />
                                                    <MetricCard
                                                        icon={Activity}
                                                        title="Engagement Rate"
                                                        value={`${stats.engagementRate.toFixed(2)}%`}
                                                        subtitle="Tỷ lệ tương tác"
                                                        gradient="from-blue-500 to-indigo-600"
                                                    />
                                                </div>
                                            </TabsContent>
                                        ) : null}

                                        <TabsContent value="performance" className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <MetricCard
                                                    icon={User}
                                                    title="Thành Viên"
                                                    value={stats.totalMembers.toLocaleString()}
                                                    subtitle="Team members"
                                                    gradient="from-blue-500 to-indigo-600"
                                                />
                                                <MetricCard
                                                    icon={Youtube}
                                                    title="Kênh YouTube"
                                                    value={stats.totalChannels.toLocaleString()}
                                                    subtitle="Active channels"
                                                    gradient="from-red-500 to-pink-600"
                                                />
                                                <MetricCard
                                                    icon={Video}
                                                    title="Tổng Videos"
                                                    value={stats.totalVideos.toLocaleString()}
                                                    subtitle={stats.totalChannels ? `~${Math.round(stats.totalVideos / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                    gradient="from-purple-500 to-violet-600"
                                                />
                                                <MetricCard
                                                    icon={Users}
                                                    title="Total Subscribers"
                                                    value={stats.totalSubscribers.toLocaleString()}
                                                    subtitle={stats.totalChannels ? `~${Math.round(stats.totalSubscribers / stats.totalChannels).toLocaleString()}/kênh` : undefined}
                                                    gradient="from-emerald-500 to-teal-600"
                                                />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tabs for detailed information */}
                        <Tabs defaultValue="members" className="space-y-6">
                            <TabsList className="inline-flex h-auto w-full items-center justify-start rounded-lg bg-muted p-1 gap-1">
                                <TabsTrigger
                                    value="members"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Members ({team.members?.length || 0})
                                </TabsTrigger>

                                <TabsTrigger
                                    value="channels"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <Youtube className="h-4 w-4 mr-2" />
                                    Channels ({team.channels?.length || 0})
                                </TabsTrigger>

                                {overview?.channelAssignments && overview.channelAssignments.length > 0 && (
                                    <TabsTrigger
                                        value="assignments"
                                        className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                    >
                                        <UserCircle className="h-4 w-4 mr-2" />
                                        Assignments
                                    </TabsTrigger>
                                )}

                                {overview?.recentVideos && overview.recentVideos.length > 0 && (
                                    <TabsTrigger
                                        value="videos"
                                        className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                    >
                                        <Video className="h-4 w-4 mr-2" />
                                        Recent Videos
                                    </TabsTrigger>
                                )}

                                <TabsTrigger
                                    value="details"
                                    className="flex-1 rounded-md px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Details
                                </TabsTrigger>
                            </TabsList>

                            {/* Members Tab */}
                            <TabsContent value="members" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Team Members
                                        </CardTitle>
                                        <CardDescription>
                                            All members in this team
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {team.members && team.members.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-muted/50">
                                                            <TableHead className="font-semibold">Member</TableHead>
                                                            <TableHead className="font-semibold">Email</TableHead>
                                                            <TableHead className="font-semibold">Role</TableHead>
                                                            <TableHead className="font-semibold text-right">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {team.members.map((member: { _id: string; name: string; email: string; role: string }) => (
                                                            <TableRow key={member._id} className="hover:bg-muted/50">
                                                                <TableCell>
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar>
                                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
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
                                                                            Leader
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
                                                title="No members"
                                                description="This team doesn't have any members yet"
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
                                            YouTube Channels
                                        </CardTitle>
                                        <CardDescription>
                                            All channels managed by this team
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {team.channels && team.channels.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {team.channels.map((channel: { _id: string; name: string; youtubeChannelId: string; subscriberCount?: number; isConnected: boolean }) => (
                                                    <Card key={channel._id} className="border-2 hover:border-primary transition-colors">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-pink-600 shrink-0">
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
                                                                            {channel.isConnected ? '✓ Connected' : 'Offline'}
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
                                                title="No channels"
                                                description="This team doesn't have any YouTube channels yet"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Channel Assignments Tab */}
                            {overview?.channelAssignments && overview.channelAssignments.length > 0 && (
                                <TabsContent value="assignments" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <UserCircle className="h-5 w-5" />
                                                Channel Assignments
                                            </CardTitle>
                                            <CardDescription>
                                                Editor assignments for each channel
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
                                                                            {assignment.editorsAssigned} editor(s) assigned
                                                                        </CardDescription>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {assignment.editorsAssigned} Editor{assignment.editorsAssigned !== 1 ? 's' : ''}
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
                                                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
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
                                                                    No editors assigned
                                                                </p>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {/* Recent Videos Tab */}
                            {overview?.recentVideos && overview.recentVideos.length > 0 && (
                                <TabsContent value="videos" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Video className="h-5 w-5" />
                                                Recent Videos
                                            </CardTitle>
                                            <CardDescription>
                                                Latest videos from team channels
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
                            )}

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
                                                        label="Likes"
                                                        total={stats.totalLikes}
                                                        avg={stats.totalChannels ? Math.round(stats.totalLikes / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={MessageSquare}
                                                        label="Comments"
                                                        total={stats.totalComments}
                                                        avg={stats.totalChannels ? Math.round(stats.totalComments / stats.totalChannels) : 0}
                                                    />
                                                    <MetricRow
                                                        icon={Share2}
                                                        label="Shares"
                                                        total={stats.totalShares}
                                                        avg={stats.totalChannels ? Math.round(stats.totalShares / stats.totalChannels) : 0}
                                                    />
                                                    <TableRow className="bg-primary/5 font-medium">
                                                        <TableCell className="flex items-center gap-2">
                                                            <Activity className="h-4 w-4 text-primary" />
                                                            Engagement Rate
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
                                            Team Information
                                        </CardTitle>
                                        <CardDescription>
                                            Complete information about this team
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableBody>
                                                    <DetailRow label="Team ID" value={team._id} icon={BarChart3} />
                                                    <DetailRow label="Team Name" value={team.name} icon={Users} />
                                                    <DetailRow label="Description" value={team.description || 'N/A'} icon={MessageSquare} />
                                                    <DetailRow
                                                        label="Branch"
                                                        value={team.branch ? `${team.branch.name}${team.branch.code ? ` (${team.branch.code})` : ''}` : 'N/A'}
                                                        icon={Building2}
                                                    />
                                                    <DetailRow
                                                        label="Leader"
                                                        value={team.leader ? `${team.leader.name} (${team.leader.email})` : 'Not assigned'}
                                                        icon={UserCircle}
                                                    />
                                                    <DetailRow
                                                        label="Status"
                                                        value={team.isActive ? 'Active' : 'Inactive'}
                                                        icon={Activity}
                                                        highlight={team.isActive}
                                                    />
                                                    <DetailRow label="Created At" value={formatDate(team.createdAt)} icon={Calendar} />
                                                    <DetailRow label="Updated At" value={formatDate(team.updatedAt)} icon={Clock} />
                                                    <DetailRow label="Total Members" value={team.members?.length || 0} icon={User} />
                                                    <DetailRow label="Total Channels" value={team.channels?.length || 0} icon={Youtube} />
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
                                                    title="Views/Kênh"
                                                    value={Math.round(stats.totalViews / stats.totalChannels).toLocaleString()}
                                                    color="text-emerald-600"
                                                    bgColor="bg-emerald-50 dark:bg-emerald-950"
                                                />
                                                <AverageCard
                                                    icon={Clock}
                                                    title="Watch Time/Kênh"
                                                    value={`${Math.round(stats.totalWatchTimeHours / stats.totalChannels)}h`}
                                                    color="text-rose-600"
                                                    bgColor="bg-rose-50 dark:bg-rose-950"
                                                />
                                                <AverageCard
                                                    icon={Users}
                                                    title="Subs Net/Kênh"
                                                    value={Math.round(stats.subscribersNet / stats.totalChannels).toLocaleString()}
                                                    color="text-sky-600"
                                                    bgColor="bg-sky-50 dark:bg-sky-950"
                                                />
                                                <AverageCard
                                                    icon={Activity}
                                                    title="Engagement Rate"
                                                    value={`${stats.engagementRate.toFixed(2)}%`}
                                                    color="text-indigo-600"
                                                    bgColor="bg-indigo-50 dark:bg-indigo-950"
                                                />
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

// Metric Card Component (similar to AggregateDashboard)
function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    trend
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string
    subtitle?: string
    gradient: string
    trend?: 'up' | 'down'
}) {
    return (
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
            <CardContent className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                    <Icon className="h-6 w-6 opacity-80" />
                    {trend && (
                        <TrendingUp className={cn(
                            "h-4 w-4",
                            trend === 'down' && "rotate-180"
                        )} />
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

// Detail Row Component for Details Tab
function DetailRow({
    icon: Icon,
    label,
    value,
    highlight = false
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | number
    highlight?: boolean
}) {
    return (
        <TableRow className={cn(
            "hover:bg-muted/50",
            highlight && "bg-green-50 dark:bg-green-950"
        )}>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Icon className={cn(
                        "h-4 w-4",
                        highlight ? "text-green-600" : "text-muted-foreground"
                    )} />
                    {label}
                </div>
            </TableCell>
            <TableCell className={cn(
                "text-right",
                highlight && "font-semibold text-green-700 dark:text-green-400"
            )}>
                {value}
            </TableCell>
        </TableRow>
    )
}

// Average Card Component
function AverageCard({
    icon: Icon,
    title,
    value,
    color,
    bgColor
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    value: string
    color: string
    bgColor: string
}) {
    return (
        <Card className="border-2">
            <CardContent className={cn("p-6", bgColor)}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className={cn("text-3xl font-bold", color)}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}

// Empty State Component
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
