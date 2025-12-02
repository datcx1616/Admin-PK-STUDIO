import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { extractData } from "@/lib/api-utils"
import {
    BarChart3,
    RefreshCw,
    ArrowLeft,
    Loader2,
    TrendingUp,
    Users,
    Eye,
    Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        email: string
    }
    members?: Array<{
        _id: string
        name: string
        email: string
        role: string
    }>
    channelsCount?: number
    totalSubscribers?: number
    totalViews?: number
}

interface Editor {
    _id: string
    name: string
    email: string
    role: string
    team?: {
        _id: string
        name: string
    }
    branch?: {
        _id: string
        name: string
    }
    assignedChannels?: Array<{
        _id: string
        name: string
        subscriberCount: number
    }>
    totalChannels?: number
    totalSubscribers?: number
    totalViews?: number
}

interface Channel {
    _id: string
    name: string
    youtubeChannelId: string
    customUrl?: string
    thumbnailUrl?: string
    subscriberCount: number
    viewCount: number
    videoCount: number
    isConnected: boolean
    channelType?: 'Personal' | 'Brand'
    team?: {
        _id: string
        name: string
    }
    branch?: {
        _id: string
        name: string
    }
    assignedTo?: Array<{
        user: {
            _id: string
            name: string
            email: string
        }
        assignedAt: string
    }>
    statistics?: {
        views: number
        watchTimeMinutes: number
        watchTimeHours: string
        subscribersGained: number
        subscribersLost: number
        subscribersNet: number
        estimatedRevenue?: number
        averageViewDuration?: number
    }
    lastSync?: string
}

// Component
export default function AnalyticsManagementPage() {
    const [activeView, setActiveView] = useState<'hierarchy' | 'analytics'>('hierarchy')
    const [selectedBranch, setSelectedBranch] = useState<string>("")
    const [selectedTeam, setSelectedTeam] = useState<string>("")
    const [selectedEditor, setSelectedEditor] = useState<string>("")
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

    // Data states
    const [branches, setBranches] = useState<Branch[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [editors, setEditors] = useState<Editor[]>([])
    const [channels, setChannels] = useState<Channel[]>([])

    // Analytics states
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
    const [dateRange, setDateRange] = useState<DateRangeType>('30days')

    // UI states
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<'all' | 'connected' | 'disconnected'>('all')

    const { toast } = useToast()

    // Fetch all data on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            toast({
                title: "Chưa đăng nhập",
                description: "Vui lòng đăng nhập để xem dữ liệu",
                variant: "destructive"
            })
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
            return
        }
        fetchAllData()
    }, [])

    // Fetch analytics when channel is selected
    useEffect(() => {
        if (selectedChannel && selectedChannel.isConnected) {
            fetchAnalytics()
        }
    }, [selectedChannel, dateRange])

    // Debug: Log state changes
    useEffect(() => {
        console.log('📊 State updated:', {
            branches: branches.length,
            teams: teams.length,
            editors: editors.length,
            channels: channels.length,
            selectedChannel: selectedChannel?.name,
            analytics: analytics ? 'loaded' : 'null'
        })
    }, [branches, teams, editors, channels, selectedChannel, analytics])

    // Debug helper: Expose to window for console testing
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).debugAnalytics = {
                fetchAnalytics,
                selectedChannel,
                analytics,
                channels,
                apiClient
            }
            console.log('🔧 Debug helper available: window.debugAnalytics')
        }
    }, [selectedChannel, analytics, channels])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                fetchBranches(),
                fetchTeams(),
                fetchEditors(),
                fetchChannels()
            ])
        } catch (error) {
            console.error('Error fetching data:', error)
            toast({
                title: "Lỗi",
                description: "Không thể tải dữ liệu. Vui lòng thử lại.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchBranches = async () => {
        try {
            console.log('🔄 Fetching branches...')
            const response = await apiClient.getBranches()
            console.log('✅ Branches API response (full):', response)
            console.log('📦 Response type:', typeof response)
            console.log('📦 Response.data:', response?.data)
            console.log('📦 Response.data type:', typeof response?.data)

            // Try different extraction methods
            const branchesData = extractData<Branch>(response, 'branches')
            console.log('📊 Extracted branches count:', branchesData.length)
            console.log('📊 Extracted branches:', branchesData)

            setBranches(branchesData)

            if (branchesData.length === 0) {
                console.warn('⚠️ No branches found')
                console.log('🔍 Trying alternative extraction...')

                // Debug: try manual extraction
                if (response?.data?.branches) {
                    console.log('🔍 Found in response.data.branches:', response.data.branches)
                    setBranches(response.data.branches)
                } else if (response?.branches) {
                    console.log('🔍 Found in response.branches:', response.branches)
                    setBranches(response.branches)
                } else if (Array.isArray(response?.data)) {
                    console.log('🔍 Found in response.data (array):', response.data)
                    setBranches(response.data)
                } else if (Array.isArray(response)) {
                    console.log('🔍 Found in response (array):', response)
                    setBranches(response)
                }
            } else {
                console.log('✅ Branches loaded:', branchesData.map(b => b.name))
            }
        } catch (error: any) {
            console.error('❌ Error fetching branches:', error)
            toast({
                title: "Lỗi tải dữ liệu",
                description: `Không thể tải chi nhánh: ${error.message}`,
                variant: "destructive"
            })
        }
    }

    const fetchTeams = async () => {
        try {
            console.log('🔄 Fetching teams...')
            const response = await apiClient.getTeams()
            console.log('✅ Teams API response (full):', response)
            console.log('📦 Response.data:', response?.data)
            console.log('📦 Response.success:', response?.success)

            const teamsData = extractData<Team>(response, 'teams')
            console.log('📊 Extracted teams count:', teamsData.length)
            console.log('📊 Extracted teams (full):', teamsData)

            // Log first team to check structure
            if (teamsData.length > 0) {
                console.log('📊 First team structure:', {
                    name: teamsData[0].name,
                    branch: teamsData[0].branch,
                    leader: teamsData[0].leader,
                    manager: (teamsData[0] as any).manager,
                    members: teamsData[0].members,
                    channelsCount: (teamsData[0] as any).channelsCount
                })
            }

            setTeams(teamsData)

            if (teamsData.length > 0) {
                console.log('✅ Teams loaded:', teamsData.map(t => `${t.name} (branch: ${t.branch?.name || 'N/A'})`))
            } else {
                console.warn('⚠️ No teams found')
                // Try alternative extraction
                if (response?.data?.data) {
                    console.log('🔍 Found in response.data.data:', response.data.data)
                    setTeams(Array.isArray(response.data.data) ? response.data.data : [])
                }
            }
        } catch (error: any) {
            console.error('❌ Error fetching teams:', error)
            toast({
                title: "Lỗi tải dữ liệu",
                description: `Không thể tải nhóm: ${error.message}`,
                variant: "destructive"
            })
        }
    }

    const fetchEditors = async () => {
        try {
            console.log('🔄 Fetching editors...')
            const response = await apiClient.getUsers({ role: 'editor' })
            console.log('✅ Editors API response (full):', response)
            console.log('📦 Response.data:', response?.data)

            const editorsData = extractData<Editor>(response, 'users')
            console.log('📊 Extracted editors count:', editorsData.length)
            console.log('📊 Extracted editors:', editorsData)

            setEditors(editorsData)

            if (editorsData.length > 0) {
                console.log('✅ Editors loaded:', editorsData.map(e => e.name))
            } else {
                console.warn('⚠️ No editors found')
                // Try alternative extraction
                if (response?.data?.data) {
                    console.log('🔍 Found in response.data.data:', response.data.data)
                    setEditors(Array.isArray(response.data.data) ? response.data.data : [])
                }
            }
        } catch (error: any) {
            console.error('❌ Error fetching editors:', error)
            toast({
                title: "Lỗi tải dữ liệu",
                description: `Không thể tải editors: ${error.message}`,
                variant: "destructive"
            })
        }
    }

    const fetchChannels = async () => {
        try {
            console.log('🔄 Fetching channels...')
            const response = await apiClient.getChannelsForAnalytics()
            console.log('✅ Channels API response (full):', response)
            console.log('📦 Response.data:', response?.data)

            const channelsData = extractData<Channel>(response, 'channels')
            console.log('📊 Extracted channels count:', channelsData.length)
            console.log('📊 Extracted channels:', channelsData)

            setChannels(channelsData)

            if (channelsData.length > 0) {
                console.log('✅ Channels loaded:', channelsData.map(c => `${c.name} (${c.isConnected ? 'Connected' : 'Not connected'})`))
            } else {
                console.warn('⚠️ No channels found')
                // Try alternative extraction
                if (response?.data?.data) {
                    console.log('🔍 Found in response.data.data:', response.data.data)
                    setChannels(Array.isArray(response.data.data) ? response.data.data : [])
                }
            }
        } catch (error: any) {
            console.error('❌ Error fetching channels:', error)
            toast({
                title: "Lỗi tải dữ liệu",
                description: `Không thể tải kênh: ${error.message}`,
                variant: "destructive"
            })
        }
    }

    const fetchAnalytics = async () => {
        if (!selectedChannel || !selectedChannel.isConnected) {
            console.warn('⚠️ Cannot fetch analytics: channel not selected or not connected')
            return
        }

        setRefreshing(true)
        try {
            const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90
            const endDate = new Date().toISOString().split('T')[0]
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

            console.log('📊 Fetching analytics for:', {
                channelId: selectedChannel._id,
                channelName: selectedChannel.name,
                startDate,
                endDate,
                dateRange
            })

            const response = await apiClient.getYouTubeAnalytics({
                channelId: selectedChannel._id,
                startDate,
                endDate,
                include: 'all'
            })

            console.log('✅ Analytics API response (full):', response)
            console.log('📦 Response type:', typeof response)
            console.log('📦 Response.success:', response?.success)
            console.log('📦 Response.basic:', response?.basic)
            console.log('📦 Response.engagement:', response?.engagement)
            console.log('📦 Response.revenue:', response?.revenue)

            if (response?.success) {
                console.log('✅ Setting analytics data')
                setAnalytics(response)
            } else {
                console.warn('⚠️ Response success is false or undefined')
                // Try setting anyway if we have data
                if (response?.basic || response?.engagement || response?.revenue) {
                    console.log('🔧 Setting analytics data anyway (has partial data)')
                    setAnalytics(response)
                } else {
                    console.error('❌ No analytics data in response')
                }
            }
        } catch (error: any) {
            console.error('❌ Error fetching analytics:', error)
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status
            })
            toast({
                title: "Lỗi",
                description: "Không thể tải dữ liệu analytics. " + (error.message || ''),
                variant: "destructive"
            })
        } finally {
            setRefreshing(false)
        }
    }

    const syncChannel = async (_channelId: string) => {
        try {
            // Note: sync endpoint might need to be added to api-client if it exists
            toast({
                title: "Thông báo",
                description: "Chức năng đồng bộ đang được phát triển",
            })
            // TODO: Implement sync when backend endpoint is ready
            // await apiClient.syncChannel(_channelId)
            // fetchChannels()
        } catch (error: any) {
            toast({
                title: "Lỗi",
                description: `Không thể đồng bộ kênh: ${error.message}`,
                variant: "destructive"
            })
        }
    }

    // Filter functions
    const filteredTeams = teams.filter(team => {
        if (selectedBranch && team.branch._id !== selectedBranch) return false
        if (searchQuery) {
            return team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.description.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    const filteredEditors = editors.filter(editor => {
        if (selectedBranch && editor.branch?._id !== selectedBranch) return false
        if (selectedTeam && editor.team?._id !== selectedTeam) return false
        if (searchQuery) {
            return editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                editor.email.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    const filteredChannels = channels.filter(channel => {
        if (selectedBranch && channel.branch?._id !== selectedBranch) return false
        if (selectedTeam && channel.team?._id !== selectedTeam) return false
        if (selectedEditor) {
            const isAssigned = channel.assignedTo?.some(a => a.user._id === selectedEditor)
            if (!isAssigned) return false
        }
        if (filterType === 'connected' && !channel.isConnected) return false
        if (filterType === 'disconnected' && channel.isConnected) return false
        if (searchQuery) {
            return channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                channel.customUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                channel.youtubeChannelId.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    // Calculate stats
    const stats = {
        totalBranches: branches.length,
        totalTeams: teams.length,
        totalEditors: editors.length,
        totalChannels: channels.length,
        connectedChannels: channels.filter(c => c.isConnected).length,
        totalSubscribers: channels.reduce((sum, c) => sum + c.subscriberCount, 0),
        totalViews: channels.reduce((sum, c) => sum + c.viewCount, 0),
        totalVideos: channels.reduce((sum, c) => sum + c.videoCount, 0)
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid gap-4 md:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-96" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Quản lý và Phân tích YouTube</h1>
                            <p className="text-muted-foreground">Quản lý phân cấp: Chi nhánh → Nhóm → Editor → Kênh</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setActiveView(activeView === 'hierarchy' ? 'analytics' : 'hierarchy')}
                            >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                {activeView === 'hierarchy' ? 'Xem Analytics' : 'Xem Quản lý'}
                            </Button>
                            <Button onClick={fetchAllData} disabled={refreshing}>
                                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="container mx-auto px-6 py-6">
                {loading && (
                    <Alert className="mb-4">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <AlertTitle>Đang tải dữ liệu...</AlertTitle>
                        <AlertDescription>Vui lòng đợi trong giây lát</AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Chi nhánh</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {stats.totalBranches}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Nhóm</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {stats.totalTeams}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Editors</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {stats.totalEditors}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Kênh</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {stats.totalChannels}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Đã kết nối</CardDescription>
                            <CardTitle className="text-2xl font-bold text-green-600">
                                {stats.connectedChannels}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Subscribers</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {(stats.totalSubscribers / 1000000).toFixed(1)}M
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Views</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {(stats.totalViews / 1000000).toFixed(1)}M
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs">Videos</CardDescription>
                            <CardTitle className="text-2xl font-bold">
                                {stats.totalVideos.toLocaleString()}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 pb-6">
                {activeView === 'hierarchy' ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Quản lý phân cấp</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 w-64"
                                        />
                                    </div>
                                    <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả kênh</SelectItem>
                                            <SelectItem value="connected">Đã kết nối</SelectItem>
                                            <SelectItem value="disconnected">Chưa kết nối</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="branches" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="branches">Chi nhánh</TabsTrigger>
                                    <TabsTrigger value="teams">Nhóm</TabsTrigger>
                                    <TabsTrigger value="editors">Editors</TabsTrigger>
                                    <TabsTrigger value="channels">Kênh</TabsTrigger>
                                </TabsList>

                                {/* Branches Tab */}
                                <TabsContent value="branches" className="space-y-4">
                                    {branches.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-lg font-medium mb-2">Không có chi nhánh nào</p>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Dữ liệu đã được seed. Vui lòng đăng nhập lại để tải dữ liệu.
                                            </p>
                                            <div className="flex gap-2 justify-center">
                                                <Button onClick={fetchAllData} variant="outline">
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Thử lại
                                                </Button>
                                                <Button onClick={() => window.location.href = '/login'}>
                                                    Đăng nhập lại
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {branches.map((branch) => (
                                                <Card
                                                    key={branch._id}
                                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedBranch === branch._id ? 'ring-2 ring-primary' : ''
                                                        }`}
                                                    onClick={() => setSelectedBranch(branch._id === selectedBranch ? '' : branch._id)}
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <CardTitle className="text-lg flex items-center gap-2">
                                                                    <Building2 className="h-5 w-5" />
                                                                    {branch.name}
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    {branch.code} • {branch.location}
                                                                </CardDescription>
                                                            </div>
                                                            <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                                                                {branch.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground mb-4">{branch.description}</p>

                                                        {branch.director && (
                                                            <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                                                                <p className="text-xs text-muted-foreground mb-1">Giám đốc chi nhánh</p>
                                                                <p className="text-sm font-medium">{branch.director.name}</p>
                                                                <p className="text-xs text-muted-foreground">{branch.director.email}</p>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4 text-center">
                                                            <div className="p-3 bg-secondary/30 rounded-lg">
                                                                <p className="text-2xl font-bold">{branch.teamsCount || 0}</p>
                                                                <p className="text-xs text-muted-foreground">Nhóm</p>
                                                            </div>
                                                            <div className="p-3 bg-secondary/30 rounded-lg">
                                                                <p className="text-2xl font-bold">{branch.channelsCount || 0}</p>
                                                                <p className="text-xs text-muted-foreground">Kênh</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Teams Tab */}
                                <TabsContent value="teams">
                                    {filteredTeams.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">Không có nhóm nào</p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {selectedBranch ? 'Chi nhánh này chưa có nhóm' : 'Chưa có nhóm nào trong hệ thống'}
                                            </p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tên nhóm</TableHead>
                                                    <TableHead>Chi nhánh</TableHead>
                                                    <TableHead>Quản lý</TableHead>
                                                    <TableHead>Thành viên</TableHead>
                                                    <TableHead>Kênh</TableHead>
                                                    <TableHead>Subscribers</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredTeams.map((team) => (
                                                    <TableRow
                                                        key={team._id}
                                                        className={`cursor-pointer ${selectedTeam === team._id ? 'bg-secondary/50' : ''}`}
                                                        onClick={() => setSelectedTeam(team._id === selectedTeam ? '' : team._id)}
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <div>
                                                                    <p className="font-medium">{team.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{team.description}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {team.branch ? (
                                                                <Badge variant="outline">{team.branch.name || team.branch.code || 'N/A'}</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">Chưa có</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {team.leader ? (
                                                                <div>
                                                                    <p className="text-sm font-medium">{team.leader.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{team.leader.email}</p>
                                                                </div>
                                                            ) : team.manager ? (
                                                                <div>
                                                                    <p className="text-sm font-medium">{team.manager.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{team.manager.email}</p>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">Chưa có</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{team.members?.length || 0}</TableCell>
                                                        <TableCell>{team.channelsCount || 0}</TableCell>
                                                        <TableCell>
                                                            {team.totalSubscribers ? (
                                                                <span className="font-medium">
                                                                    {team.totalSubscribers.toLocaleString()}
                                                                </span>
                                                            ) : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Settings className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                                                                    <DropdownMenuItem>Quản lý thành viên</DropdownMenuItem>
                                                                    <DropdownMenuItem>Phân công kênh</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </TabsContent>

                                {/* Editors Tab */}
                                <TabsContent value="editors">
                                    {filteredEditors.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">Không có editor nào</p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {selectedBranch || selectedTeam ? 'Không có editor trong bộ lọc này' : 'Chưa có editor nào trong hệ thống'}
                                            </p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Editor</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Nhóm</TableHead>
                                                    <TableHead>Chi nhánh</TableHead>
                                                    <TableHead>Kênh phụ trách</TableHead>
                                                    <TableHead>Tổng Subscribers</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredEditors.map((editor) => (
                                                    <TableRow
                                                        key={editor._id}
                                                        className={`cursor-pointer ${selectedEditor === editor._id ? 'bg-secondary/50' : ''}`}
                                                        onClick={() => setSelectedEditor(editor._id === selectedEditor ? '' : editor._id)}
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>{editor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium">{editor.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {editor.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editor.team ? (
                                                                <Badge variant="outline">{editor.team.name}</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editor.branch ? (
                                                                <Badge variant="secondary">{editor.branch.name}</Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{editor.totalChannels || 0}</span>
                                                                <span className="text-muted-foreground">kênh</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {editor.totalSubscribers ? (
                                                                <span className="font-medium">
                                                                    {editor.totalSubscribers.toLocaleString()}
                                                                </span>
                                                            ) : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="sm">
                                                                Phân công
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </TabsContent>

                                {/* Channels Tab */}
                                <TabsContent value="channels">
                                    {filteredChannels.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Youtube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">Không có kênh nào</p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {selectedBranch || selectedTeam || selectedEditor
                                                    ? 'Không có kênh nào trong bộ lọc này'
                                                    : filterType === 'connected'
                                                        ? 'Chưa có kênh nào được kết nối'
                                                        : filterType === 'disconnected'
                                                            ? 'Tất cả kênh đã được kết nối'
                                                            : 'Chưa có kênh nào trong hệ thống'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {filteredChannels.map((channel) => (
                                                <Card
                                                    key={channel._id}
                                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedChannel?._id === channel._id ? 'ring-2 ring-primary' : ''
                                                        }`}
                                                    onClick={() => setSelectedChannel(channel)}
                                                >
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                                                                <AvatarFallback>{channel.name.substring(0, 2)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <CardTitle className="text-base truncate">{channel.name}</CardTitle>
                                                                <CardDescription className="text-xs">
                                                                    {channel.customUrl || channel.youtubeChannelId}
                                                                </CardDescription>
                                                                <div className="flex gap-2 mt-2">
                                                                    <Badge variant={channel.isConnected ? 'default' : 'secondary'} className="text-xs">
                                                                        {channel.isConnected ? (
                                                                            <>
                                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                                Đã kết nối
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <XCircle className="mr-1 h-3 w-3" />
                                                                                Chưa kết nối
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                    {channel.channelType && (
                                                                        <Badge
                                                                            variant={channel.channelType === 'Brand' ? 'outline' : 'default'}
                                                                            className="text-xs"
                                                                        >
                                                                            {channel.channelType}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {/* Channel Stats */}
                                                        <div className="grid grid-cols-3 gap-2 text-center">
                                                            <div className="p-2 bg-secondary/30 rounded-lg">
                                                                <p className="text-xs text-muted-foreground">Subscribers</p>
                                                                <p className="text-sm font-bold">
                                                                    {channel.subscriberCount >= 1000000
                                                                        ? `${(channel.subscriberCount / 1000000).toFixed(1)}M`
                                                                        : channel.subscriberCount >= 1000
                                                                            ? `${(channel.subscriberCount / 1000).toFixed(1)}K`
                                                                            : channel.subscriberCount}
                                                                </p>
                                                            </div>
                                                            <div className="p-2 bg-secondary/30 rounded-lg">
                                                                <p className="text-xs text-muted-foreground">Views</p>
                                                                <p className="text-sm font-bold">
                                                                    {channel.viewCount >= 1000000
                                                                        ? `${(channel.viewCount / 1000000).toFixed(1)}M`
                                                                        : channel.viewCount >= 1000
                                                                            ? `${(channel.viewCount / 1000).toFixed(1)}K`
                                                                            : channel.viewCount}
                                                                </p>
                                                            </div>
                                                            <div className="p-2 bg-secondary/30 rounded-lg">
                                                                <p className="text-xs text-muted-foreground">Videos</p>
                                                                <p className="text-sm font-bold">{channel.videoCount}</p>
                                                            </div>
                                                        </div>

                                                        {/* Team & Branch */}
                                                        <div className="space-y-1">
                                                            {channel.team && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Nhóm: <span className="font-medium text-foreground">{channel.team.name}</span>
                                                                </p>
                                                            )}
                                                            {channel.branch && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Chi nhánh: <span className="font-medium text-foreground">{channel.branch.name}</span>
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Assigned Editors */}
                                                        {channel.assignedTo && channel.assignedTo.length > 0 && (
                                                            <div className="pt-2 border-t">
                                                                <p className="text-xs font-medium mb-2">Editors được phân công:</p>
                                                                <div className="space-y-1">
                                                                    {channel.assignedTo.slice(0, 2).map((assignment) => (
                                                                        <div key={assignment.user._id} className="flex items-center gap-2">
                                                                            <Avatar className="h-5 w-5">
                                                                                <AvatarFallback className="text-xs">
                                                                                    {assignment.user.name.substring(0, 2).toUpperCase()}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <span className="text-xs">{assignment.user.name}</span>
                                                                        </div>
                                                                    ))}
                                                                    {channel.assignedTo.length > 2 && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            +{channel.assignedTo.length - 2} người khác
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Actions */}
                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setActiveView('analytics')
                                                                }}
                                                            >
                                                                <BarChart3 className="mr-1 h-3 w-3" />
                                                                Analytics
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    syncChannel(channel._id)
                                                                }}
                                                            >
                                                                <RefreshCw className="mr-1 h-3 w-3" />
                                                                Đồng bộ
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                ) : (
                    // Analytics View
                    <div className="space-y-6">
                        {selectedChannel ? (
                            <>
                                {/* Channel Info Header */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={selectedChannel.thumbnailUrl} alt={selectedChannel.name} />
                                                    <AvatarFallback>{selectedChannel.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h2 className="text-2xl font-bold">{selectedChannel.name}</h2>
                                                    <p className="text-muted-foreground">{selectedChannel.customUrl}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant={selectedChannel.isConnected ? 'default' : 'secondary'}>
                                                            {selectedChannel.isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                                                        </Badge>
                                                        {selectedChannel.channelType && (
                                                            <Badge variant="outline">{selectedChannel.channelType} Channel</Badge>
                                                        )}
                                                        {selectedChannel.team && (
                                                            <Badge variant="secondary">{selectedChannel.team.name}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Select value={dateRange} onValueChange={(v: DateRangeType) => setDateRange(v)}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="7days">7 ngày</SelectItem>
                                                        <SelectItem value="30days">30 ngày</SelectItem>
                                                        <SelectItem value="90days">90 ngày</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button onClick={() => fetchAnalytics()} disabled={refreshing}>
                                                    <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                                    Làm mới
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>

                                {/* Analytics Content */}
                                {selectedChannel.isConnected ? (
                                    refreshing ? (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                                                <p className="text-lg font-medium mb-2">Đang tải dữ liệu analytics...</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vui lòng đợi trong giây lát
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : analytics ? (
                                        <div className="space-y-6">
                                            {/* Debug info */}
                                            {!analytics.basic && (
                                                <Alert>
                                                    <AlertTitle>Thông báo</AlertTitle>
                                                    <AlertDescription>
                                                        Dữ liệu analytics chưa đầy đủ. Vui lòng thử lại sau.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {/* Overview Cards */}
                                            {analytics.basic && <OverviewCards analytics={analytics} />}

                                            {/* Subscriber Growth & Engagement */}
                                            {analytics.basic && (
                                                <div className="grid gap-6 lg:grid-cols-2">
                                                    <SubscriberGrowth analytics={analytics} />
                                                    <EngagementCards analytics={analytics} />
                                                </div>
                                            )}

                                            {/* Audience Retention & CTR Metrics */}
                                            {analytics.retention && (
                                                <AudienceCards analytics={analytics} />
                                            )}

                                            {/* Revenue Section */}
                                            {analytics.revenue && (
                                                <RevenueCards analytics={analytics} dateRange={dateRange} />
                                            )}

                                            {/* Traffic & Device Analytics */}
                                            {(analytics.traffic || analytics.devices) && (
                                                <div className="grid gap-6 lg:grid-cols-2">
                                                    {analytics.traffic && <TrafficSources analytics={analytics} />}
                                                    {analytics.devices && <DeviceTypes analytics={analytics} />}
                                                </div>
                                            )}

                                            {/* Demographics */}
                                            {analytics.demographics && (
                                                <Demographics analytics={analytics} />
                                            )}

                                            {/* Top Videos */}
                                            {analytics.videos && (
                                                <TopVideos analytics={analytics} />
                                            )}
                                        </div>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-12 text-center">
                                                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-lg font-medium mb-2">
                                                    {selectedChannel.channelType === 'Brand'
                                                        ? 'Analytics không khả dụng cho Brand Channel'
                                                        : 'Chưa có dữ liệu analytics'}
                                                </p>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    {selectedChannel.channelType === 'Brand'
                                                        ? 'Chỉ Personal Channel mới có thể xem analytics từ YouTube'
                                                        : 'Nhấn nút "Làm mới" để tải dữ liệu'}
                                                </p>
                                                {selectedChannel.channelType !== 'Brand' && (
                                                    <Button onClick={() => fetchAnalytics()}>
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Tải dữ liệu
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )
                                ) :
                                    (
                                        <Alert className="flex items-start gap-2">
                                            <div className="text-red-500">!</div>
                                            <div>
                                                <AlertTitle>Kênh chưa được kết nối</AlertTitle>
                                                <AlertDescription>
                                                    Kênh này chưa được kết nối với YouTube. Vui lòng kết nối kênh để xem analytics.
                                                </AlertDescription>
                                            </div>
                                        </Alert>
                                    )
                                }
                            </>
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-lg font-medium mb-2">Chọn một kênh để xem analytics</p>
                                    <p className="text-sm text-muted-foreground">
                                        Vui lòng chọn kênh từ tab Quản lý để xem chi tiết analytics
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setActiveView('hierarchy')}
                                    >
                                        Quay lại Quản lý
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
