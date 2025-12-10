// src/pages/team-analytics/components/TeamVideosTab.tsx

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Eye, Clock, ThumbsUp, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { TeamAnalyticsData, VideoStats } from "../types/team-analytics.types";
import { formatNumber, formatDuration } from "../utils/formatters";

interface TeamVideosTabProps {
    analytics: TeamAnalyticsData;
}

export function TeamVideosTab({ analytics }: TeamVideosTabProps) {
    const { videos } = analytics.data;

    const renderVideoCard = (video: VideoStats, rank: number, metric: 'views' | 'watchTime' | 'engagement') => {
        const getRankColor = (rank: number) => {
            if (rank === 1) return 'bg-amber-500';
            if (rank === 2) return 'bg-gray-400';
            if (rank === 3) return 'bg-orange-600';
            return 'bg-gray-300';
        };

        const getRankIcon = (rank: number) => {
            if (rank === 1) return '🥇';
            if (rank === 2) return '🥈';
            if (rank === 3) return '🥉';
            return `#${rank}`;
        };

        return (
            <Card key={video.videoId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                            <div className={`flex items-center justify-center h-12 w-12 rounded-full ${getRankColor(rank)} text-white font-bold text-lg`}>
                                {getRankIcon(rank)}
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-32 h-18 object-cover rounded-lg"
                            />
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                                {video.title}
                            </h4>

                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span className="font-medium">{formatNumber(video.views)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{video.watchTimeHours}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{formatNumber(video.likes)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                    {formatDuration(video.averageViewDuration)}
                                </Badge>
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Xem video →
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700 dark:text-green-400">
                            Top Videos - Views
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {videos.topByViews.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Videos có lượt xem cao
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700 dark:text-blue-400">
                            Top Videos - Watch Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                            {videos.topByWatchTime.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Videos có thời gian xem cao
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-950">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-purple-700 dark:text-purple-400">
                            Top Videos - Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                            {videos.topByEngagement.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Videos có tương tác cao
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Videos Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Top Videos Hiệu Suất Cao
                    </CardTitle>
                    <CardDescription>
                        Video có hiệu suất tốt nhất theo từng chỉ số
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="views" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="views" className="gap-2">
                                <Eye className="h-4 w-4" />
                                Lượt Xem
                            </TabsTrigger>
                            <TabsTrigger value="watchTime" className="gap-2">
                                <Clock className="h-4 w-4" />
                                Thời Gian Xem
                            </TabsTrigger>
                            <TabsTrigger value="engagement" className="gap-2">
                                <ThumbsUp className="h-4 w-4" />
                                Tương Tác
                            </TabsTrigger>
                        </TabsList>

                        {/* Top by Views */}
                        <TabsContent value="views" className="space-y-3">
                            {videos.topByViews.length > 0 ? (
                                videos.topByViews.map((video, index) =>
                                    renderVideoCard(video, index + 1, 'views')
                                )
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có dữ liệu video
                                </div>
                            )}
                        </TabsContent>

                        {/* Top by Watch Time */}
                        <TabsContent value="watchTime" className="space-y-3">
                            {videos.topByWatchTime.length > 0 ? (
                                videos.topByWatchTime.map((video, index) =>
                                    renderVideoCard(video as VideoStats, index + 1, 'watchTime')
                                )
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có dữ liệu video
                                </div>
                            )}
                        </TabsContent>

                        {/* Top by Engagement */}
                        <TabsContent value="engagement" className="space-y-3">
                            {videos.topByEngagement.length > 0 ? (
                                videos.topByEngagement.map((video, index) =>
                                    renderVideoCard(video as VideoStats, index + 1, 'engagement')
                                )
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Không có dữ liệu video
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Video Performance Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Tổng Quan Hiệu Suất Video
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-3 text-left font-semibold">Chỉ Số</th>
                                    <th className="p-3 text-right font-semibold">Video #1</th>
                                    <th className="p-3 text-right font-semibold">Video #2</th>
                                    <th className="p-3 text-right font-semibold">Video #3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b hover:bg-muted/50">
                                    <td className="p-3 font-medium">Lượt xem cao nhất</td>
                                    <td className="p-3 text-right">{videos.topByViews[0] ? formatNumber(videos.topByViews[0].views) : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[1] ? formatNumber(videos.topByViews[1].views) : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[2] ? formatNumber(videos.topByViews[2].views) : '-'}</td>
                                </tr>
                                <tr className="border-b hover:bg-muted/50">
                                    <td className="p-3 font-medium">Thời gian xem cao nhất</td>
                                    <td className="p-3 text-right">{videos.topByViews[0] ? videos.topByViews[0].watchTimeHours : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[1] ? videos.topByViews[1].watchTimeHours : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[2] ? videos.topByViews[2].watchTimeHours : '-'}</td>
                                </tr>
                                <tr className="hover:bg-muted/50">
                                    <td className="p-3 font-medium">Lượt thích cao nhất</td>
                                    <td className="p-3 text-right">{videos.topByViews[0] ? formatNumber(videos.topByViews[0].likes) : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[1] ? formatNumber(videos.topByViews[1].likes) : '-'}</td>
                                    <td className="p-3 text-right">{videos.topByViews[2] ? formatNumber(videos.topByViews[2].likes) : '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}