

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, X, Calendar, TrendingUp, Eye, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import type { BranchAnalytics } from '@/types/branch.types';

interface BranchAnalyticsModalProps {
    open: boolean;
    branchId: string;
    branchName: string;
    onClose: () => void;
}

export function BranchAnalyticsModal({ open, branchId, branchName, onClose }: BranchAnalyticsModalProps) {
    const { getBranchAnalytics } = useBranches({ autoFetch: false });

    const [analytics, setAnalytics] = useState<BranchAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    useEffect(() => {
        if (open && branchId) {
            fetchAnalytics();
        }
    }, [open, branchId]);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBranchAnalytics(branchId, startDate, endDate);
            setAnalytics(data);
        } catch (err: any) {
            console.error('Lấy dữ liệu phân tích thất bại:', err);
            setError(err.message || 'Lấy dữ liệu phân tích thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDateRange = () => {
        fetchAnalytics();
    };

    const formatNumber = (num: number | undefined): string => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'Tr';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    const formatDuration = (seconds: number | undefined): string => {
        if (!seconds) return '0 giờ';
        const hours = Math.floor(seconds / 3600);
        return hours.toLocaleString() + ' giờ';
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Phân Tích Chi Nhánh</h2>
                            <p className="text-sm text-white/80">{branchName}</p>
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
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="startDate" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Ngày Bắt Đầu
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={endDate}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="endDate" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Ngày Kết Thúc
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <Button
                                    onClick={handleApplyDateRange}
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Áp Dụng'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {error && !loading && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <div className="text-center text-red-600">
                                    <p className="font-medium">Không thể tải dữ liệu phân tích</p>
                                    <p className="text-sm mt-1">{error}</p>
                                    <Button
                                        onClick={fetchAnalytics}
                                        variant="outline"
                                        className="mt-3"
                                    >
                                        Thử Lại
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {loading && !analytics ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        </div>
                    ) : analytics ? (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tổng Quan Chi Nhánh</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <p className="text-sm text-slate-500">Nhóm</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {analytics.summary?.totalTeams || 0}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <BarChart3 className="w-6 h-6 text-red-600" />
                                                </div>
                                                <p className="text-sm text-slate-500">Kênh</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {analytics.summary?.totalChannels || 0}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                                </div>
                                                <p className="text-sm text-slate-500">Subscribers</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {formatNumber(analytics.summary?.totalSubscribers)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Eye className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <p className="text-sm text-slate-500">Tổng Lượt Xem</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {formatNumber(analytics.summary?.totalViews)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                    Hiệu Suất ({startDate} đến {endDate})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="border-l-4 border-l-blue-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">Lượt Xem</p>
                                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                                        {formatNumber(analytics.analytics?.views)}
                                                    </p>
                                                </div>
                                                <Eye className="w-10 h-10 text-blue-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-purple-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">Thời Gian Xem</p>
                                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                                        {formatDuration(analytics.analytics?.watchTime)}
                                                    </p>
                                                </div>
                                                <Clock className="w-10 h-10 text-purple-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-green-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">Subscribers Tăng</p>
                                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                                        +{formatNumber(analytics.analytics?.subscribersGained)}
                                                    </p>
                                                </div>
                                                <TrendingUp className="w-10 h-10 text-green-500" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-yellow-500">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">Doanh Thu Ước Tính</p>
                                                    <p className="text-3xl font-bold text-slate-900 mt-1">
                                                        ${formatNumber(analytics.analytics?.estimatedRevenue)}
                                                    </p>
                                                </div>
                                                <DollarSign className="w-10 h-10 text-yellow-500" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-lg font-semibold">ℹ</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Thông Tin Phân Tích</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Dữ liệu được tổng hợp từ tất cả các kênh trong chi nhánh này</li>
                                            <li>Doanh thu ước tính dựa trên CPM trung bình của YouTube</li>
                                            <li>Thời gian xem được tính bằng giờ</li>
                                            <li>Chọn khoảng thời gian khác nhau để xem dữ liệu lịch sử</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="text-slate-500">Không có dữ liệu phân tích</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Thử chọn khoảng thời gian khác
                            </p>
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
