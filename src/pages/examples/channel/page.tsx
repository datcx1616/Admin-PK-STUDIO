import { List, Eye, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/pages/examples/channel/components/site-header"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const channels = [
    {
        id: 1,
        name: "Tech Review VN",
        status: "Active",
        statusColor: "bg-green-100 text-green-700",
        avatar: "/avatars/tech.jpg",
        subscribers: "125.0K",
        totalViews: "2.5M",
        watchTime: "48.5K",
        rpm: "$2.5",
        revenue30Days: "6.125.000 ₫",
        topVideos: [
            { title: "Unbox iPhone 13 Pro Max", views: "145.0K" },
            { title: "Top 10 Laptop 2024", views: "98.0K" }
        ]
    },
    {
        id: 2,
        name: "Gaming Pro 24/7",
        status: "Active",
        statusColor: "bg-green-100 text-green-700",
        avatar: "/avatars/gaming.jpg",
        subscribers: "89.0K",
        totalViews: "1.8M",
        watchTime: "35.2K",
        rpm: "$3.2",
        revenue30Days: "5.920.000 ₫",
        topVideos: [
            { title: "PUBG Mobile: Lựu Cú Bricks", views: "125.0K" },
            { title: "Free Fire Pro Guide", views: "87.0K" }
        ]
    },
    {
        id: 3,
        name: "Cooking Master",
        status: "Active",
        statusColor: "bg-green-100 text-green-700",
        avatar: "/avatars/cooking.jpg",
        subscribers: "156.0K",
        totalViews: "3.2M",
        watchTime: "62.0K",
        rpm: "$2.1",
        revenue30Days: "6.720.000 ₫",
        topVideos: [
            { title: "Phở bò Hà Nội chuẩn vị", views: "234.0K" },
            { title: "Bánh mì Sài Gòn", views: "178.0K" }
        ]
    },
    {
        id: 4,
        name: "Travel Vietnam",
        status: "Active",
        statusColor: "bg-green-100 text-green-700",
        avatar: "/avatars/travel.jpg",
        subscribers: "203.0K",
        totalViews: "4.1M",
        watchTime: "78.5K",
        rpm: "$1.8",
        revenue30Days: "7.380.000 ₫",
        topVideos: [
            { title: "Du lịch Đà Lạt: 7 ngày 2 đêm", views: "312.0K" },
            { title: "Khám phá Hội An", views: "267.0K" }
        ]
    },
    {
        id: 5,
        name: "Fitness Daily",
        status: "Warning",
        statusColor: "bg-yellow-100 text-yellow-700",
        avatar: "/avatars/fitness.jpg",
        subscribers: "67.0K",
        totalViews: "980.0K",
        watchTime: "18.4K",
        rpm: "$2.8",
        revenue30Days: "2.744.000 ₫",
        topVideos: [
            { title: "Giảm cân 30 ngày", views: "89.0K" },
            { title: "Yoga cho người mới", views: "65.0K" }
        ]
    },
    {
        id: 6,
        name: "AI & Technology",
        status: "Active",
        statusColor: "bg-green-100 text-green-700",
        avatar: "/avatars/ai.jpg",
        subscribers: "94.0K",
        totalViews: "1.4M",
        watchTime: "28.9K",
        rpm: "$3.5",
        revenue30Days: "5.075.000 ₫",
        topVideos: [
            { title: "ChatGPT Tips 2024", views: "156.0K" },
            { title: "AI Image Generation", views: "123.0K" }
        ]
    },
]

export default function ChannelManagement() {
    return (
        <div className="min-h-screen">
            <SiteHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 py-4 gap-4">
                <Tabs defaultValue="all" className="w-fit">
                    <TabsList className="bg-white shadow-sm border rounded-lg">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white hover:bg-red-100"
                        >
                            Tất cả
                        </TabsTrigger>

                        <TabsTrigger
                            value="active"
                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white hover:bg-red-100"
                        >
                            Hoạt động
                        </TabsTrigger>

                        <TabsTrigger
                            value="warning"
                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white hover:bg-red-100"
                        >
                            Cảnh báo
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {channels.map((channel) => (
                    <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        {channel.name.substring(0, 2)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {channel.name}
                                        </h3>
                                        <Badge className={`${channel.statusColor} border-0 text-xs`}>
                                            {channel.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">Kênh của: Lê Văn C</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Subscribers</p>
                                    <p className="text-lg font-bold text-gray-900">{channel.subscribers}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Views</p>
                                    <p className="text-lg font-bold text-gray-900">{channel.totalViews}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Watch Time</p>
                                    <p className="text-base font-semibold text-gray-900">{channel.watchTime}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">RPM</p>
                                    <p className="text-base font-semibold text-green-600">{channel.rpm}</p>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-3 mb-4">
                                <p className="text-xs text-gray-600 mb-1">Doanh thu 30 ngày</p>
                                <p className="text-xl font-bold text-green-600">{channel.revenue30Days}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-gray-600 mb-2">Top Videos</p>
                                <div className="space-y-2">
                                    {channel.topVideos.map((video, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <TrendingUp className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-700 truncate">{video.title}</p>
                                                <p className="text-xs text-gray-500">{video.views}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 text-sm"
                                    size="sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Phân tích
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 text-sm"
                                    size="sm"
                                >
                                    <List className="w-4 h-4" />
                                    Cài đặt
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
