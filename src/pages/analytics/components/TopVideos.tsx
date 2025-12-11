import { Eye, Clock, Activity, Video, ThumbsUp, MessageSquare, Share2, PlayCircle, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsResponse } from "./types"
import { formatNumber, formatDuration } from "./utils"

interface TopVideosProps {
    analytics: AnalyticsResponse
}

export function TopVideos({ analytics }: TopVideosProps) {
    if (!analytics.videos) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Dữ liệu videos không khả dụng</p>
                    <p className="text-sm text-gray-400 mt-2">
                        {analytics.meta?.dataUnavailable?.includes('videos')
                            ? 'Backend đang xử lý dữ liệu top videos'
                            : 'Chọn include=all hoặc include=videos để xem metrics này'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const { topByViews, topByWatchTime, topByEngagement } = analytics.videos

    const renderVideoList = (videos: typeof topByViews, emptyMessage: string) => (
        <div className="space-y-3">
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <Badge className="mb-2">{index + 1}</Badge>
                                    {video.thumbnailUrl ? (
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-32 h-20 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                                            <Video className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                        {video.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Published: {new Date(video.publishedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Eye className="h-3 w-3" />
                                            <span>{formatNumber(video.views)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Clock className="h-3 w-3" />
                                            <span>{video.watchTimeHours}h</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <ThumbsUp className="h-3 w-3" />
                                            <span>{formatNumber(video.likes)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MessageSquare className="h-3 w-3" />
                                            <span>{formatNumber(video.comments)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Share2 className="h-3 w-3" />
                                            <span>{formatNumber(video.shares)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <PlayCircle className="h-3 w-3" />
                                            <span>{formatDuration(Math.floor(video.averageViewDuration))}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                                    >
                                        View on YouTube <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
            )}
        </div>
    )

    return (
        <Tabs defaultValue="views" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="views">By Views</TabsTrigger>
                <TabsTrigger value="watchtime">By Watch Time</TabsTrigger>
                <TabsTrigger value="engagement">By Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="views">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Top Videos by Views
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderVideoList(topByViews, "No video data available")}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="watchtime">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-purple-600" />
                            Top Videos by Watch Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderVideoList(topByWatchTime, "No video data available")}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="engagement">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            Top Videos by Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderVideoList(topByEngagement, "No video data available")}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
