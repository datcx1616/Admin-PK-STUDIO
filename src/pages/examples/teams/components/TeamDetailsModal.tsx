// components/teams/TeamDetailsModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    Youtube,
    User,
    Mail,
    Calendar,
    AlertCircle,
    Loader2,
    TrendingUp,
    Eye,
} from 'lucide-react';
import { teamsAPI, type TeamOverview } from '@/lib/teams-api';

interface TeamDetailsModalProps {
    open: boolean;
    teamId: string | null;
    onClose: () => void;
}

export function TeamDetailsModal({ open, teamId, onClose }: TeamDetailsModalProps) {
    const [data, setData] = useState<TeamOverview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && teamId) {
            fetchTeamDetails();
        } else {
            // Reset data khi đóng modal
            setData(null);
            setError('');
        }
    }, [open, teamId]);

    const fetchTeamDetails = async () => {
        if (!teamId) return;

        setLoading(true);
        setError('');
        try {
            const overview = await teamsAPI.getOverview(teamId);
            console.log('✅ Team Overview:', overview); // Debug log
            setData(overview);
        } catch (error: any) {
            console.error('❌ Error fetching team details:', error);
            setError(error.message || 'Không thể tải thông tin nhóm');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return 'N/A';
        }
    };

    if (!teamId) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>{data?.team?.name || 'Chi tiết nhóm'}</DialogTitle>
                            <DialogDescription>
                                {loading
                                    ? 'Đang tải thông tin...'
                                    : data?.team?.description || 'Xem thông tin chi tiết về nhóm'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : !data ? (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Không có dữ liệu để hiển thị</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <User className="w-8 h-8 text-blue-600 mb-2" />
                                        <p className="text-2xl font-bold">{data.statistics?.totalMembers || 0}</p>
                                        <p className="text-xs text-slate-500">Thành viên</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <Youtube className="w-8 h-8 text-red-600 mb-2" />
                                        <p className="text-2xl font-bold">{data.statistics?.totalChannels || 0}</p>
                                        <p className="text-xs text-slate-500">Kênh</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                                        <p className="text-2xl font-bold">
                                            {formatNumber(data.statistics?.totalSubscribers || 0)}
                                        </p>
                                        <p className="text-xs text-slate-500">Subscribers</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <Eye className="w-8 h-8 text-purple-600 mb-2" />
                                        <p className="text-2xl font-bold">
                                            {formatNumber(data.statistics?.totalViews || 0)}
                                        </p>
                                        <p className="text-xs text-slate-500">Lượt xem</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="info">Thông tin</TabsTrigger>
                                <TabsTrigger value="members">Thành viên</TabsTrigger>
                                <TabsTrigger value="channels">Kênh</TabsTrigger>
                            </TabsList>

                            {/* Info Tab */}
                            <TabsContent value="info" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium">Tên nhóm</p>
                                                <p className="text-sm text-slate-600">{data.team?.name || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium">Trưởng nhóm</p>
                                                <p className="text-sm text-slate-600">
                                                    {data.team?.leader?.name || 'Chưa có'}{' '}
                                                    {data.team?.leader?.email && `(${data.team.leader.email})`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium">Ngày tạo</p>
                                                <p className="text-sm text-slate-600">
                                                    {data.team?.createdAt ? formatDate(data.team.createdAt) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {data.team?.description && (
                                            <div className="pt-3 border-t">
                                                <p className="text-sm font-medium mb-1">Mô tả</p>
                                                <p className="text-sm text-slate-600">{data.team.description}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Recent Videos */}
                                {data.recentVideos && data.recentVideos.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Video gần đây</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {data.recentVideos.map((video) => (
                                                    <div
                                                        key={video._id}
                                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{video.title}</p>
                                                            <p className="text-xs text-slate-500">{formatDate(video.createdAt)}</p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                video.status === 'approved'
                                                                    ? 'default'
                                                                    : video.status === 'pending'
                                                                        ? 'secondary'
                                                                        : 'destructive'
                                                            }
                                                        >
                                                            {video.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Members Tab */}
                            <TabsContent value="members">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Danh sách thành viên ({data.team?.members?.length || 0})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {data.team?.members && data.team.members.length > 0 ? (
                                            <div className="space-y-3">
                                                {data.team.members.map((member) => (
                                                    <div key={member._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-blue-500 text-white">
                                                                {member.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium">{member.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="truncate">{member.email}</span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline">{member.role}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>Chưa có thành viên nào trong nhóm</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Channels Tab */}
                            <TabsContent value="channels">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Danh sách kênh ({data.team?.channels?.length || 0})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {data.team?.channels && data.team.channels.length > 0 ? (
                                            <div className="space-y-3">
                                                {data.team.channels.map((channel) => (
                                                    <div
                                                        key={channel._id}
                                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <Youtube className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{channel.name}</p>
                                                                {channel.subscriberCount && (
                                                                    <p className="text-xs text-slate-500">
                                                                        {formatNumber(channel.subscriberCount)} subscribers
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={channel.isConnected ? 'default' : 'secondary'}
                                                            className={channel.isConnected ? 'bg-green-600' : ''}
                                                        >
                                                            {channel.isConnected ? '✓ Kết nối' : 'Chưa kết nối'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>Chưa có kênh nào trong nhóm</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
