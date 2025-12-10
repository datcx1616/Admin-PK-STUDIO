// src/pages/channels/ChannelDetailPage.tsx
/**
 * Channel Detail Page
 * Shows detailed information and analytics for a single channel
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChannel } from '@/hooks/useChannels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Users,
    Eye,
    Video,
    TrendingUp,
    Calendar,
    Edit,
    UserPlus,
    Building2,
    Users2,
    DollarSign,
    Clock,
    ThumbsUp,
    MessageCircle,
    Share2,
} from 'lucide-react';

export default function ChannelDetailPage() {
    const { channelId } = useParams<{ channelId: string }>();
    const navigate = useNavigate();
    const { channel, loading, error } = useChannel(channelId!);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-64" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (error || !channel) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                Không tìm thấy kênh
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Kênh không tồn tại hoặc bạn không có quyền truy cập
                            </p>
                            <Button onClick={() => navigate('/channels')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại danh sách
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const formatNumber = (num: number): string => {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toLocaleString();
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/channels')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-200">
                                <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xl">
                                    {channel.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {channel.name}
                                </h1>
                                {channel.customUrl && (
                                    <p className="text-slate-600 mt-1">{channel.customUrl}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    {channel.team?.branch && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            <Building2 className="h-3 w-3 mr-1" />
                                            {channel.team.branch.name}
                                        </Badge>
                                    )}
                                    {channel.team && (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                            <Users2 className="h-3 w-3 mr-1" />
                                            {channel.team.name}
                                        </Badge>
                                    )}
                                    <Badge
                                        variant={channel.isConnected ? 'default' : 'outline'}
                                        className={
                                            channel.isConnected
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                        }
                                    >
                                        {channel.isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Phân công
                        </Button>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Subscribers</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {formatNumber(channel.subscriberCount || 0)}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Lượt xem</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {formatNumber(channel.viewCount || 0)}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Videos</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {formatNumber(channel.videoCount || 0)}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <Video className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Editors</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {channel.assignedEditors?.length || 0}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Users2 className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="videos">Videos</TabsTrigger>
                        <TabsTrigger value="editors">Editors</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Channel Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin kênh</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">
                                            YouTube Channel ID
                                        </p>
                                        <p className="text-sm text-slate-900 font-mono">
                                            {channel.youtubeChannelId}
                                        </p>
                                    </div>
                                    {channel.description && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 mb-1">
                                                Mô tả
                                            </p>
                                            <p className="text-sm text-slate-900">
                                                {channel.description}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">
                                            Ngày tạo
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {formatDate(channel.createdAt)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assigned Editors */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Editors được phân công</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {(!channel.assignedEditors || channel.assignedEditors.length === 0) ? (
                                        <p className="text-sm text-slate-500 text-center py-6">
                                            Chưa có editor nào được phân công
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {channel.assignedEditors.map((editor) => (
                                                <div
                                                    key={editor._id}
                                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                            {editor.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {editor.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {editor.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-4">
                        {channel.analytics ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Lượt xem</p>
                                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                                    {formatNumber(channel.analytics.views)}
                                                </p>
                                            </div>
                                            <Eye className="h-8 w-8 text-purple-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Thời gian xem</p>
                                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                                    {formatNumber(channel.analytics.watchTime)} giờ
                                                </p>
                                            </div>
                                            <Clock className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Doanh thu ước tính</p>
                                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                                    ${formatNumber(channel.analytics.estimatedRevenue)}
                                                </p>
                                            </div>
                                            <DollarSign className="h-8 w-8 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Subscribers tăng</p>
                                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                                    +{formatNumber(channel.analytics.subscribersGained)}
                                                </p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-orange-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <h3 className="font-semibold text-slate-900 mb-1">
                                        Chưa có dữ liệu analytics
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Kết nối kênh để xem dữ liệu phân tích chi tiết
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Videos Tab */}
                    <TabsContent value="videos" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Videos gần đây</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {channel.recentVideos && channel.recentVideos.length > 0 ? (
                                    <div className="space-y-3">
                                        {channel.recentVideos.map((video) => (
                                            <div
                                                key={video.videoId}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">
                                                        {video.title}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {formatNumber(video.views)} lượt xem
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(video.publishedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-6">
                                        Chưa có video nào
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Editors Tab */}
                    <TabsContent value="editors" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Danh sách Editors</CardTitle>
                                    <Button size="sm">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Thêm Editor
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {(!channel.assignedEditors || channel.assignedEditors.length === 0) ? (
                                    <div className="text-center py-12">
                                        <Users2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <h3 className="font-semibold text-slate-900 mb-1">
                                            Chưa có editor nào
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-4">
                                            Phân công editor để quản lý kênh này
                                        </p>
                                        <Button size="sm">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Thêm Editor đầu tiên
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {channel.assignedEditors.map((editor) => (
                                            <div
                                                key={editor._id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                                            {editor.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {editor.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">{editor.email}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                                    Editor
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}