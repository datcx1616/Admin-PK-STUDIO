// src/pages/examples/roles/permissions-management.tsx
import { useEffect, useState } from 'react'
import { Users, Crown, Monitor, Edit2, AlertCircle, Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { SiteHeader } from "@/pages/examples/roles/components/site-header"
import axios from 'axios'

interface User {
    _id: string
    name: string
    email: string
    role: 'admin' | 'director' | 'branch_director' | 'manager' | 'editor'
    branch?: {
        _id: string
        name: string
        code: string
    }
    team?: {
        _id: string
        name: string
    }
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
    }, [selectedRole, users])

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken')

            // Call API to get users
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            console.log('✅ Users loaded:', response.data)

            const usersData = response.data.users || []
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

            if (error.response?.status === 404) {
                alert('⚠️ API endpoint /api/users chưa được tạo. Vui lòng tạo backend endpoint này.')
            }
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        if (selectedRole === 'all') {
            setFilteredUsers(users)
        } else {
            setFilteredUsers(users.filter(u => u.role === selectedRole))
        }
    }

    const getInitials = (name: string) => {
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return parts[0][0] + parts[parts.length - 1][0]
        }
        return name.substring(0, 2)
    }

    const getPermissionsText = (user: User) => {
        switch (user.role) {
            case 'admin':
            case 'director':
                return 'Toàn bộ hệ thống'
            case 'branch_director':
                return user.branch ? `Chi nhánh: ${user.branch.name}` : 'Chưa có chi nhánh'
            case 'manager':
                return user.team ? `Team: ${user.team.name}` : 'Chưa có team'
            case 'editor':
                return user.team ? `Team: ${user.team.name} (Xem only)` : 'Chưa có team'
            default:
                return '-'
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return

        try {
            const token = localStorage.getItem('authToken')
            await axios.delete(`http://localhost:3000/api/users/${userId}`, {
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
            <div className="min-h-screen">
                <SiteHeader />
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
        <div className="min-h-screen">
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
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium">Lọc theo vai trò:</span>
                    <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-fit">
                        <TabsList className="bg-white shadow-sm border rounded-lg">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Tất cả ({stats.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="admin"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Admin ({stats.admin})
                            </TabsTrigger>
                            <TabsTrigger
                                value="director"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Director ({stats.director})
                            </TabsTrigger>
                            <TabsTrigger
                                value="branch_director"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Branch Dir ({stats.branch_director})
                            </TabsTrigger>
                            <TabsTrigger
                                value="manager"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Manager ({stats.manager})
                            </TabsTrigger>
                            <TabsTrigger
                                value="editor"
                                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                            >
                                Editor ({stats.editor})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Users Table */}
            <div className="px-6 pb-6">
                <Card>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                            <div className="col-span-3">NGƯỜI DÙNG</div>
                            <div className="col-span-2">VAI TRÒ</div>
                            <div className="col-span-2">CHI NHÁNH / TEAM</div>
                            <div className="col-span-4">QUYỀN TRUY CẬP</div>
                            <div className="col-span-1 text-right">THAO TÁC</div>
                        </div>

                        <div className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Không có người dùng nào</p>
                                </div>
                            ) : (
                                filteredUsers.map((user) => {
                                    const config = roleConfig[user.role]
                                    return (
                                        <div
                                            key={user._id}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                                        >
                                            {/* User Info */}
                                            <div className="col-span-3 flex items-center gap-3">
                                                <Avatar className={`${config.avatarColor} h-10 w-10`}>
                                                    <AvatarFallback className="text-white font-semibold">
                                                        {getInitials(user.name).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
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
                                                <p className="text-sm text-gray-700">
                                                    {user.branch ? user.branch.name : user.team ? user.team.name : '-'}
                                                </p>
                                            </div>

                                            {/* Permissions */}
                                            <div className="col-span-4">
                                                <p className="text-sm text-gray-600">
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
                                                    <Edit className="w-4 h-4 text-gray-600" />
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
            </div>

            {/* Role Descriptions */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-900">Mô Tả Quyền Hạn</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roleDescriptions.map((role, index) => (
                        <Card key={index} className={`border-2 ${role.color}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <role.icon className={`w-5 h-5 ${role.iconColor}`} />
                                    <h3 className="font-bold text-gray-900">{role.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {role.permissions.map((permission, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
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