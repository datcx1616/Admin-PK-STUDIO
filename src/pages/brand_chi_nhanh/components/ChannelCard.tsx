import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Zap, Users } from "lucide-react"
import { formatNumber } from "../utils/formatters"
import { type ChannelWithStats } from "../types/branch-analytics.types"

interface ChannelCardProps {
    channel: ChannelWithStats
    onClick: () => void
}

export function ChannelCard({ channel, onClick }: ChannelCardProps) {
    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            <div className="aspect-video bg-linear-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                {channel.thumbnail ? (
                    <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-100 to-blue-100">
                        <span className="text-4xl font-bold text-gray-400 opacity-50">
                            {channel.name.substring(0, 1).toUpperCase()}
                        </span>
                    </div>
                )}
                {channel.isVerified && (
                    <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">
                        ✓ Xác thực
                    </Badge>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2 text-sm">{channel.name}</h3>
                {channel.customUrl && (
                    <p className="text-xs text-muted-foreground mb-3">
                        @{channel.customUrl}
                    </p>
                )}
                <Separator className="my-2" />
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="flex items-center justify-center mb-1">
                            <Eye className="h-4 w-4 text-blue-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">Lượt xem</p>
                        <p className="text-sm font-bold">
                            {channel.stats?.totalViews ? formatNumber(channel.stats.totalViews) : '0'}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">Theo dõi</p>
                        <p className="text-sm font-bold">
                            {channel.stats?.subscribers ? formatNumber(channel.stats.subscribers) : '0'}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center mb-1">
                            <Zap className="h-4 w-4 text-yellow-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">Video</p>
                        <p className="text-sm font-bold">
                            {channel.stats?.videoCount || 0}
                        </p>
                    </div>
                </div>
                {channel.stats?.growth && (
                    <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Tăng trưởng</span>
                            <span className={channel.stats.growth >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {channel.stats.growth >= 0 ? "+" : ""}{channel.stats.growth.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
