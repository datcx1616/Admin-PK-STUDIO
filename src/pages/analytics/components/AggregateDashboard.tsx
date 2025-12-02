import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    TrendingUp,
    Eye,
    Clock,
    Users,
    ThumbsUp,
    MessageSquare,
    Share2,
    Activity,
    BarChart3,
    Award
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface AggregateTotals {
    totalViews?: number
    totalWatchTimeHours?: number
    totalWatchTimeMinutes?: number
    totalSubscribersGained?: number
    totalSubscribersLost?: number
    totalSubscribersNet?: number
    averageViewDuration?: number
    engagementRate?: number
    totalLikes?: number
    totalDislikes?: number
    totalComments?: number
    totalShares?: number
}

export interface AggregateBasic {
    totals?: AggregateTotals
    views?: number
    watchTimeHours?: number
    watchTimeMinutes?: number
    subscribersGained?: number
    subscribersLost?: number
    subscribersNet?: number
    avgViewDuration?: number
}

export interface AggregateEngagement {
    totals?: AggregateTotals
    likes?: number
    dislikes?: number
    comments?: number
    shares?: number
    engagementRate?: number
}

export interface AggregateChannel {
    id?: string
    channelId?: string
    _id?: string
    name: string
    thumbnail?: string
}

export interface AggregateData {
    basic?: AggregateBasic
    engagement?: AggregateEngagement
    channels?: AggregateChannel[]
    totalChannels?: number
    dateRange?: { startDate?: string; endDate?: string }
}

interface AggregateDashboardProps {
    data: AggregateData
    title?: string
}

export function AggregateDashboard({
    data,
    title = "Analytics Tổng Hợp"
}: AggregateDashboardProps) {
    const basic = {
        views: data?.basic?.totals?.totalViews || data?.basic?.views || 0,
        watchTimeHours: data?.basic?.totals?.totalWatchTimeHours || data?.basic?.watchTimeHours || 0,
        watchTimeMinutes: data?.basic?.totals?.totalWatchTimeMinutes || data?.basic?.watchTimeMinutes || 0,
        subscribersGained: data?.basic?.totals?.totalSubscribersGained || data?.basic?.subscribersGained || 0,
        subscribersLost: data?.basic?.totals?.totalSubscribersLost || data?.basic?.subscribersLost || 0,
        subscribersNet: data?.basic?.totals?.totalSubscribersNet || data?.basic?.subscribersNet || 0,
        avgViewDuration: data?.basic?.totals?.averageViewDuration || data?.basic?.avgViewDuration || 0,
    }

    const engagement = {
        likes: data?.engagement?.totals?.totalLikes || data?.engagement?.likes || 0,
        dislikes: data?.engagement?.totals?.totalDislikes || data?.engagement?.dislikes || 0,
        comments: data?.engagement?.totals?.totalComments || data?.engagement?.comments || 0,
        shares: data?.engagement?.totals?.totalShares || data?.engagement?.shares || 0,
        engagementRate: data?.engagement?.totals?.engagementRate || data?.engagement?.engagementRate || 0,
    }

    const totalChannels = data?.totalChannels || data?.channels?.length || 0
    const startDate = data?.dateRange?.startDate
    const endDate = data?.dateRange?.endDate

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 via-primary/3 to-background">
                <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                                <BarChart3 className="h-7 w-7 text-primary" />
                                {title}
                            </CardTitle>
                            {startDate && endDate && (
                                <CardDescription className="flex items-center gap-2 text-base">
                                    <Clock className="h-4 w-4" />
                                    {formatDate(startDate)} → {formatDate(endDate)}
                                </CardDescription>
                            )}
                        </div>

                        {totalChannels > 0 && (
                            <Badge variant="secondary" className="text-sm px-4 py-2">
                                <Activity className="h-4 w-4 mr-2" />
                                {totalChannels} kênh đang phân tích
                            </Badge>
                        )}
                    </div>

                    {/* Channel List */}
                    {data?.channels && data.channels.length > 0 && (
                        <>
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                                {data.channels.map((ch: AggregateChannel) => (
                                    <Badge
                                        key={ch.id || ch.channelId || ch._id}
                                        variant="outline"
                                        className="px-3 py-2 flex items-center gap-2 hover:bg-primary/10 transition-colors"
                                    >
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={ch.thumbnail} alt={ch.name} />
                                            <AvatarFallback className="text-xs">
                                                {ch.name.substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{ch.name}</span>
                                    </Badge>
                                ))}
                            </div>
                        </>
                    )}
                </CardHeader>
            </Card>

            {/* Tabs Navigation */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="inline-flex h-auto w-full items-center justify-center rounded-lg bg-muted p-1 gap-1">
                    <TabsTrigger
                        value="overview"
                        className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                    >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Tổng Quan</span>
                        <span className="sm:hidden">Tổng</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="engagement"
                        className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                    >
                        <Activity className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Tương Tác</span>
                        <span className="sm:hidden">Tác</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="details"
                        className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                    >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Chi Tiết</span>
                        <span className="sm:hidden">Chi</span>
                    </TabsTrigger>

                    {totalChannels > 0 && (
                        <TabsTrigger
                            value="avg"
                            className="flex-1 rounded-md px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                        >
                            <Award className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Trung Bình</span>
                            <span className="sm:hidden">TB</span>
                        </TabsTrigger>
                    )}
                </TabsList>
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            icon={Eye}
                            title="Tổng Lượt Xem"
                            value={basic.views.toLocaleString()}
                            subtitle={totalChannels ? `~${Math.round(basic.views / totalChannels).toLocaleString()}/kênh` : undefined}
                            gradient="from-emerald-500 to-teal-600"
                        />
                        <MetricCard
                            icon={Clock}
                            title="Thời Gian Xem"
                            value={`${Number(basic.watchTimeHours).toLocaleString()}h`}
                            subtitle={`${Math.round(basic.watchTimeMinutes).toLocaleString()} phút`}
                            gradient="from-amber-500 to-orange-600"
                        />
                        <MetricCard
                            icon={Users}
                            title="Subscribers Thuần"
                            value={`${basic.subscribersNet >= 0 ? '+' : ''}${basic.subscribersNet.toLocaleString()}`}
                            subtitle={`+${basic.subscribersGained.toLocaleString()} / -${basic.subscribersLost.toLocaleString()}`}
                            gradient="from-pink-500 to-rose-600"
                            trend={basic.subscribersNet >= 0 ? 'up' : 'down'}
                        />
                        <MetricCard
                            icon={Activity}
                            title="Thời Lượng TB"
                            value={`${Math.round(basic.avgViewDuration)}s`}
                            subtitle={`${Math.round(basic.avgViewDuration / 60 * 10) / 10} phút`}
                            gradient="from-sky-500 to-cyan-600"
                        />
                    </div>
                </TabsContent>

                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            icon={ThumbsUp}
                            title="Tổng Likes"
                            value={engagement.likes.toLocaleString()}
                            gradient="from-green-500 to-emerald-600"
                        />
                        <MetricCard
                            icon={MessageSquare}
                            title="Tổng Comments"
                            value={engagement.comments.toLocaleString()}
                            gradient="from-amber-500 to-orange-600"
                        />
                        <MetricCard
                            icon={Share2}
                            title="Tổng Shares"
                            value={engagement.shares.toLocaleString()}
                            gradient="from-pink-500 to-rose-600"
                        />
                        <MetricCard
                            icon={Activity}
                            title="Engagement Rate"
                            value={`${engagement.engagementRate.toFixed(2)}%`}
                            gradient="from-blue-500 to-indigo-600"
                        />
                    </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Bảng Chi Tiết
                            </CardTitle>
                            <CardDescription>
                                Tổng hợp số liệu từ {totalChannels} kênh
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
                                            total={basic.views}
                                            avg={totalChannels ? Math.round(basic.views / totalChannels) : 0}
                                        />
                                        <MetricRow
                                            icon={Clock}
                                            label="Thời gian xem (giờ)"
                                            total={Number(basic.watchTimeHours)}
                                            avg={totalChannels ? Math.round(Number(basic.watchTimeHours) / totalChannels) : 0}
                                        />
                                        <MetricRow
                                            icon={Users}
                                            label="Subscribers mới"
                                            total={basic.subscribersGained}
                                            avg={totalChannels ? Math.round(basic.subscribersGained / totalChannels) : 0}
                                            prefix="+"
                                            variant="success"
                                        />
                                        <MetricRow
                                            icon={Users}
                                            label="Subscribers mất"
                                            total={basic.subscribersLost}
                                            avg={totalChannels ? Math.round(basic.subscribersLost / totalChannels) : 0}
                                            prefix="-"
                                            variant="destructive"
                                        />
                                        <MetricRow
                                            icon={TrendingUp}
                                            label="Subscribers thuần"
                                            total={basic.subscribersNet}
                                            avg={totalChannels ? Math.round(basic.subscribersNet / totalChannels) : 0}
                                            highlight
                                        />
                                        <MetricRow
                                            icon={ThumbsUp}
                                            label="Likes"
                                            total={engagement.likes}
                                            avg={totalChannels ? Math.round(engagement.likes / totalChannels) : 0}
                                        />
                                        <MetricRow
                                            icon={MessageSquare}
                                            label="Comments"
                                            total={engagement.comments}
                                            avg={totalChannels ? Math.round(engagement.comments / totalChannels) : 0}
                                        />
                                        <MetricRow
                                            icon={Share2}
                                            label="Shares"
                                            total={engagement.shares}
                                            avg={totalChannels ? Math.round(engagement.shares / totalChannels) : 0}
                                        />
                                        <TableRow className="bg-primary/5 font-medium">
                                            <TableCell className="flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-primary" />
                                                Engagement Rate
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {engagement.engagementRate.toFixed(2)}%
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Average Tab */}
                {totalChannels > 0 && (
                    <TabsContent value="avg" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Trung bình mỗi kênh
                                </CardTitle>
                                <CardDescription>
                                    Hiệu suất trung bình trên {totalChannels} kênh
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <AverageCard
                                        icon={Eye}
                                        title="Views/Kênh"
                                        value={totalChannels ? Math.round(basic.views / totalChannels).toLocaleString() : '0'}
                                        color="text-emerald-600"
                                        bgColor="bg-emerald-50 dark:bg-emerald-950"
                                    />
                                    <AverageCard
                                        icon={Clock}
                                        title="Watch Time/Kênh"
                                        value={totalChannels ? `${Math.round(Number(basic.watchTimeHours) / totalChannels)}h` : '0h'}
                                        color="text-rose-600"
                                        bgColor="bg-rose-50 dark:bg-rose-950"
                                    />
                                    <AverageCard
                                        icon={Users}
                                        title="Subs Net/Kênh"
                                        value={totalChannels ? Math.round(basic.subscribersNet / totalChannels).toLocaleString() : '0'}
                                        color="text-sky-600"
                                        bgColor="bg-sky-50 dark:bg-sky-950"
                                    />
                                    <AverageCard
                                        icon={Activity}
                                        title="Engagement Rate"
                                        value={`${engagement.engagementRate.toFixed(2)}%`}
                                        color="text-indigo-600"
                                        bgColor="bg-indigo-50 dark:bg-indigo-950"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

// Enhanced Metric Card Component
function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    trend
}: {
    icon: any
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

// Table Row Component
function MetricRow({
    icon: Icon,
    label,
    total,
    avg,
    prefix = '',
    highlight = false,
    variant
}: {
    icon: any
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

// Average Card Component
function AverageCard({
    icon: Icon,
    title,
    value,
    color,
    bgColor
}: {
    icon: any
    title: string
    value: string
    color: string
    bgColor: string
}) {
    return (
        <Card className="border-2">
            <CardContent className={cn("p-6", bgColor)}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm")}>
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