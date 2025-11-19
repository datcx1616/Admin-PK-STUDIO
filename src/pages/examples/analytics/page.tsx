import {
    Users,
    Eye,
    Clock,
    TrendingUp,
    DollarSign,
    Video
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/pages/examples/analytics/components/site-header"

const statsCards = [
    {
        label: "Người đăng ký",
        value: "125.0K",
        icon: Users,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        progress: 75,
        progressColor: "[&>div]:bg-blue-500"
    },
    {
        label: "Lượt xem gần đây",
        value: "15.4K",
        icon: Eye,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        progress: 60,
        progressColor: "[&>div]:bg-blue-500"
    },
    {
        label: "Giờ xem",
        value: "48.5K",
        icon: Clock,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        progress: 85,
        progressColor: "[&>div]:bg-green-500"
    },
    {
        label: "RPM",
        value: "$2.5",
        subtitle: "Revenue per 1000 views",
        icon: TrendingUp,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        progress: 0,
        progressColor: ""
    },
]

const topVideos = [
    {
        rank: 1,
        title: "Review iPhone 15 Pro Max",
        views: "145.0K views",
        revenue: "362.500 ₫",
        color: "bg-red-500"
    },
    {
        rank: 2,
        title: "Top 10 Laptop 2024",
        views: "98.0K views",
        revenue: "245.000 ₫",
        color: "bg-pink-500"
    },
]

const engagementMetrics = [
    { label: "Likes", value: "8.5%", progress: 85, color: "[&>div]:bg-blue-500" },
    { label: "Comments", value: "3.2%", progress: 32, color: "[&>div]:bg-green-500" },
    { label: "Shares", value: "1.8%", progress: 18, color: "[&>div]:bg-yellow-500" },
]

const audienceMetrics = [
    { label: "Average View Duration", value: "4:32", progress: 75, color: "[&>div]:bg-blue-500" },
    { label: "Click-through Rate", value: "6.7%", progress: 67, color: "[&>div]:bg-green-500" },
    { label: "Impression Rate", value: "12.3%", progress: 85, color: "[&>div]:bg-yellow-500" },
]

export default function DetailedAnalytics() {
    return (
        <div className="min-h-screen ">
            {/* <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Phân Tích Chi Tiết</h1>
                    <p className="text-sm text-gray-500 mt-1">Thống kê và insights cho kênh YouTube</p>
                </div>
            </div> */}
            <SiteHeader />
            <div className="mb-6 pt-4 pl-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Chọn kênh:
                </label>
                <Select defaultValue="tech">
                    <SelectTrigger className="w-full md:w-[400px] bg-white">
                        <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tech">Tech Review VN</SelectItem>
                        <SelectItem value="gaming">Gaming Pro 24/7</SelectItem>
                        <SelectItem value="cooking">Cooking Master</SelectItem>
                        <SelectItem value="travel">Travel Vietnam</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6 pl-6">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow mb-6 ">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-sm text-gray-600">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>
                            {stat.subtitle && (
                                <p className="text-xs text-gray-500 mb-2">{stat.subtitle}</p>
                            )}
                            {stat.progress > 0 && (
                                <Progress
                                    value={stat.progress}
                                    className={`h-2 ${stat.progressColor}`}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className=" pl-6 ">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <CardTitle className="text-lg">Doanh Thu</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-green-500 text-white border-0">
                                <CardContent className="p-6">
                                    <p className="text-sm opacity-90 mb-2">Doanh thu 30 ngày</p>
                                    <p className="text-3xl font-bold mb-2">6.125.000 ₫</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>+17% so với tháng trước</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-600 mb-2">CPM Trung Bình</p>
                                    <p className="text-3xl font-bold text-gray-900 mb-2">$5.00</p>
                                    <p className="text-xs text-gray-500">Cost per 1000 impressions</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-600 mb-2">Estimated Revenue/Day</p>
                                    <p className="text-3xl font-bold text-gray-900 mb-2">204.167 ₫</p>
                                    <p className="text-xs text-gray-500">Based on 30 day average</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 pl-6 ">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Video className="w-5 h-5 text-gray-700" />
                            <CardTitle className="text-lg">Videos Hiệu Suất Cao</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topVideos.map((video) => (
                                <div
                                    key={video.rank}
                                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`${video.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold`}>
                                        {video.rank}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{video.title}</h4>
                                        <p className="text-sm text-gray-500">{video.views}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{video.revenue}</p>
                                        <p className="text-xs text-gray-500">Revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 pl-6 ">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {engagementMetrics.map((metric, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">{metric.label}</span>
                                        <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                                    </div>
                                    <Progress
                                        value={metric.progress}
                                        className={`h-2 ${metric.color}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Audience Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {audienceMetrics.map((metric, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">{metric.label}</span>
                                        <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                                    </div>
                                    <Progress
                                        value={metric.progress}
                                        className={`h-2 ${metric.color}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
