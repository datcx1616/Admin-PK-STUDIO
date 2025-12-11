// src/pages/examples/analytics/page.tsx
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { extractData } from "@/lib/api-utils"
import { BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Import analytics components
import type { AnalyticsResponse, DateRangeType } from "./components/types"
import { OverviewCards } from "./components/OverviewCards"
import { SubscriberGrowth } from "./components/SubscriberGrowth"
import { EngagementCards } from "./components/EngagementCards"
import { RevenueCards } from "./components/RevenueCards"
import { AudienceCards } from "./components/AudienceCards"
import { TrafficSources } from "./components/TrafficSources"
import { DeviceTypes } from "./components/DeviceTypes"
import { Demographics } from "./components/Demographics"
import { TopVideos } from "./components/TopVideos"

// Import new components
import { ModeNavigation, type AnalyticsMode } from "./components/ModeNavigation"
import { ChannelSelector } from "./components/ChannelSelector"
import { AggregateDashboard, type AggregateData } from "./components/AggregateDashboard"
import { CompareDashboard, type CompareData } from "./components/CompareDashboard"

// Header imports
import { Calendar, Download, ExternalLink, RefreshCw, ArrowLeft, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Types
interface Branch {
    _id: string
    name: string
    code: string
    teamsCount?: number
}

interface Team {
    _id: string
    name: string
    branch?: {
        _id: string
        name: string
    }
}

interface Channel {
    _id: string
    name: string
    youtubeChannelId: string
    thumbnailUrl?: string
    subscriberCount: number
    viewCount: number
    videoCount: number
    isConnected: boolean
    refreshToken?: boolean
    team?: {
        _id: string
        name: string
    }
}

export default function AnalyticsPage() {
    // View states
    const [currentView, setCurrentView] = useState<'selector' | 'single' | 'aggregate' | 'compare' | 'branch' | 'team'>('selector')
    const [analyticsMode, setAnalyticsMode] = useState<AnalyticsMode>('single')

    // Data states
    const [branches, setBranches] = useState<Branch[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [channels, setChannels] = useState<Channel[]>([])

    // Selection states
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [selectedChannels, setSelectedChannels] = useState<string[]>([])
    const [selectedBranchId, setSelectedBranchId] = useState<string>("")
    const [selectedTeamId, setSelectedTeamId] = useState<string>("")

    // Analytics states
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
    const [aggregateAnalytics, setAggregateAnalytics] = useState<AggregateData | null>(null)
    const [compareAnalytics, setCompareAnalytics] = useState<CompareData | null>(null)
    const [branchAnalytics, setBranchAnalytics] = useState<AggregateData | null>(null)
    const [teamAnalytics, setTeamAnalytics] = useState<AggregateData | null>(null)
    const [dateRange, setDateRange] = useState<DateRangeType>('30days')

    // Custom date range states
    const [customStartDate, setCustomStartDate] = useState<string>('')
    const [customEndDate, setCustomEndDate] = useState<string>('')
    const [isCustomDateOpen, setIsCustomDateOpen] = useState(false)
    const [appliedDateRange, setAppliedDateRange] = useState<{
        start: string
        end: string
        type: DateRangeType
    } | null>(null)

    // UI states
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const { toast } = useToast()

    // Helper: Get date range
    const getDateRange = (type: DateRangeType): { start: string; end: string } => {
        const end = new Date()
        const start = new Date()

        switch (type) {
            case '7days':
                start.setDate(end.getDate() - 7)
                break
            case '30days':
                start.setDate(end.getDate() - 30)
                break
            case '90days':
                start.setDate(end.getDate() - 90)
                break
            case 'custom':
                return {
                    start: customStartDate,
                    end: customEndDate
                }
        }

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        }
    }

    // Helper: Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Fetch initial data
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            toast({
                title: "Chưa đăng nhập",
                description: "Vui lòng đăng nhập để xem analytics",
                variant: "destructive"
            })
            window.location.href = '/login'
            return
        }
        fetchInitialData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fetch analytics when channel selected
    useEffect(() => {
        if (selectedChannel && currentView === 'single') {
            fetchSingleChannelAnalytics()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChannel, dateRange, currentView])

    // Auto refetch when date range changes for non-single views
    useEffect(() => {
        if (currentView === 'aggregate' && selectedChannels.length > 0) {
            fetchAggregateAnalytics()
        } else if (currentView === 'compare' && selectedChannels.length > 1) {
            fetchCompareAnalytics()
        } else if (currentView === 'branch' && selectedBranchId) {
            fetchBranchAnalytics(selectedBranchId)
        } else if (currentView === 'team' && selectedTeamId) {
            fetchTeamAnalytics(selectedTeamId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [branchesRes, teamsRes, channelsRes] = await Promise.all([
                apiClient.getBranches(),
                apiClient.getTeams(),
                apiClient.getChannelsForAnalytics()
            ])

            setBranches(extractData<Branch>(branchesRes, 'branches'))
            setTeams(extractData<Team>(teamsRes, 'teams'))
            setChannels(extractData<Channel>(channelsRes, 'channels'))
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({
                title: "Lỗi tải dữ liệu",
                description: message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchSingleChannelAnalytics = async () => {
        if (!selectedChannel?.isConnected) return

        setRefreshing(true)
        try {
            const { start, end } = getDateRange(dateRange)

            console.log('📅 Fetching analytics:', { start, end, dateRange })

            const response = await apiClient.getYouTubeAnalytics({
                channelId: selectedChannel._id,
                startDate: start,
                endDate: end,
                include: 'all'
            })

            if (response) {
                const hasData = (obj: unknown): obj is { data: AnalyticsResponse } => {
                    return typeof obj === 'object' && obj !== null && 'data' in (obj as Record<string, unknown>)
                }
                const data: AnalyticsResponse = hasData(response) ? response.data : (response as AnalyticsResponse)
                setAnalytics(data)

                // Save applied date range
                setAppliedDateRange({
                    start,
                    end,
                    type: dateRange
                })

                console.log('✅ Analytics loaded:', { start, end })
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({
                title: "Lỗi",
                description: "Không thể tải analytics: " + message,
                variant: "destructive"
            })
        } finally {
            setRefreshing(false)
        }
    }

    const fetchAggregateAnalytics = async () => {
        if (selectedChannels.length === 0) return

        setLoading(true)
        try {
            const { start, end } = getDateRange(dateRange)

            const response = await apiClient.getAggregatedAnalytics({
                channelIds: selectedChannels,
                startDate: start,
                endDate: end
            })

            if (response?.success) {
                setAggregateAnalytics(response.data)
                setCurrentView('aggregate')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({
                title: "Lỗi",
                description: "Không thể tải analytics tổng hợp: " + message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchCompareAnalytics = async () => {
        if (selectedChannels.length < 2) return

        setLoading(true)
        try {
            const { start, end } = getDateRange(dateRange)

            // Note: Adjust this endpoint if your API has a different compare endpoint
            const response = await apiClient.getAggregatedAnalytics({
                channelIds: selectedChannels,
                startDate: start,
                endDate: end
            })

            if (response?.success) {
                setCompareAnalytics(response.data as CompareData)
                setCurrentView('compare')
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({
                title: "Lỗi",
                description: "Không thể tải analytics so sánh: " + message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchBranchAnalytics = async (branchId: string) => {
        setLoading(true)
        try {
            const { start, end } = getDateRange(dateRange)
            const response = await apiClient.getBranchAnalytics(branchId, { startDate: start, endDate: end })
            if (response?.success) {
                setBranchAnalytics(response.data)
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({ title: 'Lỗi', description: 'Không thể tải analytics chi nhánh: ' + message, variant: 'destructive' })
        } finally {
            setLoading(false)
        }
    }

    const fetchTeamAnalytics = async (teamId: string) => {
        setLoading(true)
        try {
            const { start, end } = getDateRange(dateRange)
            const response = await apiClient.getTeamAnalytics(teamId, { startDate: start, endDate: end })
            if (response?.success) {
                setTeamAnalytics(response.data)
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast({ title: 'Lỗi', description: 'Không thể tải analytics đội nhóm: ' + message, variant: 'destructive' })
        } finally {
            setLoading(false)
        }
    }

    const handleModeChange = (mode: AnalyticsMode) => {
        setAnalyticsMode(mode)
        setSelectedChannels([])
        setCurrentView('selector')
    }

    const handleSelectChannel = (channelId: string) => {
        if (selectedChannels.includes(channelId)) {
            setSelectedChannels(selectedChannels.filter(id => id !== channelId))
        } else {
            const maxChannels = analyticsMode === 'compare' ? 5 : channels.length
            if (selectedChannels.length < maxChannels) {
                setSelectedChannels([...selectedChannels, channelId])
            }
        }
    }

    const handleViewSingleAnalytics = (channelId: string) => {
        const channel = channels.find(c => c._id === channelId)
        if (channel) {
            setSelectedChannel(channel)
            setCurrentView('single')
        }
    }

    const handleViewBranch = (branchId: string) => {
        setSelectedBranchId(branchId)
        setCurrentView('branch')
        fetchBranchAnalytics(branchId)
    }

    const handleViewTeam = (teamId: string) => {
        setSelectedTeamId(teamId)
        setCurrentView('team')
        fetchTeamAnalytics(teamId)
    }

    const handleBackToSelector = () => {
        setCurrentView('selector')
        setSelectedChannel(null)
        setAnalytics(null)
        setAggregateAnalytics(null)
        setCompareAnalytics(null)
        setBranchAnalytics(null)
        setTeamAnalytics(null)
        setAppliedDateRange(null)
    }

    const handleCustomDateApply = () => {
        if (!customStartDate || !customEndDate) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng chọn cả ngày bắt đầu và ngày kết thúc",
                variant: "destructive"
            })
            return
        }

        if (new Date(customStartDate) > new Date(customEndDate)) {
            toast({
                title: "Ngày không hợp lệ",
                description: "Ngày bắt đầu phải trước ngày kết thúc",
                variant: "destructive"
            })
            return
        }

        setDateRange('custom')
        setIsCustomDateOpen(false)

        // Trigger analytics fetch based on current view
        if (currentView === 'single' && selectedChannel) {
            fetchSingleChannelAnalytics()
        } else if (currentView === 'aggregate') {
            fetchAggregateAnalytics()
        } else if (currentView === 'compare') {
            fetchCompareAnalytics()
        } else if (currentView === 'branch' && selectedBranchId) {
            fetchBranchAnalytics(selectedBranchId)
        } else if (currentView === 'team' && selectedTeamId) {
            fetchTeamAnalytics(selectedTeamId)
        }
    }

    const exportCSV = (rows: Array<Record<string, string | number>>, filename: string) => {
        if (!rows?.length) return
        const headers = Object.keys(rows[0])
        const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const exportAggregateCSV = (data: AggregateData, filename = 'aggregate.csv') => {
        const channels = data.channels || []
        const rows = channels.map(ch => ({
            id: ch._id || ch.channelId || ch.id || '',
            name: ch.name,
        }))
        exportCSV(rows, filename)
    }

    const exportCompareCSV = (data: CompareData, filename = 'compare.csv') => {
        const rows = (data.channels || []).map(ch => ({
            id: ch._id || ch.channelId || ch.id || '',
            name: ch.name,
            totalViews: ch.basic?.totalViews || 0,
            totalWatchTimeHours: ch.basic?.totalWatchTimeHours || 0,
            totalSubscribersGained: ch.basic?.totalSubscribersGained || 0,
            totalSubscribersLost: ch.basic?.totalSubscribersLost || 0,
            totalSubscribersNet: ch.basic?.totalSubscribersNet || 0,
            totalLikes: ch.engagement?.totalLikes || 0,
            totalComments: ch.engagement?.totalComments || 0,
            totalShares: ch.engagement?.totalShares || 0,
            engagementRate: ch.engagement?.engagementRate || 0,
            estimatedRevenue: ch.revenue?.estimatedRevenue || 0,
            cpm: ch.revenue?.cpm || 0,
            rpm: ch.revenue?.rpm || 0
        }))
        exportCSV(rows, filename)
    }

    if (loading && channels.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    // Channel Selector View
    if (currentView === 'selector') {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <BarChart3 className="h-8 w-8" />
                            Phân Tích Kênh
                        </h1>
                    </div>
                    <Button onClick={fetchInitialData} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Làm mới
                    </Button>
                </div>

                <ModeNavigation
                    activeMode={analyticsMode}
                    onModeChange={handleModeChange}
                />

                <ChannelSelector
                    mode={analyticsMode}
                    channels={channels}
                    branches={branches}
                    teams={teams}
                    selectedChannels={selectedChannels}
                    onSelectChannel={handleSelectChannel}
                    onViewAnalytics={handleViewSingleAnalytics}
                    onViewBranch={handleViewBranch}
                    onViewTeam={handleViewTeam}
                    onViewAggregate={fetchAggregateAnalytics}
                    onViewCompare={fetchCompareAnalytics}
                />
            </div>
        )
    }

    // Single Channel Analytics View
    if (currentView === 'single' && selectedChannel) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Top Section: Back Button + Channel Info */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleBackToSelector}
                                        className="shrink-0"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Quay lại
                                    </Button>

                                    <Separator orientation="vertical" className="h-10" />

                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="relative shrink-0">
                                            <img
                                                src={selectedChannel.thumbnailUrl}
                                                alt={selectedChannel.name}
                                                className="h-12 w-12 rounded-full border-2 border-primary/10"
                                            />
                                            <div className={cn(
                                                "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white",
                                                selectedChannel.isConnected || selectedChannel.refreshToken
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            )} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h1 className="text-xl md:text-2xl font-bold truncate flex items-center gap-2">
                                                {selectedChannel.name}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                <Badge
                                                    variant={selectedChannel.isConnected || selectedChannel.refreshToken ? "outline" : "destructive"}
                                                    className="text-xs"
                                                >
                                                    {selectedChannel.isConnected || selectedChannel.refreshToken ? (
                                                        <>
                                                            <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                                                            Connected
                                                        </>
                                                    ) : (
                                                        'Disconnected'
                                                    )}
                                                </Badge>

                                                {selectedChannel.team?.name ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {selectedChannel.team.name}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                                        No Team
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions - Desktop Only */}
                                <div className="hidden lg:flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchSingleChannelAnalytics}
                                        disabled={refreshing}
                                    >
                                        <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                                        Refresh
                                    </Button>

                                    {selectedChannel.youtubeChannelId && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(
                                                `https://www.youtube.com/channel/${selectedChannel.youtubeChannelId}`,
                                                '_blank'
                                            )}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            YouTube
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Controls Section */}
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                {/* Date Range Selector */}
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <Label className="text-sm font-medium flex items-center gap-2 shrink-0">
                                        <Calendar className="h-4 w-4" />
                                        Khoảng thời gian
                                    </Label>

                                    <div className="inline-flex rounded-lg border border-border bg-background p-1 gap-1 shadow-sm">
                                        {(['7days', '30days', '90days'] as DateRangeType[]).map(r => (
                                            <Button
                                                key={r}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDateRange(r)}
                                                disabled={refreshing}
                                                className={cn(
                                                    "px-4 py-2 transition-all font-medium rounded-md",
                                                    dateRange === r
                                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                )}
                                            >
                                                {r === '7days' ? '7 ngày' : r === '30days' ? '30 ngày' : '90 ngày'}
                                            </Button>
                                        ))}

                                        <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={refreshing}
                                                    className={cn(
                                                        "px-4 py-2 transition-all font-medium rounded-md gap-2",
                                                        dateRange === 'custom'
                                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    )}
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    Tùy chỉnh
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-4" align="start">
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <h4 className="font-medium text-sm">Chọn khoảng thời gian</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            Chọn ngày bắt đầu và kết thúc
                                                        </p>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="start-date" className="text-xs font-medium">
                                                                Ngày bắt đầu
                                                            </Label>
                                                            <input
                                                                id="start-date"
                                                                type="date"
                                                                value={customStartDate}
                                                                max={customEndDate || undefined}
                                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="end-date" className="text-xs font-medium">
                                                                Ngày kết thúc
                                                            </Label>
                                                            <input
                                                                id="end-date"
                                                                type="date"
                                                                value={customEndDate}
                                                                min={customStartDate || undefined}
                                                                max={new Date().toISOString().split('T')[0]}
                                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                            />
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                                            onClick={handleCustomDateApply}
                                                            disabled={!customStartDate || !customEndDate}
                                                        >
                                                            Áp dụng
                                                        </Button>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Right Side Controls */}
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    {/* Live Data Toggle */}
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                                        <Switch id="live-data" defaultChecked className="data-[state=checked]:bg-emerald-600" />
                                        <Label
                                            htmlFor="live-data"
                                            className="text-sm font-medium text-emerald-700 dark:text-emerald-300 cursor-pointer"
                                        >
                                            Live data
                                        </Label>
                                    </div>

                                    {/* Export Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const rows = [{
                                                    channel: selectedChannel.name,
                                                    totalViews: analytics?.basic?.totals.totalViews || 0,
                                                    totalWatchTimeHours: analytics?.basic?.totals.totalWatchTimeHours || '0',
                                                    totalSubscribersNet: analytics?.basic?.totals.totalSubscribersNet || 0,
                                                    engagementRate: analytics?.engagement?.totals.engagementRate || 0,
                                                    estimatedRevenue: analytics?.revenue?.totals.estimatedRevenue || 0,
                                                }]
                                                exportCSV(rows, `${selectedChannel.name}-analytics.csv`)
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">CSV</span>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.print()}
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Print</span>
                                        </Button>

                                        {/* Mobile: Refresh & YouTube Link */}
                                        <div className="flex lg:hidden items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={fetchSingleChannelAnalytics}
                                                disabled={refreshing}
                                            >
                                                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                                            </Button>

                                            {selectedChannel.youtubeChannelId && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(
                                                        `https://www.youtube.com/channel/${selectedChannel.youtubeChannelId}`,
                                                        '_blank'
                                                    )}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Display Applied Date Range */}
                            {appliedDateRange && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-sm">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {appliedDateRange.type === 'custom' ? (
                                            <>
                                                {formatDate(appliedDateRange.start)} - {formatDate(appliedDateRange.end)}
                                            </>
                                        ) : (
                                            <>
                                                {appliedDateRange.type === '7days' ? 'Tuần qua' :
                                                    appliedDateRange.type === '30days' ? 'Tháng qua' :
                                                        '3 tháng qua'}
                                            </>
                                        )}
                                    </Badge>
                                    {refreshing && (
                                        <Badge variant="secondary" className="text-xs">
                                            Đang tải dữ liệu...
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {!analytics && refreshing ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p>Đang tải analytics data...</p>
                            <p className="text-sm text-muted-foreground">
                                Đang query 50+ metrics từ YouTube Analytics API
                            </p>
                        </div>
                    </div>
                ) : !analytics ? (
                    <Alert className="mt-6">
                        <AlertDescription>
                            Không có dữ liệu analytics. Vui lòng đảm bảo kênh đã được kết nối OAuth.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-6 pt-6">
                        {/* Channel quick stats similar to legacy dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="rounded-xl p-5 bg-gradient-to-br from-blue-500 to-sky-600 text-white">
                                <div className="text-sm/6 opacity-90">👁️ Tổng Lượt Xem</div>
                                <div className="text-3xl font-bold mt-1">{(analytics.basic?.totals.totalViews || 0).toLocaleString()}</div>
                            </div>
                            <div className="rounded-xl p-5 bg-gradient-to-br from-amber-500 to-red-500 text-white">
                                <div className="text-sm/6 opacity-90">⏱️ Thời Gian Xem</div>
                                <div className="text-3xl font-bold mt-1">{analytics.basic?.totals.totalWatchTimeHours || '0'}h</div>
                                <div className="text-xs/6 opacity-90 mt-1">{(analytics.basic?.totals.totalWatchTimeMinutes || 0).toLocaleString()} phút</div>
                            </div>
                            <div className="rounded-xl p-5 bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                                <div className="text-sm/6 opacity-90">👥 Subscribers Thuần</div>
                                <div className="text-3xl font-bold mt-1">{(analytics.basic?.totals.totalSubscribersNet || 0) >= 0 ? '+' : ''}{(analytics.basic?.totals.totalSubscribersNet || 0).toLocaleString()}</div>
                                <div className="text-xs/6 opacity-90 mt-1">+{(analytics.basic?.totals.totalSubscribersGained || 0).toLocaleString()} / -{(analytics.basic?.totals.totalSubscribersLost || 0).toLocaleString()}</div>
                            </div>
                            <div className="rounded-xl p-5 bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
                                <div className="text-sm/6 opacity-90">⏱️ Thời Lượng TB</div>
                                <div className="text-3xl font-bold mt-1">{Math.floor(analytics.basic?.totals.averageViewDuration || 0)}s</div>
                            </div>
                        </div>

                        {/* Detailed Overview cards and subscribers growth */}
                        <OverviewCards analytics={analytics} />
                        <SubscriberGrowth analytics={analytics} />

                        <Tabs defaultValue="engagement" className="space-y-6">
                            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                                <TabsTrigger value="engagement">❤️ Tương Tác</TabsTrigger>
                                <TabsTrigger value="revenue">💰 Doanh Thu</TabsTrigger>
                                <TabsTrigger value="audience">👥 Khán Giả</TabsTrigger>
                                <TabsTrigger value="videos">🎬 Videos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="engagement" className="space-y-6">
                                <EngagementCards analytics={analytics} />
                            </TabsContent>

                            <TabsContent value="revenue" className="space-y-6">
                                <RevenueCards analytics={analytics} dateRange={dateRange} />
                            </TabsContent>

                            <TabsContent value="audience" className="space-y-6">
                                <AudienceCards analytics={analytics} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TrafficSources analytics={analytics} />
                                    <DeviceTypes analytics={analytics} />
                                </div>
                                <Demographics analytics={analytics} />
                            </TabsContent>

                            <TabsContent value="videos" className="space-y-6">
                                <TopVideos analytics={analytics} />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        )
    }

    // Aggregate View
    if (currentView === 'aggregate' && aggregateAnalytics) {
        return (
            <div className="container mx-auto py-6 space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleBackToSelector}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">📊 Analytics Tổng Hợp</h1>
                            <p className="text-sm text-muted-foreground">
                                {aggregateAnalytics.totalChannels} kênh đã chọn
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="7days">7 ngày</option>
                            <option value="30days">30 ngày</option>
                            <option value="90days">90 ngày</option>
                        </select>
                        <Button variant="outline" onClick={fetchAggregateAnalytics}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                        </Button>
                        <Button variant="outline" onClick={() => exportAggregateCSV(aggregateAnalytics)}>
                            Export CSV
                        </Button>
                    </div>
                </div>

                <AggregateDashboard data={aggregateAnalytics} />
            </div>
        )
    }

    // Compare View
    if (currentView === 'compare' && compareAnalytics) {
        return (
            <div className="container mx-auto py-6 space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleBackToSelector}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">⚖️ So Sánh Kênh</h1>
                            <p className="text-sm text-muted-foreground">
                                So sánh {compareAnalytics.channels?.length || 0} kênh
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="7days">7 ngày</option>
                            <option value="30days">30 ngày</option>
                            <option value="90days">90 ngày</option>
                        </select>
                        <Button variant="outline" onClick={fetchCompareAnalytics}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                        </Button>
                        <Button variant="outline" onClick={() => exportCompareCSV(compareAnalytics)}>
                            Export CSV
                        </Button>
                    </div>
                </div>

                <CompareDashboard data={compareAnalytics} />
            </div>
        )
    }

    if (currentView === 'branch' && branchAnalytics) {
        const branchName = branches.find(b => b._id === selectedBranchId)?.name || 'Chi nhánh'
        return (
            <div className="container mx-auto py-6 space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleBackToSelector}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">🏢 {branchName}</h1>
                            <p className="text-sm text-muted-foreground">Tổng hợp analytics theo chi nhánh</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="7days">7 ngày</option>
                            <option value="30days">30 ngày</option>
                            <option value="90days">90 ngày</option>
                        </select>
                        <Button variant="outline" onClick={() => fetchBranchAnalytics(selectedBranchId)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                        </Button>
                        <Button variant="outline" onClick={() => exportAggregateCSV(branchAnalytics, 'branch.csv')}>
                            Export CSV
                        </Button>
                    </div>
                </div>
                <AggregateDashboard data={branchAnalytics} title="📊 Analytics Chi Nhánh" />
            </div>
        )
    }

    if (currentView === 'team' && teamAnalytics) {
        const teamName = teams.find(t => t._id === selectedTeamId)?.name || 'Team'
        return (
            <div className="container mx-auto py-6 space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleBackToSelector}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">👥 {teamName}</h1>
                            <p className="text-sm text-muted-foreground">Tổng hợp analytics theo đội nhóm</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as DateRangeType)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="7days">7 ngày</option>
                            <option value="30days">30 ngày</option>
                            <option value="90days">90 ngày</option>
                        </select>
                        <Button variant="outline" onClick={() => fetchTeamAnalytics(selectedTeamId)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Làm mới
                        </Button>
                        <Button variant="outline" onClick={() => exportAggregateCSV(teamAnalytics, 'team.csv')}>
                            Export CSV
                        </Button>
                    </div>
                </div>
                <AggregateDashboard data={teamAnalytics} title="📊 Analytics Nhóm" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <Alert>
                <AlertDescription>
                    Không có dữ liệu để hiển thị.
                </AlertDescription>
            </Alert>
        </div>
    )
}