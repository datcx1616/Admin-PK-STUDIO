// src/pages/examples/channel/components/youtube-channels-list.tsx
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { youtubeApi } from '@/lib/youtubeApi'
import { Eye, Users, Video, ExternalLink, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Channel {
    id: string
    channelId: string
    channelTitle: string
    thumbnail: string
    connectedAt: string
    subscriberCount?: number
    viewCount?: number
    videoCount?: number
    customUrl?: string
}

export function YouTubeChannelsList() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchingStats, setFetchingStats] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchChannels()
    }, [])

    const fetchChannels = async () => {
        try {
            // 1. Lấy danh sách channels đã kết nối
            const statusData = await youtubeApi.getStatus()

            if (statusData.success && statusData.connected && statusData.channels.length > 0) {
                setChannels(statusData.channels)

                // 2. Fetch stats cho từng channel
                setFetchingStats(true)
                await fetchChannelStats(statusData.channels)
            }
        } catch (error) {
            console.error('Error fetching channels:', error)
        } finally {
            setLoading(false)
            setFetchingStats(false)
        }
    }

    const fetchChannelStats = async (channelsList: Channel[]) => {
        const token = localStorage.getItem('authToken')
        if (!token) return

        try {
            // Fetch stats cho tất cả channels
            const updatedChannels = await Promise.all(
                channelsList.map(async (channel) => {
                    try {
                        const response = await fetch(
                            `http://localhost:3000/api/youtube/channel-stats?channelId=${channel.id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        )

                        if (response.ok) {
                            const data = await response.json()
                            return {
                                ...channel,
                                subscriberCount: data.stats?.subscriberCount,
                                viewCount: data.stats?.viewCount,
                                videoCount: data.stats?.videoCount,
                                customUrl: data.stats?.customUrl
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching stats for ${channel.channelTitle}:`, error)
                    }
                    return channel
                })
            )

            setChannels(updatedChannels)
        } catch (error) {
            console.error('Error fetching channel stats:', error)
        }
    }

    const handleViewAnalytics = (channelId: string) => {
        // Navigate to analytics page
        navigate(`/channel-analytics/${channelId}`)
    }

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 col-span-full">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                                <Skeleton className="h-16 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (channels.length === 0) {
        return (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                            Chưa có kênh nào được kết nối
                        </h3>
                        <p className="text-sm text-slate-500">
                            Nhấn "Đăng nhập YouTube" để bắt đầu
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {channels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200">
                    {/* Header with gradient */}
                    <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500" />

                    <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <Avatar className="h-16 w-16 border-2 border-red-500 shadow-md ring-2 ring-red-100">
                                <AvatarImage
                                    src={channel.thumbnail}
                                    alt={channel.channelTitle}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-lg">
                                    {channel.channelTitle.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Channel Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <CardTitle className="text-base font-bold text-slate-900 truncate">
                                        {channel.channelTitle}
                                    </CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0"
                                    >
                                        ✓ Active
                                    </Badge>
                                </div>

                                {/* Custom URL */}
                                {channel.customUrl && (
                                    <p className="text-xs text-slate-500 mb-1">
                                        {channel.customUrl}
                                    </p>
                                )}

                                {/* Connected Date */}
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Kết nối: {new Date(channel.connectedAt).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Subscribers */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 border border-red-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Users className="w-3.5 h-3.5 text-red-600" />
                                    <p className="text-xs font-medium text-red-900">Subscribers</p>
                                </div>
                                {fetchingStats && !channel.subscriberCount ? (
                                    <Skeleton className="h-6 w-full" />
                                ) : (
                                    <p className="text-lg font-bold text-red-600">
                                        {channel.subscriberCount !== undefined
                                            ? formatNumber(channel.subscriberCount)
                                            : '—'
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Views */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    <p className="text-xs font-medium text-blue-900">Views</p>
                                </div>
                                {fetchingStats && !channel.viewCount ? (
                                    <Skeleton className="h-6 w-full" />
                                ) : (
                                    <p className="text-lg font-bold text-blue-600">
                                        {channel.viewCount !== undefined
                                            ? formatNumber(channel.viewCount)
                                            : '—'
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Videos */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Video className="w-3.5 h-3.5 text-green-600" />
                                    <p className="text-xs font-medium text-green-900">Videos</p>
                                </div>
                                {fetchingStats && !channel.videoCount ? (
                                    <Skeleton className="h-6 w-full" />
                                ) : (
                                    <p className="text-lg font-bold text-green-600">
                                        {channel.videoCount !== undefined
                                            ? formatNumber(channel.videoCount)
                                            : '—'
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5"
                                onClick={() => window.open(`https://studio.youtube.com/channel/${channel.channelId}`, '_blank')}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="text-xs">Studio</span>
                            </Button>

                            <Button
                                size="sm"
                                className="flex-1 gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                onClick={() => handleViewAnalytics(channel.id)}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span className="text-xs">Analytics</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

// Helper function to format numbers
function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toLocaleString()
}