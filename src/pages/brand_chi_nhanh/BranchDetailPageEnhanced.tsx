// src/pages/BranchDetailPageEnhanced.tsx - ENHANCED VERSION WITH CHARTS
import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useBranch } from "@/hooks/useBranches"
import { useBranchAnalytics, useBranchTeams, useBranchChannels } from "@/hooks/useBranchAnalytics"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import { AggregateDashboard } from "@/pages/analytics/components/AggregateDashboard"
import {
    Building2, Users, Youtube, TrendingUp, MapPin, Home,
    Activity, Clock, Eye, DollarSign, Video,
    Calendar, ArrowUpRight, ArrowDownRight,
    BarChart3, PieChart, RefreshCw, Filter
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

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

function getPresetDateRange(preset: string): { startDate: string; endDate: string } {
    const endDate = new Date()
    let startDate = new Date()

    switch (preset) {
        case '7days':
            startDate.setDate(endDate.getDate() - 7)
            break
        case '30days':
            startDate.setDate(endDate.getDate() - 30)
            break
        case '90days':
            startDate.setDate(endDate.getDate() - 90)
            break
        case '1year':
            startDate.setFullYear(endDate.getFullYear() - 1)
            break
        default:
            startDate.setDate(endDate.getDate() - 30)
    }

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    }
}

// ============================================================================
// COMPONENTS
// ============================================================================

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

function TeamCard({ team, onClick }: { team: any; onClick: () => void }) {
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

function ChannelCard({ channel, onClick }: { channel: any; onClick: () => void }) {
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

function DateRangeFilter({
    dateRange,
    onDateRangeChange
}: {
    dateRange: { startDate: string; endDate: string }
    onDateRangeChange: (range: { startDate: string; endDate: string }) => void
}) {
    const [preset, setPreset] = React.useState('30days')
    const [customStart, setCustomStart] = React.useState(dateRange.startDate)
    const [customEnd, setCustomEnd] = React.useState(dateRange.endDate)

    const handlePresetChange = (value: string) => {
        setPreset(value)
        if (value !== 'custom') {
            const range = getPresetDateRange(value)
            setCustomStart(range.startDate)
            setCustomEnd(range.endDate)
            onDateRangeChange(range)
        }
    }

    const handleCustomApply = () => {
        onDateRangeChange({ startDate: customStart, endDate: customEnd })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                        {new Date(dateRange.startDate).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                        {' - '}
                        {new Date(dateRange.endDate).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Quick Select</Label>
                        <Select value={preset} onValueChange={handlePresetChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="1year">Last year</SelectItem>
                                <SelectItem value="custom">Custom range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {preset === 'custom' && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={customStart}
                                    onChange={(e) => setCustomStart(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={customEnd}
                                    onChange={(e) => setCustomEnd(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleCustomApply} className="w-full">
                                Apply Custom Range
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BranchDetailPageEnhanced() {
    const { branchId } = useParams<{ branchId: string }>()
    const navigate = useNavigate()
    const { branch, loading: branchLoading, error: branchError } = useBranch(branchId!)

    const [dateRange, setDateRange] = React.useState(getPresetDateRange('30days'))

    const {
        analytics,
        loading: analyticsLoading,
        refetch: refetchAnalytics,
        setDateRange: updateDateRange
    } = useBranchAnalytics({
        branchId: branchId!,
        dateRange,
        autoFetch: true
    })

    const { teams, loading: teamsLoading } = useBranchTeams(branchId!)
    const { channels, loading: channelsLoading } = useBranchChannels(branchId!)

    const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
        setDateRange(range)
        updateDateRange(range)
    }

    const handleRefresh = () => {
        refetchAnalytics()
        toast.success('Analytics refreshed')
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

    // Loading state
    if (branchLoading) {
        return (
            <div className="flex flex-col h-full">
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
                <div className="flex-1 p-6">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    // Error state
    if (branchError || !branch) {
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
                                    {branchError || "Branch not found"}
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
                                        <DateRangeFilter
                                            dateRange={dateRange}
                                            onDateRangeChange={handleDateRangeChange}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            disabled={analyticsLoading}
                                        >
                                            <RefreshCw className={cn(
                                                "h-4 w-4 mr-2",
                                                analyticsLoading && "animate-spin"
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
                            />
                            <MetricCard
                                icon={Youtube}
                                title="Total Channels"
                                value={totalStats.channels.toString()}
                                subtitle={`${formatNumber(totalStats.subscribers)} subscribers`}
                                gradient="from-red-500 to-rose-600"
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
                                value={analytics?.analytics?.views ? formatNumber(analytics.analytics.views) : '0'}
                                subtitle={`Period views`}
                                gradient="from-amber-500 to-orange-600"
                            />
                        </div>

                        {/* Analytics Dashboard */}
                        {analyticsLoading ? (
                            <Card>
                                <CardContent className="p-12">
                                    <div className="flex flex-col items-center gap-4">
                                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-muted-foreground">Loading analytics...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : analytics?.analytics ? (
                            <AggregateDashboard
                                data={{
                                    basic: {
                                        totals: {
                                            totalViews: analytics.analytics.views || 0,
                                            totalWatchTimeHours: (analytics.analytics.watchTime || 0) / 3600,
                                            totalWatchTimeMinutes: (analytics.analytics.watchTime || 0) / 60,
                                            totalSubscribersGained: analytics.analytics.subscribersGained || 0,
                                            totalSubscribersLost: analytics.analytics.subscribersLost || 0,
                                            totalSubscribersNet: analytics.analytics.subscribersNet || analytics.analytics.subscribersGained || 0,
                                            averageViewDuration: analytics.analytics.averageViewDuration || 0
                                        }
                                    },
                                    engagement: {
                                        totals: {
                                            totalLikes: analytics.analytics.likes || 0,
                                            totalDislikes: 0,
                                            totalComments: analytics.analytics.comments || 0,
                                            totalShares: analytics.analytics.shares || 0,
                                            engagementRate: analytics.analytics.engagementRate || 0
                                        }
                                    },
                                    channels: channels.map(ch => ({
                                        id: ch._id,
                                        name: ch.name,
                                        thumbnail: ch.thumbnailUrl
                                    })),
                                    totalChannels: channels.length,
                                    dateRange: dateRange
                                }}
                                title={`Analytics cho ${branch.name}`}
                            />
                        ) : null}

                        {/* Teams Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Teams ({totalStats.teams})
                                </CardTitle>
                                <CardDescription>
                                    {totalStats.members} total members across all teams
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {teamsLoading ? (
                                    <div className="flex justify-center p-8">
                                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : teams.length > 0 ? (
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

                        {/* Channels Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Youtube className="h-5 w-5" />
                                    Channels ({totalStats.channels})
                                </CardTitle>
                                <CardDescription>
                                    {formatNumber(totalStats.subscribers)} subscribers across all channels
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-3">
                                        <Youtube className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">
                                                Channels in Sidebar
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                All channels for this branch are displayed in the left sidebar.
                                                Click on any channel to view detailed information.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {channelsLoading ? (
                                    <div className="flex justify-center p-8">
                                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : channels.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {channels.slice(0, 6).map((channel) => (
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

                                {channels.length > 6 && (
                                    <div className="mt-4 text-center">
                                        <Button variant="outline">
                                            View All {channels.length} Channels
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
