// src/pages/examples/channel/components/youtube-channels-list.tsx
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { youtubeApi } from '@/lib/youtubeApi'
import {
    Eye, Users, Video, Edit, Trash2, UserPlus,
    Search, Filter, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, Building2, Users2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ChannelAssignment } from '../../analytics/components/channel-assignment'

interface Channel {
    _id: string
    id: string
    channelId: string
    name: string
    channelTitle: string
    thumbnail: string
    thumbnailUrl?: string
    connectedAt: string
    subscriberCount?: number
    viewCount?: number
    videoCount?: number
    customUrl?: string
    team?: {
        _id: string
        name: string
        branch?: {
            _id: string
            name: string
            code: string
        }
    }
    assignedTo?: Array<{
        user: {
            _id: string
            name: string
            email: string
            role: string
        }
        role: string
        assignedAt: string
    }>
    isConnected?: boolean
}

interface ApiResponse {
    success: boolean
    data: Channel[]
    count: number
    message: string
}

interface Branch {
    _id: string
    name: string
    code: string
}

interface Team {
    _id: string
    name: string
    branch: Branch
}

export function YouTubeChannelsList() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchingStats, setFetchingStats] = useState(false)
    const navigate = useNavigate()

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBranch, setSelectedBranch] = useState<string>('all')
    const [selectedTeam, setSelectedTeam] = useState<string>('all')
    const [branches, setBranches] = useState<Branch[]>([])
    const [teams, setTeams] = useState<Team[]>([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    // Assignment Dialog
    const [selectedChannel, setSelectedChannel] = useState<any>(null)
    const [isAssignmentOpen, setIsAssignmentOpen] = useState(false)

    useEffect(() => {
        fetchChannels()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [channels, searchQuery, selectedBranch, selectedTeam, currentPage, pageSize])

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('No auth token found')
                setLoading(false)
                return
            }

            // Sử dụng API mới: GET /api/channels/my-channels
            const response = await axios.get<ApiResponse>(
                'http://localhost:3000/api/channels/my-channels',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            if (response.data.success && response.data.data) {
                console.log('📊 Fetched channels:', response.data.data)
                console.log('📋 Channel assignments:', response.data.data.map((c: Channel) => ({
                    _id: c._id || c.id,
                    name: c.name || c.channelTitle,
                    assignedCount: c.assignedTo?.length || 0,
                    editorCount: c.assignedTo?.filter(a => a.role === 'editor').length || 0,
                    assignedTo: c.assignedTo
                })))
                setChannels(response.data.data)

                // Extract unique branches and teams
                const uniqueBranches = new Map<string, Branch>()
                const uniqueTeams = new Map<string, Team>()

                response.data.data.forEach(channel => {
                    if (channel.team?.branch) {
                        uniqueBranches.set(channel.team.branch._id, channel.team.branch)
                        uniqueTeams.set(channel.team._id, {
                            _id: channel.team._id,
                            name: channel.team.name,
                            branch: channel.team.branch
                        })
                    }
                })

                setBranches(Array.from(uniqueBranches.values()))
                setTeams(Array.from(uniqueTeams.values()))
            }
        } catch (error) {
            console.error('Error fetching channels:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...channels]

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(channel => {
                const channelName = (channel.name || channel.channelTitle).toLowerCase()
                const teamName = channel.team?.name.toLowerCase() || ''
                const branchName = channel.team?.branch?.name.toLowerCase() || ''
                const query = searchQuery.toLowerCase()

                return channelName.includes(query) ||
                    teamName.includes(query) ||
                    branchName.includes(query)
            })
        }

        // Branch filter
        if (selectedBranch !== 'all') {
            filtered = filtered.filter(channel =>
                channel.team?.branch?._id === selectedBranch
            )
        }

        // Team filter
        if (selectedTeam !== 'all') {
            filtered = filtered.filter(channel =>
                channel.team?._id === selectedTeam
            )
        }

        // Calculate pagination
        const total = Math.ceil(filtered.length / pageSize)
        setTotalPages(total)

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginated = filtered.slice(startIndex, endIndex)

        setFilteredChannels(paginated)
    }

    const handleManageEditors = (channelId: string) => {
        const channel = channels.find(c => (c._id || c.id) === channelId)
        if (channel) {
            // Convert channel to match ChannelAssignment interface
            const assignmentChannel: any = {
                _id: channel._id || channel.id,
                name: channel.name || channel.channelTitle,
                youtubeChannelId: channel.channelId,
                customUrl: channel.customUrl,
                thumbnailUrl: channel.thumbnailUrl || channel.thumbnail,
                subscriberCount: channel.subscriberCount || 0,
                viewCount: channel.viewCount || 0,
                videoCount: channel.videoCount || 0,
                isConnected: channel.isConnected || false,
                team: channel.team,
                assignedTo: channel.assignedTo
            }
            setSelectedChannel(assignmentChannel)
            setIsAssignmentOpen(true)
        }
    }

    const handleEditChannel = (channelId: string) => {
        console.log('Edit channel:', channelId)
    }

    const handleDeleteChannel = (channelId: string) => {
        console.log('Delete channel:', channelId)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (size: string) => {
        setPageSize(parseInt(size))
        setCurrentPage(1)
    }

    // Get teams filtered by selected branch
    const filteredTeams = selectedBranch === 'all'
        ? teams
        : teams.filter(team => team.branch._id === selectedBranch)

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (channels.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            ✓
                        </div>
                        Kênh đã gán team (0)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <Video className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">
                                    Chưa có kênh nào được gán
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Kết nối YouTube hoặc được phân công kênh từ quản lý
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full space-y-4">
            {/* Header with Stats */}
            <Card>
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            Quản lý Kênh YouTube
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{branches.length} Chi nhánh</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users2 className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">{teams.length} Teams</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-red-600" />
                                <span className="font-medium">{channels.length} Kênh</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Filters */}
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* Search */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Tìm kiếm kênh, team, chi nhánh..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Branch Filter */}
                        <Select value={selectedBranch} onValueChange={(value) => {
                            setSelectedBranch(value)
                            setSelectedTeam('all')
                            setCurrentPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn chi nhánh" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                {branches.map(branch => (
                                    <SelectItem key={branch._id} value={branch._id}>
                                        {branch.code} - {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Team Filter */}
                        <Select
                            value={selectedTeam}
                            onValueChange={(value) => {
                                setSelectedTeam(value)
                                setCurrentPage(1)
                            }}
                            disabled={selectedBranch !== 'all' && filteredTeams.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả teams</SelectItem>
                                {filteredTeams.map(team => (
                                    <SelectItem key={team._id} value={team._id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="font-semibold text-slate-700 w-[250px]">Kênh</TableHead>
                                    <TableHead className="font-semibold text-slate-700 w-[150px]">Chi nhánh</TableHead>
                                    <TableHead className="font-semibold text-slate-700 w-[150px]">Team</TableHead>
                                    <TableHead className="font-semibold text-slate-700 w-[130px]">Editors</TableHead>
                                    <TableHead className="font-semibold text-slate-700 w-[120px]">Subscribers</TableHead>
                                    <TableHead className="font-semibold text-slate-700 w-[100px]">Videos</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right w-[100px]">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredChannels.map((channel) => {
                                    const channelName = channel.name || channel.channelTitle
                                    const channelThumbnail = channel.thumbnailUrl || channel.thumbnail
                                    const channelHandle = channel.customUrl
                                    const editorCount = channel.assignedTo?.filter(a => a.role === 'editor').length || 0

                                    return (
                                        <TableRow key={channel._id || channel.id} className="hover:bg-slate-50">
                                            {/* Kênh */}
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-slate-200 flex-shrink-0">
                                                        <AvatarImage src={channelThumbnail} alt={channelName} />
                                                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xs">
                                                            {channelName.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-slate-900 truncate text-sm">
                                                            {channelName}
                                                        </p>
                                                        {channelHandle && (
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {channelHandle}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Chi nhánh */}
                                            <TableCell>
                                                {channel.team?.branch ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs w-fit"
                                                        >
                                                            {channel.team.branch.code}
                                                        </Badge>
                                                        <span className="text-xs text-slate-600 truncate">
                                                            {channel.team.branch.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">N/A</span>
                                                )}
                                            </TableCell>

                                            {/* Team */}
                                            <TableCell>
                                                {channel.team ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-purple-50 text-purple-700 border-purple-200 font-medium text-xs"
                                                    >
                                                        {channel.team.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Chưa gán</span>
                                                )}
                                            </TableCell>

                                            {/* Editors */}
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={editorCount > 0 ? "default" : "outline"}
                                                        className={`${editorCount > 0
                                                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                            : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                                                            } cursor-pointer text-xs font-medium`}
                                                        onClick={() => handleManageEditors(channel._id || channel.id)}
                                                    >
                                                        {editorCount > 0
                                                            ? `${editorCount} editor${editorCount !== 1 ? 's' : ''}`
                                                            : 'Chưa gán'
                                                        }
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 hover:bg-slate-100"
                                                        onClick={() => handleManageEditors(channel._id || channel.id)}
                                                        title="Phân công editor"
                                                    >
                                                        <UserPlus className="h-3 w-3 text-slate-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>

                                            {/* Subscribers */}
                                            <TableCell>
                                                {fetchingStats && !channel.subscriberCount ? (
                                                    <Skeleton className="h-4 w-16" />
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="font-semibold text-slate-900 text-sm">
                                                            {channel.subscriberCount !== undefined
                                                                ? formatNumber(channel.subscriberCount)
                                                                : '—'
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Videos */}
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Video className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="font-semibold text-slate-900 text-sm">
                                                        {channel.videoCount !== undefined
                                                            ? formatNumber(channel.videoCount)
                                                            : '—'
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Hành động */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                                                        onClick={() => handleEditChannel(channel._id || channel.id)}
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => handleDeleteChannel(channel._id || channel.id)}
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredChannels.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            {/* Rows per page */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">Hiển thị</span>
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-[70px] h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-slate-600">
                                    trên {channels.length} kênh
                                </span>
                            </div>

                            {/* Page info and controls */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No results */}
                    {filteredChannels.length === 0 && channels.length > 0 && (
                        <div className="text-center py-12">
                            <Filter className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Không tìm thấy kết quả
                            </h3>
                            <p className="text-sm text-slate-500">
                                Thử thay đổi bộ lọc hoặc tìm kiếm
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assignment Dialog */}
            <ChannelAssignment
                channel={selectedChannel}
                isOpen={isAssignmentOpen}
                onClose={() => {
                    setIsAssignmentOpen(false)
                    setSelectedChannel(null)
                }}
                onUpdate={() => {
                    fetchChannels()
                }}
            />
        </div>
    )
}

// Helper function to format numbers
function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toLocaleString()
}
