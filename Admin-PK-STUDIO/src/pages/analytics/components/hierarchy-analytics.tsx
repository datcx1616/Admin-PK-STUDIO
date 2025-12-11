import React, { useState, useEffect } from "react"
import axios from "@/lib/axios-instance"
import {
    Building2,
    Users,
    BarChart3,
    ArrowUp,
    ArrowDown,
    Download,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    BarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useToast } from "@/hooks/use-toast"

interface BranchAnalytics {
    branch: {
        _id: string
        name: string
        code: string
    }
    summary: {
        totalTeams: number
        totalChannels: number
        connectedChannels: number
        totalEditors: number
        totalSubscribers: number
        totalViews: number
        totalVideos: number
    }
    performance: {
        viewsGrowth: number
        subscribersGrowth: number
        revenueGrowth: number
        averageEngagement: number
    }
    topChannels: Array<{
        _id: string
        name: string
        subscriberCount: number
        viewCount: number
        growth: number
    }>
    teamBreakdown: Array<{
        teamId: string
        teamName: string
        channelCount: number
        subscriberCount: number
        viewCount: number
        revenue?: number
    }>
}

interface TeamAnalytics {
    team: {
        _id: string
        name: string
        branch: string
    }
    summary: {
        totalChannels: number
        connectedChannels: number
        totalEditors: number
        totalSubscribers: number
        totalViews: number
        totalVideos: number
        averageVideoPerChannel: number
    }
    performance: {
        last30Days: {
            views: number
            watchTimeHours: number
            subscribersGained: number
            revenue?: number
        }
        growth: {
            viewsChange: number
            subscribersChange: number
            revenueChange: number
        }
    }
    channelPerformance: Array<{
        channelId: string
        channelName: string
        views: number
        watchTime: number
        subscribers: number
        engagement: number
        revenue?: number
    }>
    editorPerformance: Array<{
        editorId: string
        editorName: string
        channelCount: number
        totalViews: number
        totalSubscribers: number
        productivity: number
    }>
}

interface HierarchyAnalyticsProps {
    selectedBranchId?: string
    selectedTeamId?: string
    dateRange: string
}

export function HierarchyAnalytics({ selectedBranchId, selectedTeamId, dateRange }: HierarchyAnalyticsProps) {
    const [branchAnalytics, setBranchAnalytics] = useState<BranchAnalytics | null>(null)
    const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'channels' | 'trends'>('overview')

    const { toast } = useToast()

    useEffect(() => {
        if (selectedBranchId) {
            fetchBranchAnalytics()
        }
        if (selectedTeamId) {
            fetchTeamAnalytics()
        }
    }, [selectedBranchId, selectedTeamId, dateRange])

    const fetchBranchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/api/branches/${selectedBranchId}/analytics?dateRange=${dateRange}`
            )
            setBranchAnalytics(response.data)
        } catch (error) {
            console.error('Error fetching branch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTeamAnalytics = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/api/teams/${selectedTeamId}/analytics?dateRange=${dateRange}`
            )
            setTeamAnalytics(response.data)
        } catch (error) {
            console.error('Error fetching team analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportData = () => {
        toast({
            title: "Xuất dữ liệu",
            description: "Tính năng đang được phát triển",
        })
    }

    // Chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

    if (selectedBranchId && branchAnalytics) {
        return (
            <div className="space-y-6">
                {/* Branch Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Building2 className="h-6 w-6" />
                            Phân tích chi nhánh: {branchAnalytics.branch.name}
                        </h2>
                        <p className="text-muted-foreground">Mã chi nhánh: {branchAnalytics.branch.code}</p>
                    </div>
                    <Button onClick={exportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất báo cáo
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tổng nhóm</CardDescription>
                            <CardTitle className="text-3xl">{branchAnalytics.summary.totalTeams}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {branchAnalytics.summary.totalEditors} editors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tổng kênh</CardDescription>
                            <CardTitle className="text-3xl">{branchAnalytics.summary.totalChannels}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                value={(branchAnalytics.summary.connectedChannels / branchAnalytics.summary.totalChannels) * 100}
                                className="h-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {branchAnalytics.summary.connectedChannels} đã kết nối
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tổng Subscribers</CardDescription>
                            <CardTitle className="text-3xl">
                                {(branchAnalytics.summary.totalSubscribers / 1000000).toFixed(1)}M
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs">
                                {branchAnalytics.performance.subscribersGrowth > 0 ? (
                                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                                )}
                                <span className={branchAnalytics.performance.subscribersGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {Math.abs(branchAnalytics.performance.subscribersGrowth)}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Tổng Views</CardDescription>
                            <CardTitle className="text-3xl">
                                {(branchAnalytics.summary.totalViews / 1000000).toFixed(1)}M
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs">
                                {branchAnalytics.performance.viewsGrowth > 0 ? (
                                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                                )}
                                <span className={branchAnalytics.performance.viewsGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {Math.abs(branchAnalytics.performance.viewsGrowth)}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                    <TabsList>
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="teams">Phân tích nhóm</TabsTrigger>
                        <TabsTrigger value="channels">Top kênh</TabsTrigger>
                        <TabsTrigger value="trends">Xu hướng</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        {/* Team Performance Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất theo nhóm</CardTitle>
                                <CardDescription>So sánh hiệu suất giữa các nhóm</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={branchAnalytics.teamBreakdown}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="teamName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="subscriberCount" fill="#8884d8" name="Subscribers" />
                                        <Bar dataKey="viewCount" fill="#82ca9d" name="Views" />
                                        {branchAnalytics.teamBreakdown[0]?.revenue && (
                                            <Bar dataKey="revenue" fill="#ffc658" name="Revenue ($)" />
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Channel Distribution */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phân bố kênh theo nhóm</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <RePieChart>
                                            <Pie
                                                data={branchAnalytics.teamBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="channelCount"
                                                label={(entry) => `${entry.teamName}: ${entry.channelCount}`}
                                            >
                                                {branchAnalytics.teamBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Thống kê hiệu suất</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Tăng trưởng views</span>
                                            <span className="text-sm font-bold">
                                                {branchAnalytics.performance.viewsGrowth > 0 ? '+' : ''}
                                                {branchAnalytics.performance.viewsGrowth}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.abs(branchAnalytics.performance.viewsGrowth)}
                                            className="h-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Tăng trưởng subscribers</span>
                                            <span className="text-sm font-bold">
                                                {branchAnalytics.performance.subscribersGrowth > 0 ? '+' : ''}
                                                {branchAnalytics.performance.subscribersGrowth}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={Math.abs(branchAnalytics.performance.subscribersGrowth)}
                                            className="h-2"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Engagement trung bình</span>
                                            <span className="text-sm font-bold">
                                                {branchAnalytics.performance.averageEngagement}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={branchAnalytics.performance.averageEngagement}
                                            className="h-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="teams">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên nhóm</TableHead>
                                    <TableHead className="text-right">Số kênh</TableHead>
                                    <TableHead className="text-right">Subscribers</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">Hiệu suất</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branchAnalytics.teamBreakdown.map((team) => (
                                    <TableRow key={team.teamId}>
                                        <TableCell className="font-medium">{team.teamName}</TableCell>
                                        <TableCell className="text-right">{team.channelCount}</TableCell>
                                        <TableCell className="text-right">
                                            {(team.subscriberCount / 1000).toFixed(1)}K
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(team.viewCount / 1000).toFixed(1)}K
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {team.revenue ? `$${team.revenue.toFixed(2)}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="font-mono">
                                                {((team.viewCount / team.subscriberCount) * 100).toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="channels">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top kênh theo hiệu suất</CardTitle>
                                <CardDescription>Kênh có tăng trưởng tốt nhất trong chi nhánh</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {branchAnalytics.topChannels.map((channel, index) => (
                                        <div key={channel._id} className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{channel.name}</p>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <span>{(channel.subscriberCount / 1000).toFixed(1)}K subs</span>
                                                    <span>{(channel.viewCount / 1000).toFixed(1)}K views</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center text-sm font-medium ${channel.growth > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {channel.growth > 0 ? (
                                                        <ArrowUp className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <ArrowDown className="h-4 w-4 mr-1" />
                                                    )}
                                                    {Math.abs(channel.growth)}%
                                                </div>
                                                <p className="text-xs text-muted-foreground">Tăng trưởng</p>
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

    if (selectedTeamId && teamAnalytics) {
        return (
            <div className="space-y-6">
                {/* Team Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Phân tích nhóm: {teamAnalytics.team.name}
                        </h2>
                    </div>
                    <Button onClick={exportData}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất báo cáo
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Kênh quản lý</CardDescription>
                            <CardTitle className="text-3xl">{teamAnalytics.summary.totalChannels}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                value={(teamAnalytics.summary.connectedChannels / teamAnalytics.summary.totalChannels) * 100}
                                className="h-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {teamAnalytics.summary.connectedChannels} đã kết nối
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Editors</CardDescription>
                            <CardTitle className="text-3xl">{teamAnalytics.summary.totalEditors}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                {(teamAnalytics.summary.totalChannels / teamAnalytics.summary.totalEditors).toFixed(1)} kênh/người
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Views (30 ngày)</CardDescription>
                            <CardTitle className="text-3xl">
                                {(teamAnalytics.performance.last30Days.views / 1000).toFixed(1)}K
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-xs">
                                {teamAnalytics.performance.growth.viewsChange > 0 ? (
                                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                                )}
                                <span className={teamAnalytics.performance.growth.viewsChange > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {Math.abs(teamAnalytics.performance.growth.viewsChange)}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Watch Time</CardDescription>
                            <CardTitle className="text-3xl">
                                {teamAnalytics.performance.last30Days.watchTimeHours.toFixed(0)}h
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Avg {teamAnalytics.summary.averageVideoPerChannel} videos/channel
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Tables */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hiệu suất kênh</CardTitle>
                            <CardDescription>Chi tiết theo từng kênh</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kênh</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-right">Engagement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamAnalytics.channelPerformance.map((channel) => (
                                        <TableRow key={channel.channelId}>
                                            <TableCell className="font-medium">{channel.channelName}</TableCell>
                                            <TableCell className="text-right">
                                                {(channel.views / 1000).toFixed(1)}K
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline">{channel.engagement}%</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hiệu suất Editor</CardTitle>
                            <CardDescription>Đánh giá năng suất làm việc</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Editor</TableHead>
                                        <TableHead className="text-right">Kênh</TableHead>
                                        <TableHead className="text-right">Năng suất</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamAnalytics.editorPerformance.map((editor) => (
                                        <TableRow key={editor.editorId}>
                                            <TableCell className="font-medium">{editor.editorName}</TableCell>
                                            <TableCell className="text-right">{editor.channelCount}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={editor.productivity > 80 ? 'default' : 'secondary'}
                                                >
                                                    {editor.productivity}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Chọn chi nhánh hoặc nhóm để xem phân tích</p>
                <p className="text-sm text-muted-foreground">
                    Vui lòng chọn từ danh sách bên trái để xem báo cáo chi tiết
                </p>
            </CardContent>
        </Card>
    )
}
