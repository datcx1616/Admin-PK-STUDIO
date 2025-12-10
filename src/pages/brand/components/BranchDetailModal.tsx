
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Building2,
    X,
    User,
    Users,
    Youtube,
    TrendingUp,
    Calendar,
    MapPin,
    Loader2
} from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import type { BranchDetail } from '@/types/branch.types';

interface BranchDetailModalProps {
    open: boolean;
    branchId: string;
    onClose: () => void;
}

export function BranchDetailModal({ open, branchId, onClose }: BranchDetailModalProps) {
    const { getBranch } = useBranches({ autoFetch: false });

    const [branch, setBranch] = useState<BranchDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && branchId) {
            fetchBranch();
        }
    }, [open, branchId]);

    const fetchBranch = async () => {
        setLoading(true);
        try {
            const data = await getBranch(branchId);
            setBranch(data);
        } catch (error) {
            console.error('Lấy thông tin chi nhánh thất bại:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number | undefined): string => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'Tr';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    const formatDate = (date: string | undefined): string => {
        if (!date) return 'Không rõ';
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Chi Tiết Chi Nhánh</h2>
                            <p className="text-sm text-white/80">{branch?.name || 'Đang tải...'}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : branch ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            THÔNG TIN CƠ BẢN
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-slate-500">Tên Chi Nhánh</p>
                                                <p className="text-sm font-medium text-slate-900">{branch.name}</p>
                                            </div>

                                            {branch.code && (
                                                <div>
                                                    <p className="text-xs text-slate-500">Mã Chi Nhánh</p>
                                                    <Badge variant="outline" className="mt-1">{branch.code}</Badge>
                                                </div>
                                            )}

                                            {branch.location && (
                                                <div>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        Địa Điểm
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-900">{branch.location}</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Ngày Tạo
                                                </p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {formatDate(branch.createdAt)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-500">Trạng Thái</p>
                                                <Badge
                                                    variant={branch.isActive ? "default" : "secondary"}
                                                    className="mt-1"
                                                >
                                                    {branch.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            GIÁM ĐỐC CHI NHÁNH
                                        </h3>
                                        {branch.director ? (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-blue-500 text-white">
                                                        {branch.director.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {branch.director.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{branch.director.email}</p>
                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                        {branch.director.role === 'branch_director' ? 'Giám đốc chi nhánh' : branch.director.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500 text-center py-4">
                                                Chưa có giám đốc được phân công
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-sm font-semibold text-slate-600 mb-3">MÔ TẢ</h3>
                                    <p className="text-sm text-slate-700 whitespace-pre-line">
                                        {branch.description}
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border-l-4 border-l-blue-500">
                                    <CardContent className="pt-6 text-center">
                                        <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                        <p className="text-xs text-slate-500">Số Nhóm</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {branch.teams?.length || 0}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-red-500">
                                    <CardContent className="pt-6 text-center">
                                        <Youtube className="w-8 h-8 mx-auto mb-2 text-red-500" />
                                        <p className="text-xs text-slate-500">Số Kênh</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {branch.channels?.length || 0}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-green-500">
                                    <CardContent className="pt-6 text-center">
                                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                        <p className="text-xs text-slate-500">Tổng Subscribers</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {formatNumber(
                                                branch.channels?.reduce((sum, ch) => sum + (ch.subscriberCount || 0), 0)
                                            )}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Tabs defaultValue="teams" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="teams">
                                        Nhóm ({branch.teams?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="channels">
                                        Kênh ({branch.channels?.length || 0})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="teams" className="mt-4">
                                    {branch.teams && branch.teams.length > 0 ? (
                                        <div className="space-y-2">
                                            {branch.teams.map((team) => (
                                                <Card key={team._id}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                    <Users className="w-5 h-5 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">{team.name}</p>
                                                                    {team.description && (
                                                                        <p className="text-xs text-slate-500">{team.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant="outline">
                                                                    {team.membersCount || 0} thành viên
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                            <p>Chưa có nhóm nào</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="channels" className="mt-4">
                                    {branch.channels && branch.channels.length > 0 ? (
                                        <div className="space-y-2">
                                            {branch.channels.map((channel) => (
                                                <Card key={channel._id}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                                    <Youtube className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">{channel.name}</p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {formatNumber(channel.subscriberCount)} subscribers
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant={channel.isConnected ? "default" : "secondary"}
                                                            >
                                                                {channel.isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <Youtube className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                            <p>Chưa có kênh nào</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            Không tìm thấy thông tin chi nhánh
                        </div>
                    )}
                </div>

                <div className="border-t px-6 py-4 bg-slate-50">
                    <Button onClick={onClose} className="w-full">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}
