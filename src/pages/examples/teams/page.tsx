import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Building2, Users, Youtube, User, Plus, Search, ChevronDown, ChevronRight,
    Eye, ChevronLeft, ChevronRight as ChevronRightIcon, ChevronsLeft, ChevronsRight,
    MoreVertical, Edit, Trash2, UserPlus, BarChart3
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'
import { SiteHeader } from './components/site-header'

interface Member {
    _id: string
    name: string
    email: string
    role: string
}

interface Channel {
    _id: string
    name: string
    youtubeChannelId: string
    subscriberCount?: number
    viewCount?: number
    videoCount?: number
    thumbnailUrl?: string
    isConnected: boolean
}

interface Team {
    _id: string
    name: string
    description: string
    leader?: Member
    members?: Member[]
    channels?: Channel[]
    isActive: boolean
}

interface Branch {
    _id: string
    name: string
    code: string
    description: string
    director?: Member
    teams?: Team[]
    totalChannels?: number
    totalTeams?: number
    isActive: boolean
}

interface Stats {
    totalBranches: number
    totalTeams: number
    totalChannels: number
    totalUsers: number
}

export default function TeamManagement() {
    const [branches, setBranches] = useState<Branch[]>([])
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBranch, setSelectedBranch] = useState<string>('all')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    // Expanded states
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())

    // Active tab
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [branches, searchQuery, selectedBranch, currentPage, pageSize])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken')

            const [branchesRes, teamsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:3000/api/branches', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/teams', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('http://localhost:3000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ])

            const branchesData = branchesRes.data.branches || branchesRes.data.data || []
            const teamsData = teamsRes.data.teams || teamsRes.data.data || []
            const usersData = usersRes.data.users || usersRes.data.data || []

            const branchesWithTeams = branchesData.map(branch => {
                const branchTeams = teamsData.filter(team => {
                    const teamBranchId = typeof team.branch === 'object' ? team.branch?._id : team.branch
                    return teamBranchId === branch._id
                })

                const populatedTeams = branchTeams.map(team => {
                    const leaderId = typeof team.leader === 'object' ? team.leader?._id : team.leader
                    const leader = usersData.find(user => user._id === leaderId)

                    let members = []
                    if (team.members && Array.isArray(team.members)) {
                        members = team.members
                            .map(member => {
                                const memberId = typeof member === 'object' ? member._id : member
                                return usersData.find(user => user._id === memberId)
                            })
                            .filter(Boolean)
                    }

                    const channels = Array.isArray(team.channels) ? team.channels : []

                    return { ...team, leader, members, channels }
                })

                return { ...branch, teams: populatedTeams }
            })

            setBranches(branchesWithTeams)

            setStats({
                totalBranches: branchesData.length,
                totalTeams: teamsData.length,
                totalChannels: teamsData.reduce((sum, t) => sum + (t.channels?.length || 0), 0),
                totalUsers: usersData.length
            })

        } catch (error: any) {
            console.error('❌ Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...branches]

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(branch => {
                const branchMatch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    branch.code.toLowerCase().includes(searchQuery.toLowerCase())

                const teamMatch = branch.teams?.some(team =>
                    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team.members?.some(member => member.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    team.channels?.some(channel => channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
                )

                return branchMatch || teamMatch
            })
        }

        // Branch filter
        if (selectedBranch !== 'all') {
            filtered = filtered.filter(branch => branch._id === selectedBranch)
        }

        // Calculate pagination
        const total = Math.ceil(filtered.length / pageSize)
        setTotalPages(total)

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginated = filtered.slice(startIndex, endIndex)

        setFilteredBranches(paginated)
    }

    const toggleTeam = (teamId: string) => {
        setExpandedTeams(prev => {
            const newSet = new Set(prev)
            if (newSet.has(teamId)) {
                newSet.delete(teamId)
            } else {
                newSet.add(teamId)
            }
            return newSet
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    // Calculate stats
    const totalTeams = branches.reduce((sum, branch) => sum + (branch.teams?.length || 0), 0)
    const totalEditors = branches.reduce((sum, branch) =>
        sum + (branch.teams?.reduce((teamSum, team) => teamSum + (team.members?.length || 0), 0) || 0), 0)
    const totalChannels = branches.reduce((sum, branch) =>
        sum + (branch.teams?.reduce((teamSum, team) => teamSum + (team.channels?.length || 0), 0) || 0), 0)

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader onBranchAdded={fetchData} onTeamAdded={fetchData} />
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-slate-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader onBranchAdded={fetchData} onTeamAdded={fetchData} />

            {/* Header Stats */}
            <div className="bg-white border-b px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Chi nhánh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{branches.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Teams</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalTeams}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Editors</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalEditors}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Kênh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalChannels}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="px-6 pt-6">
                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Quản lý Chi nhánh</CardTitle>
                            {/* <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm Chi nhánh
                            </Button> */}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Search */}
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm chi nhánh, team, editor, kênh..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="pl-9"
                                />
                            </div>

                            {/* Branch Filter */}
                            <Select value={selectedBranch} onValueChange={(value) => {
                                setSelectedBranch(value)
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
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="table">Bảng chi tiết</TabsTrigger>
                    </TabsList>

                    {/* Tab: Overview (Card Grid) */}
                    <TabsContent value="overview" className="space-y-4 mt-6">
                        {filteredBranches.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-12 text-slate-500">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p>Không tìm thấy chi nhánh nào</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredBranches.map((branch) => (
                                <Card key={branch._id} className="overflow-hidden">
                                    {/* Branch Header */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-white text-lg">{branch.name}</span>
                                                        <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-0">
                                                            {branch.code}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-white/80 mt-0.5">{branch.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right text-white hidden md:block">
                                                    <div className="text-xs opacity-80">Giám đốc</div>
                                                    <div className="text-sm font-medium">{branch.director?.name || 'Chưa có'}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <BarChart3 className="h-4 w-4 mr-2" />
                                                            Thống kê
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Branch Stats */}
                                        <div className="flex items-center gap-6 mt-3 text-white/90 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-4 w-4" />
                                                <span>{branch.teams?.length || 0} teams</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    {branch.teams?.reduce((sum, team) => sum + (team.members?.length || 0), 0) || 0} editors
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Youtube className="h-4 w-4" />
                                                <span>
                                                    {branch.teams?.reduce((sum, team) => sum + (team.channels?.length || 0), 0) || 0} kênh
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Teams List */}
                                    <CardContent className="p-0">
                                        {branch.teams && branch.teams.length > 0 ? (
                                            <div className="divide-y">
                                                {branch.teams.map((team) => (
                                                    <div key={team._id}>
                                                        {/* Team Row */}
                                                        <div
                                                            className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between"
                                                            onClick={() => toggleTeam(team._id)}
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                {expandedTeams.has(team._id) ? (
                                                                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                )}
                                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <Users className="w-4 h-4 text-green-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-slate-900">{team.name}</div>
                                                                    <div className="text-xs text-slate-500 truncate">{team.description}</div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="hidden md:flex items-center gap-2">
                                                                    <span className="text-xs text-slate-500">Trưởng nhóm:</span>
                                                                    <span className="text-sm font-medium text-slate-700">
                                                                        {team.leader?.name || 'Chưa có'}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                                                        {team.members?.length || 0} editors
                                                                    </Badge>
                                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                                                        {team.channels?.length || 0} kênh
                                                                    </Badge>
                                                                </div>

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem>
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            Xem chi tiết
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <UserPlus className="h-4 w-4 mr-2" />
                                                                            Thêm editor
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Chỉnh sửa
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Xóa
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>

                                                        {/* Expanded Content */}
                                                        {expandedTeams.has(team._id) && (
                                                            <div className="border-t bg-slate-50/50 p-4">
                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                    {/* Editors */}
                                                                    <div>
                                                                        <div className="text-xs font-semibold text-slate-600 mb-3 flex items-center justify-between">
                                                                            <div className="flex items-center gap-1">
                                                                                <User className="w-3 h-3" />
                                                                                EDITORS ({team.members?.length || 0})
                                                                            </div>
                                                                            <Button size="sm" variant="ghost" className="h-6 text-xs">
                                                                                <Plus className="h-3 w-3 mr-1" />
                                                                                Thêm
                                                                            </Button>
                                                                        </div>
                                                                        {team.members && team.members.length > 0 ? (
                                                                            <div className="space-y-2">
                                                                                {team.members.slice(0, 5).map((member) => (
                                                                                    <div
                                                                                        key={member._id}
                                                                                        className="flex items-center gap-2 p-2 bg-white rounded border"
                                                                                    >
                                                                                        <Avatar className="h-8 w-8">
                                                                                            <AvatarFallback className="bg-orange-500 text-white text-xs">
                                                                                                {member.name.substring(0, 2).toUpperCase()}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="text-sm font-medium text-slate-900 truncate">
                                                                                                {member.name}
                                                                                            </div>
                                                                                            <div className="text-xs text-slate-500 truncate">
                                                                                                {member.email}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                {team.members.length > 5 && (
                                                                                    <Button variant="ghost" size="sm" className="w-full text-xs">
                                                                                        Xem thêm {team.members.length - 5} editors
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-center py-4 bg-white rounded border-2 border-dashed text-slate-400 text-xs">
                                                                                Chưa có editor
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Channels */}
                                                                    <div>
                                                                        <div className="text-xs font-semibold text-slate-600 mb-3 flex items-center justify-between">
                                                                            <div className="flex items-center gap-1">
                                                                                <Youtube className="w-3 h-3" />
                                                                                KÊNH YOUTUBE ({team.channels?.length || 0})
                                                                            </div>
                                                                            <Button size="sm" variant="ghost" className="h-6 text-xs">
                                                                                <Plus className="h-3 w-3 mr-1" />
                                                                                Thêm
                                                                            </Button>
                                                                        </div>
                                                                        {team.channels && team.channels.length > 0 ? (
                                                                            <div className="space-y-2">
                                                                                {team.channels.slice(0, 5).map((channel) => (
                                                                                    <div
                                                                                        key={channel._id}
                                                                                        className="flex items-center justify-between p-2 bg-white rounded border"
                                                                                    >
                                                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                                                <Youtube className="w-4 h-4 text-white" />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <div className="text-sm font-medium text-slate-900 truncate">
                                                                                                    {channel.name}
                                                                                                </div>
                                                                                                {channel.subscriberCount && (
                                                                                                    <div className="text-xs text-slate-500">
                                                                                                        {formatNumber(channel.subscriberCount)} subs
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <Badge
                                                                                            variant="outline"
                                                                                            className={
                                                                                                channel.isConnected
                                                                                                    ? "bg-green-50 text-green-700 border-green-200 text-xs"
                                                                                                    : "bg-slate-100 text-slate-600 border-slate-200 text-xs"
                                                                                            }
                                                                                        >
                                                                                            {channel.isConnected ? '✓ Kết nối' : 'Chưa kết nối'}
                                                                                        </Badge>
                                                                                    </div>
                                                                                ))}
                                                                                {team.channels.length > 5 && (
                                                                                    <Button variant="ghost" size="sm" className="w-full text-xs">
                                                                                        Xem thêm {team.channels.length - 5} kênh
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-center py-4 bg-white rounded border-2 border-dashed text-slate-400 text-xs">
                                                                                Chưa có kênh
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6">
                                                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed">
                                                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                                    <p className="text-sm font-medium text-slate-600 mb-1">Chưa có team</p>
                                                    <p className="text-xs text-slate-500 mb-3">Thêm team để bắt đầu quản lý</p>
                                                    <Button className="bg-green-600 hover:bg-green-700 text-xs h-8" size="sm">
                                                        <Plus className="w-3 h-3 mr-1" />
                                                        Thêm Team
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}

                        {/* Pagination */}
                        {filteredBranches.length > 0 && totalPages > 1 && (
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-600">Hiển thị</span>
                                            <Select value={pageSize.toString()} onValueChange={(value) => {
                                                setPageSize(parseInt(value))
                                                setCurrentPage(1)
                                            }}>
                                                <SelectTrigger className="w-[70px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5</SelectItem>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="25">25</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <span className="text-sm text-slate-600">
                                                trên {branches.length} chi nhánh
                                            </span>
                                        </div>

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
                                                    <ChevronRightIcon className="h-4 w-4" />
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
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Tab: Table View */}
                    <TabsContent value="table" className="mt-6">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-semibold">Chi nhánh</TableHead>
                                            <TableHead className="font-semibold">Giám đốc</TableHead>
                                            <TableHead className="font-semibold">Teams</TableHead>
                                            <TableHead className="font-semibold">Editors</TableHead>
                                            <TableHead className="font-semibold">Kênh</TableHead>
                                            <TableHead className="font-semibold text-right">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBranches.map(branch => (
                                            <TableRow key={branch._id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium">{branch.name}</div>
                                                            <Badge variant="outline" className="text-xs">{branch.code}</Badge>
                                                        </div>
                                                        <div className="text-xs text-slate-500">{branch.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{branch.director?.name || '—'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{branch.teams?.length || 0}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {branch.teams?.reduce((sum, team) => sum + (team.members?.length || 0), 0) || 0}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {branch.teams?.reduce((sum, team) => sum + (team.channels?.length || 0), 0) || 0}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
