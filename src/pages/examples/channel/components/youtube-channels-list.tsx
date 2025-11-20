// components/youtube-channels-list.tsx
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Channel {
    id: string
    channelId: string
    channelTitle: string
    thumbnail: string
    connectedAt: string
}

export function YouTubeChannelsList() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchChannels()
    }, [])

    const fetchChannels = async () => {
        try {
            const data = await apiClient.getYouTubeStatus()

            if (data.success && data.connected) {
                setChannels(data.channels)
            }
        } catch (error) {
            console.error('Error fetching channels:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    }

    if (channels.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Chưa có kênh nào được kết nối. Nhấn "Kết Nối Kênh Mới" để bắt đầu.
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
                <Card key={channel.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={channel.thumbnail} alt={channel.channelTitle} />
                            <AvatarFallback>{channel.channelTitle[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                                {channel.channelTitle}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Kết nối: {new Date(channel.connectedAt).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}