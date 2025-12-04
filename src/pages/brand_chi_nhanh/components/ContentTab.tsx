import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube } from "lucide-react"
import { ChannelCard } from "./ChannelCard"
import { useNavigate } from "react-router-dom"
import { formatNumber } from "../utils/formatters"
import { type ChannelWithStats } from "../types"

interface ContentTabProps {
    channels: ChannelWithStats[]
    totalSubscribers: number
}

export function ContentTab({ channels, totalSubscribers }: ContentTabProps) {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5" />
                        Channels ({channels.length})
                    </CardTitle>
                    <CardDescription>
                        {formatNumber(totalSubscribers)} subscribers trên tất cả các kênh
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <Youtube className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-blue-900 dark:text-blue-100">
                                <p className="font-medium mb-1">Kênh trong Sidebar</p>
                                <p className="text-sm">
                                    Tất cả kênh của chi nhánh này được hiển thị ở sidebar bên trái.
                                    Click vào bất kỳ kênh nào để xem thông tin chi tiết bao gồm stats,
                                    analytics, phân công team và video gần đây.
                                </p>
                            </div>
                        </div>
                    </div>

                    {channels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {channels.map((channel) => (
                                <ChannelCard
                                    key={channel._id}
                                    channel={channel}
                                    onClick={() => navigate(`/channels/${channel._id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                            <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Không tìm thấy kênh trong chi nhánh này</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
