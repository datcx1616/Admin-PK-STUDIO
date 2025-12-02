import { IconTrendingUp, IconUsers, IconBuildingCommunity, IconBrandYoutube, IconEye, IconUser, IconUserCheck, IconChecks } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import axios from "axios"

interface AdminStatsResponse {
    success: boolean
    data: {
        overview: {
            totalUsers: number
            totalBranches: number
            totalTeams: number
            totalChannels: number
            connectedChannels: number
            unassignedChannels: number
        }
        usersByRole: {
            admin: number
            director: number
            branch_director: number
            manager: number
            leader: number
            editor: number
        }
        youtubeMetrics: {
            totalSubscribers: number
            totalViews: number
            totalVideos: number
        }
        branchesWithTeams: Array<{
            _id: string
            name: string
            code: string
            teamCount: number
        }>
    }
}

interface SectionCardsProps {
    stats?: {
        totalBranches?: number
        totalTeams?: number
        totalChannels?: number
        totalUsers?: number
        totalSubscribers?: number
        totalViews?: number
        totalVideos?: number
        isConnected?: boolean
        [key: string]: any
    }
}

// Hàm format số với dấu phẩy
const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num)
}

// Hàm format số dạng rút gọn (K, M, B)
const formatCompactNumber = (num: number): string => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

export function SectionCards({ stats: propStats }: SectionCardsProps) {
    const [adminStats, setAdminStats] = useState<AdminStatsResponse['data'] | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAdminStats()
    }, [])

    const fetchAdminStats = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.log('No auth token, using prop stats')
                setLoading(false)
                return
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
            const response = await axios.get<AdminStatsResponse>(
                `${API_URL}/dashboard/admin-stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            if (response.data.success) {
                setAdminStats(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error)
            // Fallback to prop stats if API fails
        } finally {
            setLoading(false)
        }
    }

    // Merge API stats with prop stats (API takes priority)
    const stats = adminStats ? {
        totalUsers: adminStats.overview.totalUsers,
        totalBranches: adminStats.overview.totalBranches,
        totalTeams: adminStats.overview.totalTeams,
        totalChannels: adminStats.overview.totalChannels,
        connectedChannels: adminStats.overview.connectedChannels,
        unassignedChannels: adminStats.overview.unassignedChannels,
        totalSubscribers: adminStats.youtubeMetrics.totalSubscribers,
        totalViews: adminStats.youtubeMetrics.totalViews,
        totalVideos: adminStats.youtubeMetrics.totalVideos,
        usersByRole: adminStats.usersByRole,
    } : {
        totalUsers: propStats?.totalUsers || 0,
        totalBranches: propStats?.totalBranches || 0,
        totalTeams: propStats?.totalTeams || 0,
        totalChannels: propStats?.totalChannels || 0,
        connectedChannels: propStats?.isConnected ? propStats.totalChannels : 0,
        unassignedChannels: 0,
        totalSubscribers: propStats?.totalSubscribers || 0,
        totalViews: propStats?.totalViews || 0,
        totalVideos: propStats?.totalVideos || 0,
        usersByRole: null,
    }

    return (
        <div className="space-y-4">
            {/* Row 1: Tổng quan hệ thống */}
            <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {/* Tổng Users */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Tổng Users</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.totalUsers)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconUser className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Tất cả người dùng <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Chi nhánh */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Chi nhánh</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.totalBranches)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconBuildingCommunity className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Đang hoạt động <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Teams */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Teams</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.totalTeams)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconUsers className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Đang hoạt động <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Kênh */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Kênh</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.totalChannels)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconBrandYoutube className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Đã kết nối: {stats.connectedChannels} <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Row 2: YouTube Metrics */}
            <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {/* Total Views */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Tổng Views</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatCompactNumber(stats.totalViews)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconEye className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Từ YouTube API <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Total Subscribers */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Tổng Subscribers</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatCompactNumber(stats.totalSubscribers)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconUserCheck className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Tổng subscribers <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Total Videos */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Tổng Videos</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.totalVideos)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconBrandYoutube className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Tổng video <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>

                {/* Unassigned Channels */}
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Kênh chưa gán</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {formatNumber(stats.unassignedChannels)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconChecks className="size-4" />
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Chưa gán team <IconTrendingUp className="size-4" />
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Row 3: Phân bổ Users theo Role (chỉ hiện khi có data) */}
            {stats.usersByRole && (
                <div className="px-4 lg:px-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <IconUsers className="size-5" />
                                Phân bổ Users theo Role
                            </CardTitle>
                        </CardHeader>
                        <div className="p-6 pt-0">
                            <div className="grid grid-cols-2 gap-4 @xl/main:grid-cols-3 @5xl/main:grid-cols-5">
                                {/* Admin */}
                                <Card className="@container/card">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs">Admin</CardDescription>
                                        <CardTitle className="text-3xl font-bold tabular-nums">
                                            {stats.usersByRole.admin}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>

                                {/* Director */}
                                <Card className="@container/card">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs">Director</CardDescription>
                                        <CardTitle className="text-3xl font-bold tabular-nums">
                                            {stats.usersByRole.director}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>

                                {/* Branch Director */}
                                <Card className="@container/card">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs">Branch Director</CardDescription>
                                        <CardTitle className="text-3xl font-bold tabular-nums">
                                            {stats.usersByRole.branch_director}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>

                                {/* Manager/Leader */}
                                <Card className="@container/card">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs">Manager/Leader</CardDescription>
                                        <CardTitle className="text-3xl font-bold tabular-nums">
                                            {stats.usersByRole.manager}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>

                                {/* Editor */}
                                <Card className="@container/card">
                                    <CardHeader className="pb-3">
                                        <CardDescription className="text-xs">Editor</CardDescription>
                                        <CardTitle className="text-3xl font-bold tabular-nums">
                                            {stats.usersByRole.editor}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Row 4: Chi nhánh và Teams */}
            {adminStats?.branchesWithTeams && adminStats.branchesWithTeams.length > 0 && (
                <div className="px-4 lg:px-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <IconBuildingCommunity className="size-5" />
                                Chi nhánh và Teams
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                                        <TableHead className="font-semibold text-slate-700">Mã</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Tên Chi nhánh</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Số Teams</TableHead>
                                        <TableHead className="font-semibold text-slate-700 text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminStats.branchesWithTeams.map((branch) => (
                                        <TableRow key={branch._id} className="hover:bg-slate-50">
                                            <TableCell className="font-mono text-sm font-medium">
                                                {branch.code}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {branch.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    <IconUsers className="size-3 mr-1" />
                                                    {branch.teamCount} team(s)
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    Chi tiết
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
