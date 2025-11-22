// src/pages/examples/team/team-management.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Building2,
    Users,
    Youtube,
    Eye,
    ChevronDown,
    ChevronRight,
    Plus,
    Search,
    UserCog,
    Edit,
    Video,
    BarChart3,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SiteHeader } from './components/site-header'

interface User {
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
    isConnected: boolean
    customUrl?: string
    thumbnail?: string
}

interface Team {
    _id: string
    name: string
    description: string
    leader: User
    members: User[]
    channels: Channel[]
    isActive: boolean
    createdAt: string
}

interface Branch {
    _id: string
    name: string
    code: string
    description: string
    director: User
    teams: Team[]
    totalChannels: number
    totalTeams: number
    isActive: boolean
    createdAt: string
}

interface Stats {
    totalBranches: number
    totalTeams: number
    totalChannels: number
    totalUsers: number
}

export default function TeamManagement() {
    const navigate = useNavigate()
    const [branches, setBranches] = useState<Branch[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set())
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken')

            const response = await axios.get('http://localhost:3000/api/dashboard/overview', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log('✅ API Response:', response.data)

            const branchesData = response.data.branches || []
            console.log('📦 Branches:', branchesData)

            setBranches(branchesData)

            // Calculate stats từ dữ liệu thực tế
            const calculatedStats = {
                totalBranches: branchesData.length,

                // Đếm tổng số teams
                totalTeams: branchesData.reduce((sum: number, branch: Branch) => {
                    return sum + (branch.teams?.length || 0)
                }, 0),

                // Đếm tổng số channels từ tất cả teams
                totalChannels: branchesData.reduce((sum: number, branch: Branch) => {
                    const branchChannels = branch.teams?.reduce((teamSum: number, team: Team) => {
                        return teamSum + (team.channels?.length || 0)
                    }, 0) || 0
                    return sum + branchChannels
                }, 0),

                // Lấy từ API hoặc để 0
                totalUsers: response.data.stats?.totalUsers ||
                    response.data.totalStats?.totalUsers ||
                    0
            }

            console.log('📊 Calculated Stats:', calculatedStats)

            // Log chi tiết từng branch để debug
            branchesData.forEach((branch: Branch, index: number) => {
                console.log(`Branch ${index + 1}: ${branch.name}`, {
                    teams: branch.teams?.length || 0,
                    channels: branch.teams?.reduce((sum: number, t: Team) => sum + (t.channels?.length || 0), 0) || 0
                })
            })

            setStats(calculatedStats)

        } catch (error: any) {
            console.error('❌ Error fetching data:', error)
            console.error('Error details:', error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    const toggleBranch = (branchId: string) => {
        const newExpanded = new Set(expandedBranches)
        if (newExpanded.has(branchId)) {
            newExpanded.delete(branchId)
        } else {
            newExpanded.add(branchId)
        }
        setExpandedBranches(newExpanded)
    }

    const toggleTeam = (teamId: string) => {
        const newExpanded = new Set(expandedTeams)
        if (newExpanded.has(teamId)) {
            newExpanded.delete(teamId)
        } else {
            newExpanded.add(teamId)
        }
        setExpandedTeams(newExpanded)
    }

    const formatNumber = (num?: number) => {
        if (!num) return '—'
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toLocaleString()
    }

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.director?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader onBranchAdded={fetchData} />
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-24 bg-slate-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen ">
            <SiteHeader
                onBranchAdded={fetchData}
                onTeamAdded={fetchData}
            />

            {/* Stats Cards Section */}
            <div className="bg-white border-b px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Chi Nhánh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                        {stats?.totalBranches || branches.length}
                                    </p>
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
                                    <p className="text-sm font-medium text-slate-500">Tổng Nhóm</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                        {stats?.totalTeams || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Tổng Kênh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                        {stats?.totalChannels || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Tổng Người Dùng</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                        {stats?.totalUsers || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <UserCog className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Cấu Trúc Tổ Chức</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Tìm kiếm chi nhánh, nhóm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-80"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredBranches.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p>Không tìm thấy chi nhánh nào</p>
                                </div>
                            ) : (
                                filteredBranches.map((branch) => (
                                    <div key={branch._id} className="border rounded-lg overflow-hidden">
                                        {/* Branch Header */}
                                        <div
                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 flex items-center justify-between hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-pointer"
                                            onClick={() => toggleBranch(branch._id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {expandedBranches.has(branch._id) ? (
                                                    <ChevronDown className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-blue-600" />
                                                )}
                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                        {branch.name}
                                                        <Badge variant="outline" className="bg-white">
                                                            {branch.code}
                                                        </Badge>
                                                        {branch.isActive && (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                                                Hoạt động
                                                            </Badge>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">{branch.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-left">
                                                    <p className="text-xs text-slate-500">Giám Đốc Chi Nhánh</p>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {branch.director?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{branch.director?.email}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-green-600">
                                                            {branch.totalTeams || branch.teams?.length || 0}
                                                        </p>
                                                        <p className="text-xs text-slate-500">Nhóm</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-red-600">
                                                            {branch.totalChannels || 0}
                                                        </p>
                                                        <p className="text-xs text-slate-500">Kênh</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Branch Content */}
                                        {expandedBranches.has(branch._id) && (
                                            <div className="bg-white p-6">
                                                {branch.teams && branch.teams.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {branch.teams.map((team) => (
                                                            <div
                                                                key={team._id}
                                                                className="border border-slate-200 rounded-lg overflow-hidden"
                                                            >
                                                                {/* Team content - giữ nguyên như code cũ */}
                                                                {/* ... */}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-slate-500">
                                                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                        <p>Chi nhánh chưa có nhóm nào</p>
                                                        <Button className="mt-4" variant="outline" size="sm">
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Thêm Nhóm Mới
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}