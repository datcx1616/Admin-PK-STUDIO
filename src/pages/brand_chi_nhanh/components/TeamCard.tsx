import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"
import { formatNumber } from "../utils/formatters"
import { type TeamWithStats } from "../types"

interface TeamCardProps {
    team: TeamWithStats
    onClick: () => void
}

export function TeamCard({ team, onClick }: TeamCardProps) {
    return (
        <Card
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                        </div>
                        {team.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {team.description}
                            </p>
                        )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                        {team.membersCount} thành viên
                    </Badge>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Kênh</p>
                        <p className="text-lg font-bold">{team.channelsCount || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Lượt xem</p>
                        <p className="text-lg font-bold">
                            {team.stats?.totalViews ? formatNumber(team.stats.totalViews) : '0'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Subs</p>
                        <p className="text-lg font-bold">
                            {team.stats?.totalSubscribers ? formatNumber(team.stats.totalSubscribers) : '0'}
                        </p>
                    </div>
                </div>
                {team.leader && (
                    <div className="mt-4 pt-3 border-t">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                    {team.leader.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Trưởng nhóm</p>
                                <p className="text-sm font-medium truncate">{team.leader.name}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
