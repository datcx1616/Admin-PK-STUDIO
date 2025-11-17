import { Plus, Users, Crown, Monitor, Edit2, AlertCircle, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const roleStats = [
    {
        title: "Tổng Người Dùng",
        count: "8",
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"

    },
    {
        title: "Trưởng nhóm",
        count: "3",
        icon: Crown,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
    },
    {
        title: "Người quản ký kênh",
        count: "2",
        icon: Monitor,
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        title: "Editors",
        count: "2",
        icon: Edit2,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600"
    },
]

const users = [
    {
        id: 1,
        name: "Admin System",
        email: "admin@company.vn",
        avatar: "AS",
        avatarColor: "bg-red-500",
        role: "Tổng Quản",
        roleColor: "bg-red-100 text-red-700",
        team: "-",
        permissions: "Toàn bộ hệ thống",
    },
    {
        id: 2,
        name: "Nguyễn Văn A",
        email: "nguyenvana@company.vn",
        avatar: "NA",
        avatarColor: "bg-blue-500",
        role: "Team Leader",
        roleColor: "bg-blue-100 text-blue-700",
        team: "Tech & Gaming Team",
        permissions: "Team: Tech & Gaming Team",
    },
    {
        id: 3,
        name: "Trần Thị B",
        email: "tranthib@company.vn",
        avatar: "TB",
        avatarColor: "bg-pink-500",
        role: "Team Leader",
        roleColor: "bg-blue-100 text-blue-700",
        team: "Lifestyle Team",
        permissions: "Team: Lifestyle Team",
    },
    {
        id: 4,
        name: "Lê Văn C",
        email: "levanc@company.vn",
        avatar: "LC",
        avatarColor: "bg-purple-500",
        role: "Team Leader",
        roleColor: "bg-blue-100 text-blue-700",
        team: "Health & Education Team",
        permissions: "Team: Health & Education Team",
    },
    {
        id: 5,
        name: "Phạm Văn D",
        email: "phamvand@company.vn",
        avatar: "PD",
        avatarColor: "bg-green-500",
        role: "Quản lý kênh",
        roleColor: "bg-green-100 text-green-700",
        team: "Tech & Gaming Team",
        permissions: "Kênh: Review VN • Gaming Pro 24/7",
    },
    {
        id: 6,
        name: "Hoàng Thị E",
        email: "hoangthie@company.vn",
        avatar: "HE",
        avatarColor: "bg-teal-500",
        role: "Quản lý kênh",
        roleColor: "bg-green-100 text-green-700",
        team: "Lifestyle Team",
        permissions: "Cooking Master",
    },
    {
        id: 7,
        name: "Võ Văn F",
        email: "vovanf@company.vn",
        avatar: "VF",
        avatarColor: "bg-indigo-500",
        role: "Editor",
        roleColor: "bg-yellow-100 text-yellow-700",
        team: "Tech & Gaming Team",
        permissions: "Kênh: Review VN",
    },
    {
        id: 8,
        name: "Đỗ Thị G",
        email: "dothig@company.vn",
        avatar: "DG",
        avatarColor: "bg-cyan-500",
        role: "Editor",
        roleColor: "bg-yellow-100 text-yellow-700",
        team: "Lifestyle Team",
        permissions: "Cooking Master • Travel Vietnam",
    },
]

const roleDescriptions = [
    {
        title: "Tổng Quản (Admin)",
        color: "border-red-200 bg-red-50",
        icon: AlertCircle,
        iconColor: "text-red-600",
        permissions: [
            "Quản lý toàn bộ hệ thống",
            "Quản lý teams và vận quyền",
            "Truy cập toàn bộ analytics",
            "Cài đặt hệ thống"
        ]
    },
    {
        title: "Team Leader",
        color: "border-blue-200 bg-blue-50",
        icon: Crown,
        iconColor: "text-blue-600",
        permissions: [
            "Xem dashboard của team",
            "Quản lý thành viên trong team",
            "Xem analytics các kênh trong team",
            "Phê duyệt nội dung"
        ]
    },
    {
        title: "Channel Manager",
        color: "border-green-200 bg-green-50",
        icon: Monitor,
        iconColor: "text-green-600",
        permissions: [
            "Quản lý kênh được chỉ định",
            "Phân tích nội kênh",
            "Lên lịch nội bài",
            "Tải nội về đăng"
        ]
    },
    {
        title: "Editor",
        color: "border-orange-200 bg-orange-50",
        icon: Edit2,
        iconColor: "text-orange-600",
        permissions: [
            "Upload video cho kênh được chỉ định",
            "Cấn metadata cơ bản",
            "Xem trạng thái upload",
            "Không có quyền phân tích"
        ]
    },
]

export default function PermissionsManagement() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản Lý Phân Quyền</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý người dùng và phân quyền truy cập</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Thêm Người Dùng
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {roleStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">Lọc theo vai trò:</span>
                    <Tabs defaultValue="all" className="w-auto">
                        <TabsList className="bg-white">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            >
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger value="admin">Tổng Quản</TabsTrigger>
                            <TabsTrigger value="leader">Team Leader</TabsTrigger>
                            <TabsTrigger value="manager">Quản Lý Kênh</TabsTrigger>
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>
            <Card className="mb-6">
                <CardContent className="p-0">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
                        <div className="col-span-3">NGƯỜI DÙNG</div>
                        <div className="col-span-2">VAI TRÒ</div>
                        <div className="col-span-2">TEAM</div>
                        <div className="col-span-4">QUYỀN TRUY CẬP</div>
                        <div className="col-span-1 text-right">THAO TÁC</div>
                    </div>

                    <div className="divide-y">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                            >
                                <div className="col-span-3 flex items-center gap-3">
                                    <Avatar className={`${user.avatarColor} h-10 w-10`}>
                                        <AvatarFallback className="text-white font-semibold">
                                            {user.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>


                                <div className="col-span-2">
                                    <Badge className={`${user.roleColor} border-0`}>
                                        {user.role}
                                    </Badge>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-sm text-gray-700">{user.team}</p>
                                </div>

                                <div className="col-span-4">
                                    <p className="text-sm text-gray-600">{user.permissions}</p>
                                </div>
                                <div className="col-span-1 flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="w-4 h-4 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div>
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
