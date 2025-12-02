// src/pages/channels/ChannelManagementPage.tsx
/**
 * Main Channel Management Page
 * Displays all channels with CRUD operations
 */

import { useState, useEffect } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { channelsAPI } from '@/lib/channels-api';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    Move,
    Eye,
    Plus,
    Video,
    Users,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Building2,
    Users2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBranches } from '@/hooks/useBranches';
import { useTeams } from '@/hooks/useTeams';
import { CreateChannelDialog } from './components/CreateChannelDialog';
import { EditChannelDialog } from './components/EditChannelDialog';
import { AssignEditorDialog } from './components/AssignEditorDialog';
import { MoveChannelDialog } from './components/MoveChannelDialog';
import { SiteHeader } from "./components/site-header";
import type { Channel } from '@/types/channel.types';

export default function ChannelManagementPage() {
    const navigate = useNavigate();
    const { branches } = useBranches();
    const { teams } = useTeams();

    // Channel management
    const {
        channels,
        loading,
        refetch,
        deleteChannel,
        searchChannels,
        filterByBranch,
        filterByTeam,
    } = useChannels();

    // YouTube OAuth channels state
    const [youtubeChannels, setYoutubeChannels] = useState<any[]>([]);
    const [mergedChannels, setMergedChannels] = useState<Channel[]>([]);

    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<string>('all');
    const [selectedTeam, setSelectedTeam] = useState<string>('all');
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    // Dialogs
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    /**
     * Fetch YouTube OAuth connected channels
     */
    const fetchYouTubeChannels = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.warn('No auth token; skip my-channels fetch');
                return;
            }

            const data = await channelsAPI.getMyChannels();
            setYoutubeChannels(data);
            console.log('✅ Fetched YouTube OAuth channels:', data.length);
        } catch (error: any) {
            if (error?.message?.includes('HTTP 401') || error?.message?.includes('Unauthorized')) {
                console.warn('YouTube channels fetch unauthorized. Please re-login.');
            } else {
                console.error('❌ Error fetching YouTube channels:', error);
            }
        }
    };

    /**
     * Merge YouTube OAuth data với system channels
     * Hiển thị TẤT CẢ kênh YouTube đã kết nối (kể cả chưa import vào hệ thống)
     * Cập nhật: isConnected, subscriberCount, viewCount, videoCount, thumbnailUrl, customUrl
     */
    const mergeChannelData = () => {
        if (youtubeChannels.length === 0) {
            setMergedChannels(channels);
            return;
        }

        // Map để track các kênh YouTube đã được merge
        const mergedChannelIds = new Set<string>();

        // 1. Merge YouTube data vào các kênh đã có trong hệ thống
        const mergedSystemChannels = channels.map(channel => {
            // Tìm channel tương ứng từ YouTube OAuth data
            const youtubeChannel = youtubeChannels.find(
                ytCh =>
                    ytCh.channelId === channel.youtubeChannelId ||
                    ytCh.id === channel.youtubeChannelId ||
                    ytCh._id === channel._id
            );

            if (youtubeChannel) {
                // Đánh dấu kênh YouTube này đã được merge
                mergedChannelIds.add(youtubeChannel.channelId || youtubeChannel.id);

                // Merge data từ YouTube
                return {
                    ...channel,
                    isConnected: true,
                    subscriberCount: youtubeChannel.subscriberCount || channel.subscriberCount,
                    viewCount: youtubeChannel.viewCount || channel.viewCount,
                    videoCount: youtubeChannel.videoCount || channel.videoCount,
                    thumbnailUrl: youtubeChannel.thumbnailUrl || youtubeChannel.thumbnail || channel.thumbnailUrl,
                    customUrl: youtubeChannel.customUrl || channel.customUrl,
                    name: youtubeChannel.name || youtubeChannel.channelTitle || channel.name,
                };
            }

            return channel;
        });

        // 2. Thêm các kênh YouTube mới kết nối (chưa có trong hệ thống)
        const newYouTubeChannels = youtubeChannels
            .filter(ytCh => {
                const channelId = ytCh.channelId || ytCh.id;
                return !mergedChannelIds.has(channelId);
            })
            .map(ytCh => ({
                _id: ytCh._id || ytCh.id || ytCh.channelId,
                name: ytCh.name || ytCh.channelTitle || 'Unknown Channel',
                youtubeChannelId: ytCh.channelId || ytCh.id,
                description: ytCh.description || '',
                customUrl: ytCh.customUrl || '',
                thumbnailUrl: ytCh.thumbnailUrl || ytCh.thumbnail || '',
                subscriberCount: ytCh.subscriberCount || 0,
                viewCount: ytCh.viewCount || 0,
                videoCount: ytCh.videoCount || 0,
                isConnected: true,
                isActive: true,
                team: ytCh.team || null,
                assignedEditors: [],
                assignedTo: ytCh.assignedTo || [],
                createdAt: ytCh.connectedAt || new Date().toISOString(),
                // Đánh dấu đây là kênh mới từ YouTube (chưa import vào hệ thống)
                _isNewFromYouTube: true
            } as Channel & { _isNewFromYouTube?: boolean }));

        // 3. Kết hợp cả hai
        const finalMerged = [...mergedSystemChannels, ...newYouTubeChannels];

        setMergedChannels(finalMerged);
        console.log('✅ Merged channels:', {
            total: finalMerged.length,
            systemChannels: mergedSystemChannels.length,
            newYouTubeChannels: newYouTubeChannels.length
        });
    };

    /**
     * Handle refresh - fetch both system and YouTube data
     */
    const handleRefresh = async () => {
        await Promise.all([
            refetch(),
            fetchYouTubeChannels()
        ]);
    };

    /**
     * Auto-fetch YouTube channels on mount and when system channels change
     */
    useEffect(() => {
        fetchYouTubeChannels();
        const onFocus = () => {
            // When returning from OAuth popup, refetch both datasets
            handleRefresh();
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, []);

    /**
     * Merge data whenever channels or youtubeChannels change
     */
    useEffect(() => {
        mergeChannelData();
    }, [channels, youtubeChannels]);

    /**
     * Calculate merged stats
     */
    const mergedStats = {
        totalChannels: mergedChannels.length,
        connectedChannels: mergedChannels.filter(c => c.isConnected).length,
        disconnectedChannels: mergedChannels.filter(c => !c.isConnected).length,
        totalSubscribers: mergedChannels.reduce((sum, c) => sum + (c.subscriberCount || 0), 0),
        totalViews: mergedChannels.reduce((sum, c) => sum + (c.viewCount || 0), 0),
        totalVideos: mergedChannels.reduce((sum, c) => sum + (c.videoCount || 0), 0),
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        searchChannels(value);
    };

    // Handle branch filter
    const handleBranchFilter = (value: string) => {
        setSelectedBranch(value);
        if (value === 'all') {
            filterByBranch('');
        } else {
            filterByBranch(value);
        }
        setSelectedTeam('all'); // Reset team filter
    };

    // Handle team filter
    const handleTeamFilter = (value: string) => {
        setSelectedTeam(value);
        if (value === 'all') {
            filterByTeam('');
        } else {
            filterByTeam(value);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!selectedChannel) return;

        try {
            await deleteChannel(selectedChannel._id);
            setIsDeleteOpen(false);
            setSelectedChannel(null);
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Format number
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

    // Get filtered teams by branch
    const filteredTeams = selectedBranch === 'all'
        ? teams
        : teams.filter(team => team.branch._id === selectedBranch);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                {/* <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Quản lý Kênh YouTube</h1>
                        <p className="text-slate-600 mt-1">
                            Quản lý toàn bộ kênh YouTube trong hệ thống
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm kênh
                        </Button>
                    </div>
                </div> */}
                <SiteHeader onRefresh={handleRefresh} />
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Tổng kênh</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {mergedStats.totalChannels}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Video className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>{mergedStats.connectedChannels} kết nối</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500">
                                    <XCircle className="h-3 w-3" />
                                    <span>{mergedStats.disconnectedChannels} chưa kết nối</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Subscribers</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        {formatNumber(mergedStats.totalSubscribers)}
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
                                        {formatNumber(mergedStats.totalViews)}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
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
                                        {formatNumber(mergedStats.totalVideos)}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <Video className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm kênh, team, chi nhánh..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <Select value={selectedBranch} onValueChange={handleBranchFilter}>
                                <SelectTrigger>
                                    <Building2 className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                    {branches.map(branch => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            {branch.code ? `${branch.code} - ` : ''}{branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedTeam}
                                onValueChange={handleTeamFilter}
                                disabled={filteredTeams.length === 0}
                            >
                                <SelectTrigger>
                                    <Users2 className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Team" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả teams</SelectItem>
                                    {filteredTeams.map(team => (
                                        <SelectItem key={team._id} value={team._id}>
                                            {team.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Channels Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách kênh</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : mergedChannels.length === 0 ? (
                            <div className="text-center py-12">
                                <Video className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-1">
                                    Chưa có kênh nào
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Thêm kênh mới để bắt đầu quản lý
                                </p>
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm kênh đầu tiên
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead className="w-[300px]">Kênh</TableHead>
                                            <TableHead>Chi nhánh</TableHead>
                                            <TableHead>Team</TableHead>
                                            <TableHead>Editors</TableHead>
                                            <TableHead className="text-right">Subscribers</TableHead>
                                            <TableHead className="text-right">Videos</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Hành động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(mergedChannels.length > 0 ? mergedChannels : channels).map((channel) => (
                                            <TableRow key={channel._id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border-2 border-slate-200">
                                                            <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                                                            <AvatarFallback className="bg-linear-to-br from-red-500 to-red-600 text-white font-bold">
                                                                {channel.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-slate-900 truncate">
                                                                    {channel.name}
                                                                </p>
                                                                {(channel as any)._isNewFromYouTube && (
                                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                                                                        Mới kết nối
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {channel.customUrl && (
                                                                <p className="text-xs text-slate-500 truncate">
                                                                    {channel.customUrl}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {channel.team?.branch ? (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            {channel.team.branch.code || channel.team.branch.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">N/A</span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {channel.team ? (
                                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                            {channel.team.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Chưa gán</span>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={(channel.assignedEditors?.length || 0) > 0 ? "default" : "outline"}
                                                            className={`${(channel.assignedEditors?.length || 0) > 0
                                                                ? "bg-green-100 text-green-700 border-green-200"
                                                                : "bg-orange-50 text-orange-700 border-orange-200"
                                                                } cursor-pointer`}
                                                            onClick={() => {
                                                                setSelectedChannel(channel);
                                                                setIsAssignOpen(true);
                                                            }}
                                                        >
                                                            {(channel.assignedEditors?.length || 0) > 0
                                                                ? `${channel.assignedEditors?.length} editor${channel.assignedEditors?.length !== 1 ? 's' : ''}`
                                                                : 'Chưa gán'
                                                            }
                                                        </Badge>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Users className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="font-semibold text-slate-900">
                                                            {formatNumber(channel.subscriberCount || 0)}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Video className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="font-semibold text-slate-900">
                                                            {formatNumber(channel.videoCount || 0)}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={channel.isConnected ? "default" : "outline"}
                                                        className={
                                                            channel.isConnected
                                                                ? "bg-green-100 text-green-700 border-green-200"
                                                                : "bg-slate-100 text-slate-700 border-slate-200"
                                                        }
                                                    >
                                                        {channel.isConnected ? (
                                                            <>
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Kết nối
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Chưa kết nối
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    {(channel as any)._isNewFromYouTube ? (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => {
                                                                setSelectedChannel(channel);
                                                                setIsCreateOpen(true);
                                                            }}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Import vào hệ thống
                                                        </Button>
                                                    ) : (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => navigate(`/channels/${channel._id}`)}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Xem chi tiết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedChannel(channel);
                                                                        setIsEditOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Chỉnh sửa
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedChannel(channel);
                                                                        setIsAssignOpen(true);
                                                                    }}
                                                                >
                                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                                    Phân công editor
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedChannel(channel);
                                                                        setIsMoveOpen(true);
                                                                    }}
                                                                >
                                                                    <Move className="h-4 w-4 mr-2" />
                                                                    Chuyển team
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => {
                                                                        setSelectedChannel(channel);
                                                                        setIsDeleteOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Xóa kênh
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialogs */}
                <CreateChannelDialog
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={() => {
                        setIsCreateOpen(false);
                        refetch();
                    }}
                />

                {selectedChannel && (
                    <>
                        <EditChannelDialog
                            channel={selectedChannel}
                            isOpen={isEditOpen}
                            onClose={() => {
                                setIsEditOpen(false);
                                setSelectedChannel(null);
                            }}
                            onSuccess={() => {
                                setIsEditOpen(false);
                                setSelectedChannel(null);
                                refetch();
                            }}
                        />

                        <AssignEditorDialog
                            channel={selectedChannel}
                            isOpen={isAssignOpen}
                            onClose={() => {
                                setIsAssignOpen(false);
                                setSelectedChannel(null);
                            }}
                            onSuccess={() => {
                                setIsAssignOpen(false);
                                setSelectedChannel(null);
                                refetch();
                            }}
                        />

                        <MoveChannelDialog
                            channel={selectedChannel}
                            isOpen={isMoveOpen}
                            onClose={() => {
                                setIsMoveOpen(false);
                                setSelectedChannel(null);
                            }}
                            onSuccess={() => {
                                setIsMoveOpen(false);
                                setSelectedChannel(null);
                                refetch();
                            }}
                        />
                    </>
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa kênh</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa kênh "{selectedChannel?.name}"?
                                Thao tác này có thể được hoàn tác bởi Admin.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSelectedChannel(null)}>
                                Hủy
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}