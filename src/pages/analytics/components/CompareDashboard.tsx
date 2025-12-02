import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export interface ComparableChannel {
    id?: string
    channelId?: string
    _id?: string
    name: string
    thumbnail?: string
    basic?: {
        totalViews?: number
        totalWatchTimeHours?: number
        totalWatchTimeMinutes?: number
        averageViewDuration?: number
        totalSubscribersGained?: number
        totalSubscribersLost?: number
        totalSubscribersNet?: number
    }
    engagement?: {
        totalLikes?: number
        totalDislikes?: number
        totalComments?: number
        totalShares?: number
        engagementRate?: number
        likeDislikeRatio?: number
    }
    revenue?: {
        estimatedRevenue?: number
        cpm?: number
        rpm?: number
        monetizedPlaybacks?: number
        monetizationStatus?: string
    }
    traffic?: unknown
    devices?: unknown
    demographics?: unknown
    videos?: unknown
    retention?: unknown
}

export interface CompareData {
    channels: ComparableChannel[]
    aggregatedTotals?: {
        basic?: Record<string, number>
        engagement?: Record<string, number>
        revenue?: Record<string, number>
    }
    metrics?: string[]
    metricLabels?: Record<string, string>
    dateRange?: { startDate?: string; endDate?: string }
}

interface CompareDashboardProps {
    data: CompareData
}

export function CompareDashboard({ data }: CompareDashboardProps) {
    const channels: ComparableChannel[] = data?.channels || []

    const getMetric = (ch: ComparableChannel, key: string) => {
        switch (key) {
            case 'views':
            case 'totalViews':
                return ch.basic?.totalViews || 0
            case 'watchTimeHours':
            case 'totalWatchTimeHours':
                return ch.basic?.totalWatchTimeHours || 0
            case 'subscribersGained':
            case 'totalSubscribersGained':
                return ch.basic?.totalSubscribersGained || 0
            case 'subscribersLost':
            case 'totalSubscribersLost':
                return ch.basic?.totalSubscribersLost || 0
            case 'likes':
            case 'totalLikes':
                return ch.engagement?.totalLikes || 0
            default:
                return 0
        }
    }

    const rankBy = (metricKey: string, desc = true) => {
        return [...channels].sort((a, b) => {
            const av = getMetric(a, metricKey)
            const bv = getMetric(b, metricKey)
            return desc ? bv - av : av - bv
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>🔀 So Sánh Nhiều Kênh</CardTitle>
                    <CardDescription>
                        {data?.dateRange?.startDate && data?.dateRange?.endDate ? `${data.dateRange.startDate} → ${data.dateRange.endDate}` : null}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-muted-foreground">
                                    <th className="py-2 pr-4">Kênh</th>
                                    <th className="py-2 pr-4">👁️ Views</th>
                                    <th className="py-2 pr-4">⏱️ Watch Time (h)</th>
                                    <th className="py-2 pr-4">👥 Subs +</th>
                                    <th className="py-2 pr-4">👥 Subs -</th>
                                    <th className="py-2 pr-4">👥 Subs Net</th>
                                    <th className="py-2">❤️ Likes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {channels.map((ch) => (
                                    <tr key={ch.id || ch.channelId || ch._id}>
                                        <td className="py-2 pr-4 font-medium">
                                            {ch.thumbnail ? <img src={ch.thumbnail} className="inline-block h-5 w-5 rounded-full mr-2 align-[-2px]" /> : '📺'}
                                            {ch.name}
                                        </td>
                                        <td className="py-2 pr-4">{(ch.basic?.totalViews || 0).toLocaleString()}</td>
                                        <td className="py-2 pr-4">{(ch.basic?.totalWatchTimeHours || 0).toLocaleString()}</td>
                                        <td className="py-2 pr-4">+{(ch.basic?.totalSubscribersGained || 0).toLocaleString()}</td>
                                        <td className="py-2 pr-4">-{(ch.basic?.totalSubscribersLost || 0).toLocaleString()}</td>
                                        <td className="py-2 pr-4">{(ch.basic?.totalSubscribersNet || 0).toLocaleString()}</td>
                                        <td className="py-2">{(ch.engagement?.totalLikes || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RankCard title="🏆 Top Views" items={rankBy('totalViews').slice(0, 5)} metric="totalViews" />
                <RankCard title="⏱️ Top Watch Time" items={rankBy('totalWatchTimeHours').slice(0, 5)} metric="totalWatchTimeHours" />
                <RankCard title="❤️ Top Likes" items={rankBy('totalLikes').slice(0, 5)} metric="totalLikes" />
            </div>
        </div>
    )
}

function RankCard({ title, items, metric }: { title: string; items: ComparableChannel[]; metric: string }) {
    const valueFor = (ch: ComparableChannel) => {
        switch (metric) {
            case 'totalViews':
                return ch.basic?.totalViews || 0
            case 'totalWatchTimeHours':
                return ch.basic?.totalWatchTimeHours || 0
            case 'totalLikes':
                return ch.engagement?.totalLikes || 0
            default:
                return 0
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="space-y-2">
                    {items.map((ch, idx) => (
                        <li key={(ch.id || ch.channelId || ch._id) + metric} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 text-center font-semibold text-muted-foreground">{idx + 1}</div>
                                {ch.thumbnail ? <img src={ch.thumbnail} className="h-6 w-6 rounded-full" /> : <div className="h-6 w-6 rounded-full bg-muted" />}
                                <div className="font-medium truncate max-w-[220px]">{ch.name}</div>
                            </div>
                            <div className="tabular-nums font-semibold">{valueFor(ch).toLocaleString()}</div>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    )
}
