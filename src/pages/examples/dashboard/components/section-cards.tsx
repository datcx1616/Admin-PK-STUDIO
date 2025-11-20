import { IconTrendingDown, IconTrendingUp, IconUsers, IconBuildingCommunity, IconBrandYoutube, IconEye } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
    stats?: {
        totalBranches?: number;
        totalTeams?: number;
        totalChannels?: number;
        totalUsers?: number;
        totalSubscribers?: number;
        totalViews?: number;
        [key: string]: any;
    }
}

export function SectionCards({ stats }: SectionCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Branches</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats?.totalBranches || 0}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconBuildingCommunity />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Active Branches <IconTrendingUp className="size-4" />
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Teams</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats?.totalTeams || 0}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconUsers />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Active Teams <IconTrendingUp className="size-4" />
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Channels</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats?.totalChannels || 0}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconBrandYoutube />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Connected Channels <IconTrendingUp className="size-4" />
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Users/Views</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats?.totalUsers || stats?.totalViews || 0}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconEye />
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        System Users / Views <IconTrendingUp className="size-4" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}