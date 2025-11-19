import { Briefcase, Edit, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/pages/examples/teams/components/site-header"
import { Button } from "@/components/ui/button"

const teams = [
    {
        id: 1,
        name: "Tech & Gaming Team",
        leader: "Nguyễn Văn A",
        revenue: "12.045.000 ₫",
        views: "4.3M",
        members: "3 người",
        channels: "2 kênh",
        bgColor: "bg-purple-50"
    },
    {
        id: 2,
        name: "Tech & Gaming Team",
        leader: "Trần Thị B",
        revenue: "14.100.000 ₫",
        views: "7.3M",
        members: "3 người",
        channels: "2 kênh",
        bgColor: "bg-pink-50"
    },
    {
        id: 3,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
    {
        id: 4,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
    {
        id: 5,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
    {
        id: 6,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
    {
        id: 7,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
    {
        id: 8,
        name: "Health & Education Team",
        leader: "Lê Văn C",
        revenue: "7.819.000 ₫",
        views: "2.4M",
        members: "1 người",
        channels: "2 kênh",
        bgColor: "bg-blue-50"
    },
]

export default function TeamsManagement() {
    return (
        <div className="min-h-screen ">
            <SiteHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-8 gap-4 p-6 mb-6">
                {teams.map((team) => (
                    <Card key={team.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`${team.bgColor} p-4 rounded-xl`}>
                                    <Briefcase className="w-8 h-8 text-gray-800" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {team.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Leader: {team.leader}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Doanh thu</span>
                                    <span className="text-base font-bold text-green-600">
                                        {team.revenue}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Lượt xem</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {team.views}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Thành viên</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {team.members}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Kênh</span>
                                    <span className="text-base font-semibold text-gray-900">
                                        {team.channels}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 hover:bg-gray-100"
                                >
                                    <Edit className="w-4 h-4" />
                                    Sửa
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 hover:bg-gray-100"
                                >
                                    <Users className="w-4 h-4" />
                                    Thành viên
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div >
    )
}
