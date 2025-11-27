// src/pages/examples/roles/permissions-management.tsx
import { useEffect, useState } from 'react'
import { Users, Crown, Monitor, Edit2, AlertCircle, Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { SiteHeader } from "@/pages/examples/roles/components/site-header"
import axios from 'axios'

interface Branch {
    _id: string
    name: string
    code: string
}

interface Team {
    _id: string
    name: string
}

interface User {
    _id: string
    name: string
    email: string
    role: 'admin' | 'director' | 'branch_director' | 'manager' | 'editor'
    branch?: Branch | string
    team?: Team | string
    isActive: boolean
    createdAt: string
}

const roleConfig = {
    admin: {
        label: 'Tổng Quản',
        color: 'bg-red-100 text-red-700',
        avatarColor: 'bg-red-500'
    },
    director: {
        label: 'Giám Đốc',
        color: 'bg-purple-100 text-purple-700',
        avatarColor: 'bg-purple-500'
    },
    branch_director: {
        label: 'Giám Đốc Chi Nhánh',
        color: 'bg-blue-100 text-blue-700',
        avatarColor: 'bg-blue-500'
    },
    manager: {
        label: 'Quản Lý Team',
        color: 'bg-green-100 text-green-700',
        avatarColor: 'bg-green-500'
    },
    editor: {
        label: 'Editor',
        color: 'bg-orange-100 text-orange-700',
        avatarColor: 'bg-orange-500'
    }
}

const roleDescriptions = [
    {
        title: "Admin / Director",
        color: "border-red-200 bg-red-50",
        icon: AlertCircle,
        iconColor: "text-red-600",
        permissions: [
            "Quản lý toàn bộ hệ thống",
            "Quản lý chi nhánh và phân quyền",
            "Truy cập toàn bộ analytics",
            "Cài đặt hệ thống"
        ]
    },
    {
        title: "Branch Director",
        color: "border-blue-200 bg-blue-50",
        icon: Crown,
        iconColor: "text-blue-600",
        permissions: [
            "Quản lý chi nhánh được giao",
            "Xem dashboard chi nhánh",
            "Quản lý teams trong chi nhánh",
            "Xem analytics chi nhánh"
        ]
    },
    {
        title: "Manager",
        color: "border-green-200 bg-green-50",
        icon: Monitor,
        iconColor: "text-green-600",
        permissions: [
            "Quản lý team được giao",
            "Quản lý kênh trong team",
            "Phân tích kênh team",
            "Kết nối YouTube channels"
        ]
    },
    {
        title: "Editor",
        color: "border-orange-200 bg-orange-50",
        icon: Edit2,
        iconColor: "text-orange-600",
        permissions: [
            "Xem kênh được assign",
            "Xem analytics kênh",
            "Chỉ xem, không chỉnh sửa",
            "Không có quyền quản lý"
        ]
    },
]

export default function PermissionsManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRole, setSelectedRole] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPages, setTotalPages] = useState(1)

    const [stats, setStats] = useState({
        total: 0,
        admin: 0,
        director: 0,
        branch_director: 0,
        manager: 0,
        editor: 0
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [selectedRole, searchQuery, users, currentPage, pageSize])

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken')
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

            const response = await axios.get(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            console.log('✅ Raw API Response:', response.data)

            // Xử lý nhiều format response khác nhau
            let usersData: User[] = []

            if (response.data.users) {
                usersData = response.data.users
            } else if (response.data.data) {
                usersData = response.data.data
            } else if (Array.isArray(response.data)) {
                usersData = response.data
            }

            console.log('✅ Processed users:', usersData)

            setUsers(usersData)

            // Calculate stats
            const newStats = {
                total: usersData.length,
                admin: usersData.filter((u: User) => u.role === 'admin').length,
                director: usersData.filter((u: User) => u.role === 'director').length,
                branch_director: usersData.filter((u: User) => u.role === 'branch_director').length,
                manager: usersData.filter((u: User) => u.role === 'manager').length,
                editor: usersData.filter((u: User) => u.role === 'editor').length
            }
            setStats(newStats)

        } catch (error: any) {
            console.error('❌ Error fetching users:', error)
            console.error('Error details:', error.response?.data)

            if (error.response?.status === 404) {
                alert('⚠️ API endpoint /api/users chưa được tạo hoặc không tồn tại.')
            } else if (error.response?.status === 401) {
                alert('⚠️ Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.')
            } else {
                alert('❌ Lỗi khi tải dữ liệu người dùng: ' + (error.response?.data?.message || error.message))
            }
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = [...users]

        // Filter by role
        if (selectedRole !== 'all') {
            filtered = filtered.filter(u => u.role === selectedRole)
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                (typeof u.branch === 'object' && u.branch?.name.toLowerCase().includes(query)) ||
                (typeof u.team === 'object' && u.team?.name.toLowerCase().includes(query))
            )
        }

        // Calculate pagination
        const total = Math.ceil(filtered.length / pageSize)
        setTotalPages(total)

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginated = filtered.slice(startIndex, endIndex)

        setFilteredUsers(paginated)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getInitials = (name: string) => {
        if (!name) return '??'
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return parts[0][0] + parts[parts.length - 1][0]
        }
        return name.substring(0, 2)
    }

    const getBranchName = (branch: Branch | string | undefined): string => {
        if (!branch) return '-'
        if (typeof branch === 'object' && branch.name) {
            return branch.name
        }
        return '-'
    }

    const getTeamName = (team: Team | string | undefined): string => {
        if (!team) return '-'
        if (typeof team === 'object' && team.name) {
            return team.name
        }
        return '-'
    }

    const getPermissionsText = (user: User) => {
        switch (user.role) {
            case 'admin':
            case 'director':
                return 'Toàn bộ hệ thống'
            case 'branch_director':
                return typeof user.branch === 'object' && user.branch ? `Chi nhánh: ${user.branch.name}` : 'Chưa có chi nhánh'
            case 'manager':
                return typeof user.team === 'object' && user.team ? `Team: ${user.team.name}` : 'Chưa có team'
            case 'editor':
                return typeof user.team === 'object' && user.team ? `Team: ${user.team.name} (Xem only)` : 'Chưa có team'
            default:
                return '-'
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return

        try {
            const token = localStorage.getItem('authToken')
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
            await axios.delete(`${API_URL}/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            alert('✅ Xóa người dùng thành công')
            fetchUsers()
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('❌ Không thể xóa người dùng')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader />
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-24 bg-slate-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    const roleStats = [
        {
            title: "Tổng Người Dùng",
            count: stats.total.toString(),
            icon: Users,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-600"
        },
        {
            title: "Admin & Directors",
            count: (stats.admin + stats.director).toString(),
            icon: Crown,
            iconBg: "bg-red-100",
            iconColor: "text-red-600"
        },
        {
            title: "Branch Directors",
            count: stats.branch_director.toString(),
            icon: Crown,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Managers",
            count: stats.manager.toString(),
            icon: Monitor,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "Editors",
            count: stats.editor.toString(),
            icon: Edit2,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader onUserAdded={fetchUsers} />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 px-6 pt-6">
                {roleStats.map((stat, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow border rounded-xl"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="px-6 py-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm theo tên, email, chi nhánh, team..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="pl-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500"
                                />
                            </div>

                            {/* Role Filter Tabs */}
                            <Tabs value={selectedRole} onValueChange={(value) => {
                                setSelectedRole(value)
                                setCurrentPage(1)
                            }} className="w-full">
                                <TabsList className="bg-slate-100 border rounded-lg grid grid-cols-3 md:grid-cols-6 p-1 gap-1 h-auto">
                                    <TabsTrigger
                                        value="all"
                                        className="data-[state=active]:bg-red-700 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Tất cả
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="admin"
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Admin
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="director"
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Director
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="branch_director"
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Branch Dir
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="manager"
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Manager
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="editor"
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        Editor
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <div className="px-6 pb-6">
                <Card>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b text-sm font-medium text-slate-600">
                            <div className="col-span-3">NGƯỜI DÙNG</div>
                            <div className="col-span-2">VAI TRÒ</div>
                            <div className="col-span-2">CHI NHÁNH / TEAM</div>
                            <div className="col-span-4">QUYỀN TRUY CẬP</div>
                            <div className="col-span-1 text-right">THAO TÁC</div>
                        </div>

                        <div className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p className="font-medium">Không có người dùng nào</p>
                                    {searchQuery && (
                                        <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                                    )}
                                </div>
                            ) : (
                                filteredUsers.map((user) => {
                                    const config = roleConfig[user.role] || roleConfig.editor
                                    return (
                                        <div
                                            key={user._id}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center"
                                        >
                                            {/* User Info */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <Avatar className={`${config.avatarColor} h-10 w-10`}>
                                                    <AvatarFallback className="text-white font-semibold">
                                                        {getInitials(user.name).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            {/* Role */}
                                            <div className="col-span-2">
                                                <Badge className={`${config.color} border-0`}>
                                                    {config.label}
                                                </Badge>
                                            </div>

                                            {/* Branch/Team */}
                                            <div className="col-span-2">
                                                <p className="text-sm text-slate-700 truncate">
                                                    {getBranchName(user.branch) !== '-'
                                                        ? getBranchName(user.branch)
                                                        : getTeamName(user.team)
                                                    }
                                                </p>
                                            </div>

                                            {/* Permissions */}
                                            <div className="col-span-4">
                                                <p className="text-sm text-slate-600 truncate">
                                                    {getPermissionsText(user)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-1 flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => alert('Edit user: ' + user.name)}
                                                >
                                                    <Edit className="w-4 h-4 text-slate-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDelete(user._id)}
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {filteredUsers.length > 0 && totalPages > 1 && (
                    <Card className="mt-4">
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
                                        trên {users.length} người dùng
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
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Role Descriptions */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900">Mô Tả Quyền Hạn</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roleDescriptions.map((role, index) => (
                        <Card key={index} className={`border-2 ${role.color}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <role.icon className={`w-5 h-5 ${role.iconColor}`} />
                                    <h3 className="font-bold text-slate-900">{role.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {role.permissions.map((permission, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className={`${role.iconColor} mt-1`}>•</span>
                                            <span>{permission}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
