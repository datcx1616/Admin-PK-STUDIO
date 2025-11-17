import {
    DollarSign,
    Eye,
    Clock,
    Youtube,
    Users,
    TrendingUp,
    Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"


const statsCards = [
    {
        title: "admin.dashboard.totalRevenue",
        value: "33.964.000 ₫",
        changePercent: "+1,5%",
        changeKey: "admin.dashboard.lastMonth",
        icon: DollarSign,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        trend: "up"
    },
    {
        title: "admin.dashboard.totalViews",
        value: "14.0M",
        changePercent: "+1,3%",
        changeKey: "admin.dashboard.lastMonth",
        icon: Eye,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        trend: "up"
    },
    {
        title: "admin.dashboard.watchHours",
        value: "271.5K",
        changePercent: "+15,7%",
        changeKey: "admin.dashboard.lastMonth",
        icon: Clock,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        trend: "up"
    },
    {
        title: "admin.dashboard.numberOfChannels",
        value: "6",
        changePercent: "5",
        changeKey: "admin.dashboard.activeChannels",
        icon: Youtube,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        trend: "neutral"
    },
]

const teams = [
    {
        name: "Tech & Gaming Team",
        leader: "Nguyễn Văn A",
        revenue: "12.045.000 ₫",
        views: "4.3M",
        channels: "2 kênh"
    },
    {
        name: "Lifestyle Team",
        leader: "Trần Thị B",
        revenue: "14.100.000 ₫",
        views: "7.3M",
        channels: "2 kênh"
    },
    {
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        channels: "2 kênh"
    },
]

const topChannels = [
    {
        rank: 1,
        name: "Travel Vietnam",
        subscribers: "203.0K subscribers",
        views: "21.4K views",
        revenue: "7.380.000 ₫",
        rpm: "$1.0",
        replies: "30 ngày",
        avatar: "/avatars/travel.jpg"
    },
    {
        rank: 2,
        name: "Cooking Master",
        subscribers: "156.0K subscribers",
        views: "18.9K views",
        revenue: "6.720.000 ₫",
        rpm: "$2.1",
        replies: "30 ngày",
        avatar: "/avatars/cooking.jpg"
    },
    {
        rank: 3,
        name: "Tech Review VN",
        subscribers: "125.0K subscribers",
        views: "15.4K views",
        revenue: "6.125.000 ₫",
        rpm: "$2.5",
        replies: "30 ngày",
        avatar: "/avatars/tech.jpg"
    },
    {
        rank: 4,
        name: "Gaming Pro 24/7",
        subscribers: "89.0K subscribers",
        views: "12.3K views",
        revenue: "5.920.000 ₫",
        rpm: "$3.2",
        replies: "30 ngày",
        avatar: "/avatars/gaming.jpg"
    },
    {
        rank: 5,
        name: "AI & Technology",
        subscribers: "94.0K subscribers",
        views: "9.8K views",
        revenue: "5.075.000 ₫",
        rpm: "$3.5",
        replies: "30 ngày",
        avatar: "/avatars/ai.jpg"
    },
]

export default function Dashboard() {
    const { t } = useTranslation();

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t("admin.sidebar.dashboard")}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Xem tất cả nhóm</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {t(stat.title)}
                            </CardTitle>
                            <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <p
                                className={`text-xs mt-1 flex items-center gap-1 ${stat.trend === "up" ? "text-green-600" : "text-gray-500"
                                    }`}
                            >
                                {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                                {stat.changePercent} {t(stat.changeKey)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mb-10">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-700" />
                        <CardTitle className="text-lg">
                            {t("admin.dashboard.topTeams")}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {teams.map((team, index) => (
                            <Card
                                key={index}
                                className="border-2 hover:border-blue-500 transition-colors cursor-pointer"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Users className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{team.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {t("admin.dashboard.leader")}: {team.leader}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {t("admin.dashboard.revenue")}:
                                            </span>
                                            <span className="font-semibold text-gray-900">{team.revenue}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {t("admin.dashboard.views")}:
                                            </span>
                                            <span className="font-semibold text-gray-900">{team.views}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {t("admin.dashboard.channels")}:
                                            </span>
                                            <span className="font-semibold text-gray-900">{team.channels}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <CardTitle className="text-lg">
                            {t("admin.dashboard.topChannels")}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {topChannels.map((channel) => (
                            <div
                                key={channel.rank}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border"
                            >
                                <div className="flex-shrink-0 w-12 text-center">
                                    <span className="text-2xl font-bold text-gray-400">#{channel.rank}</span>
                                </div>

                                <Avatar className="h-12 w-12 flex-shrink-0">
                                    <AvatarImage src={channel.avatar} alt={channel.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                        {channel.name.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                                    <p className="text-sm text-gray-500">{channel.subscribers}</p>
                                </div>

                                <div className="hidden md:flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{channel.views}</p>
                                        <p className="text-xs text-gray-500">
                                            {t("admin.dashboard.rpm")}: {channel.rpm}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">{channel.revenue}</p>
                                        <p className="text-xs text-gray-500">{channel.replies}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="fixed top-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md z-50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
            </div>
        </div>
    )
}
