// src/pages/components/ChannelDetailView.tsx
/**
 * Component hiển thị chi tiết kênh ở content area
 * Thay thế cho dialog popup
 */

import * as React from "react"
import { Youtube, Users, Eye, Video, TrendingUp, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { channelsAPI } from "@/lib/channels-api"
import type { Channel, ChannelDetail } from "@/types/channel.types"
import { toast } from "sonner"

interface ChannelDetailViewProps {
    channel: Channel
    onBack?: () => void
}

export function ChannelDetailView({ channel, onBack }: ChannelDetailViewProps) {
    const [channelDetail, setChannelDetail] = React.useState<ChannelDetail | null>(null)
    const [loading, setLoading] = React.useState(true)

    // Fetch channel detail
    React.useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true)
            try {
                console.log('🔄 Fetching channel detail:', channel._id)
                const detail = await channelsAPI.getDetail(channel._id)
                console.log('✅ Channel detail:', detail)
                setChannelDetail(detail)
            } catch (error) {
                console.error('❌ Error fetching channel detail:', error)
                toast.error('Failed to load channel details')
            } finally {
                setLoading(false)
            }
        }

        if (channel._id) {
            fetchDetail()
        }
    }, [channel._id])

    // Format numbers
    const formatNumber = (num: number | undefined) => {
        if (!num) return '0'
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-64" />
            </div>
        )
    }

    if (!channelDetail) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <Youtube className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">Không tìm thấy thông tin kênh</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={channelDetail.thumbnailUrl} alt={channelDetail.name} />
                            <AvatarFallback className="bg-red-100 text-red-700">
                                <Youtube className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{channelDetail.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                {channelDetail.customUrl && (
                                    <span className="text-sm text-muted-foreground">
                                        {channelDetail.customUrl}
                                    </span>
                                )}
                                <Badge variant={channelDetail.isConnected ? "default" : "secondary"}>
                                    {channelDetail.isConnected ? "Connected" : "Disconnected"}
                                </Badge>
                                {channelDetail.isActive && (
                                    <Badge variant="outline">Active</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                    </Button>
                    {channelDetail.customUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={`https://youtube.com/${channelDetail.customUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                YouTube
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(channelDetail.subscriberCount)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total subscribers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(channelDetail.viewCount)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Channel lifetime views
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(channelDetail.videoCount)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Published videos
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Channel Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description */}
                {channelDetail.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Mô tả</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {channelDetail.description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Team Info */}
                {channelDetail.team && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Team</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium">
                                        {typeof channelDetail.team === 'string'
                                            ? channelDetail.team
                                            : channelDetail.team.name}
                                    </p>
                                    {typeof channelDetail.team !== 'string' && channelDetail.team.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {channelDetail.team.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Assigned Editors */}
            {channelDetail.assignedTo && channelDetail.assignedTo.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Editors</CardTitle>
                        <CardDescription>
                            {channelDetail.assignedTo.length} editor(s) được gán cho kênh này
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {channelDetail.assignedTo.map((assignment) => {
                                const user = typeof assignment.user === 'string'
                                    ? { _id: assignment.user, name: 'Unknown', email: '' }
                                    : assignment.user

                                return (
                                    <div key={user._id} className="flex items-center gap-3 p-3 rounded-lg border">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analytics */}
            {channelDetail.analytics && (
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                        <CardDescription>Dữ liệu phân tích gần đây</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {channelDetail.analytics.views !== undefined && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Views</p>
                                    <p className="text-lg font-semibold">{formatNumber(channelDetail.analytics.views)}</p>
                                </div>
                            )}
                            {channelDetail.analytics.watchTime !== undefined && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Watch Time</p>
                                    <p className="text-lg font-semibold">{formatNumber(channelDetail.analytics.watchTime)}h</p>
                                </div>
                            )}
                            {channelDetail.analytics.subscribersGained !== undefined && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Subs Gained</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        +{formatNumber(channelDetail.analytics.subscribersGained)}
                                    </p>
                                </div>
                            )}
                            {channelDetail.analytics.estimatedRevenue !== undefined && (
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Revenue</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        ${channelDetail.analytics.estimatedRevenue.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Videos */}
            {channelDetail.recentVideos && channelDetail.recentVideos.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Videos</CardTitle>
                        <CardDescription>
                            {channelDetail.recentVideos.length} video(s) gần đây
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {channelDetail.recentVideos.map((video) => (
                                <div key={video._id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                    <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{video.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {video.status}
                                            </Badge>
                                            {video.publishedAt && (
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(video.publishedAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
