// src/pages/branch-analytics/components/ContentTab.tsx

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDuration } from "../utils/formatters";
import type { BranchAnalyticsData } from "../types/branch-analytics.types";
import { Video, Eye, Clock, ThumbsUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface ContentTabProps {
    analytics: BranchAnalyticsData | null;
}

export function ContentTab({ analytics }: ContentTabProps) {
    // ✅ Defensive programming
    if (!analytics?.data?.videos) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Dữ liệu video không khả dụng.
                </AlertDescription>
            </Alert>
        );
    }

    const { videos } = analytics.data;
    const topByViews = videos.topByViews || [];
    const topByWatchTime = videos.topByWatchTime || [];
    const topByEngagement = videos.topByEngagement || [];

    // ✅ Check minimum data
    if (topByViews.length === 0 && topByWatchTime.length === 0 && topByEngagement.length === 0) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Không có dữ liệu video trong khoảng thời gian này.
                </AlertDescription>
            </Alert>
        );
    }

    // Calculate totals
    const totalViews = topByViews.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalWatchTime = topByViews.reduce((sum, v) => sum + (v.watchTimeMinutes || 0), 0);
    const totalLikes = topByViews.reduce((sum, v) => sum + (v.likes || 0), 0);

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Video}
                    title="Tổng Video"
                    value={topByViews.length.toString()}
                    subtitle="Video phân tích"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MetricCard
                    icon={Eye}
                    title="Tổng Lượt Xem"
                    value={formatNumber(totalViews)}
                    subtitle="Từ top videos"
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                />
                <MetricCard
                    icon={Clock}
                    title="Thời Gian Xem"
                    value={`${(totalWatchTime / 60).toFixed(0)}h`}
                    subtitle={formatNumber(totalWatchTime) + " phút"}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <MetricCard
                    icon={ThumbsUp}
                    title="Tổng Likes"
                    value={formatNumber(totalLikes)}
                    subtitle="Từ top videos"
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Top Videos by Views */}
            {topByViews.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Top Videos Theo Lượt Xem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topByViews.slice(0, 10).map((video, index) => (
                                <div
                                    key={video.videoId}
                                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                >
                                    {/* Rank */}
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-32 h-18 object-cover rounded"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold line-clamp-2 mb-2">
                                            {video.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {formatNumber(video.views)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {video.watchTimeHours}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="h-3 w-3" />
                                                {formatNumber(video.likes)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex-shrink-0 text-right">
                                        <Badge variant="secondary" className="mb-2">
                                            {formatNumber(video.views)} views
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                            Avg: {formatDuration(video.averageViewDuration)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Videos by Watch Time */}
            {topByWatchTime.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Top Videos Theo Thời Gian Xem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">#</th>
                                        <th className="text-left py-3 px-4">Video</th>
                                        <th className="text-right py-3 px-4">Lượt Xem</th>
                                        <th className="text-right py-3 px-4">Thời Gian Xem</th>
                                        <th className="text-right py-3 px-4">Avg Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topByWatchTime.slice(0, 10).map((video, index) => (
                                        <tr key={video.videoId} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-bold text-blue-600">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={video.thumbnailUrl}
                                                        alt={video.title}
                                                        className="w-20 h-12 object-cover rounded"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-medium line-clamp-2">
                                                            {video.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(video.views)}
                                            </td>
                                            <td className="text-right py-3 px-4 font-semibold text-green-600">
                                                {video.watchTimeHours}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatDuration(video.averageViewDuration)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Videos by Engagement */}
            {topByEngagement.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5" />
                            Top Videos Theo Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">#</th>
                                        <th className="text-left py-3 px-4">Video</th>
                                        <th className="text-right py-3 px-4">Likes</th>
                                        <th className="text-right py-3 px-4">Comments</th>
                                        <th className="text-right py-3 px-4">Shares</th>
                                        <th className="text-right py-3 px-4">Lượt Xem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topByEngagement.slice(0, 10).map((video, index) => (
                                        <tr key={video.videoId} className="border-b hover:bg-accent/50">
                                            <td className="py-3 px-4 font-bold text-blue-600">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={video.thumbnailUrl}
                                                        alt={video.title}
                                                        className="w-20 h-12 object-cover rounded"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-medium line-clamp-2">
                                                            {video.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right py-3 px-4 text-blue-600">
                                                {formatNumber(video.likes)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-green-600">
                                                {formatNumber(video.comments)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-purple-600">
                                                {formatNumber(video.shares)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {formatNumber(video.views)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}