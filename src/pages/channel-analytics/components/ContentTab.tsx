// src/pages/channel-analytics/components/ContentTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber, formatDate } from "../utils/formatters";
import type { ChannelAnalyticsData, VideoStats } from "@/types/channel-analytics.types";
import { Eye, Clock, ThumbsUp, MessageCircle, Share2, ExternalLink, TrendingUp, Video } from "lucide-react";

interface ContentTabProps {
    analytics: ChannelAnalyticsData;
}

export function ContentTab({ analytics }: ContentTabProps) {
    const [selectedCategory, setSelectedCategory] = React.useState<'views' | 'watchTime' | 'engagement'>('views');

    const getVideosByCategory = (): VideoStats[] => {
        switch (selectedCategory) {
            case 'views':
                return analytics.videos.topByViews;
            case 'watchTime':
                return analytics.videos.topByWatchTime;
            case 'engagement':
                return analytics.videos.topByEngagement;
            default:
                return analytics.videos.topByViews;
        }
    };

    const videos = getVideosByCategory();

    return (
        <div className="space-y-6">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
                <Button
                    variant={selectedCategory === 'views' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('views')}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Nhiều Lượt Xem Nhất
                </Button>
                <Button
                    variant={selectedCategory === 'watchTime' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('watchTime')}
                >
                    <Clock className="h-4 w-4 mr-2" />
                    Nhiều Giờ Xem Nhất
                </Button>
                <Button
                    variant={selectedCategory === 'engagement' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('engagement')}
                >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Tương Tác Cao Nhất
                </Button>
            </div>

            {/* Top Videos Grid */}
            <div className="grid grid-cols-1 gap-4">
                {videos.map((video, index) => (
                    <Card key={video.videoId} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row gap-4 p-4">
                                {/* Thumbnail */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-full md:w-48 h-auto rounded-lg object-cover"
                                    />
                                    <Badge
                                        className="absolute top-2 left-2"
                                        variant="secondary"
                                    >
                                        #{index + 1}
                                    </Badge>
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-base line-clamp-2 mb-1">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Đăng ngày: {formatDate(video.publishedAt)}
                                        </p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Lượt xem</p>
                                                <p className="text-sm font-semibold">{formatNumber(video.views)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Giờ xem</p>
                                                <p className="text-sm font-semibold">{video.watchTimeHours}h</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Likes</p>
                                                <p className="text-sm font-semibold">{formatNumber(video.likes)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4 text-orange-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Comments</p>
                                                <p className="text-sm font-semibold">{formatNumber(video.comments)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Stats */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Share2 className="h-3 w-3" />
                                            <span>{formatNumber(video.shares)} shares</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Video className="h-3 w-3" />
                                            <span>AVD: {video.averageViewDuration}s</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(video.url, '_blank')}
                                        >
                                            <ExternalLink className="h-3 w-3 mr-1" />
                                            Xem trên YouTube
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Tổng Quan Nội Dung</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Top Video (Views)</p>
                            <p className="font-semibold text-base line-clamp-2">
                                {analytics.videos.topByViews[0]?.title}
                            </p>
                            <p className="text-sm text-blue-600">
                                {formatNumber(analytics.videos.topByViews[0]?.views)} lượt xem
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Top Video (Watch Time)</p>
                            <p className="font-semibold text-base line-clamp-2">
                                {analytics.videos.topByWatchTime[0]?.title}
                            </p>
                            <p className="text-sm text-purple-600">
                                {analytics.videos.topByWatchTime[0]?.watchTimeHours}h
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Top Video (Engagement)</p>
                            <p className="font-semibold text-base line-clamp-2">
                                {analytics.videos.topByEngagement[0]?.title}
                            </p>
                            <p className="text-sm text-green-600">
                                {formatNumber(analytics.videos.topByEngagement[0]?.likes)} likes
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}