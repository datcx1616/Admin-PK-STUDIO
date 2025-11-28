// src/pages/dashboard/DashboardOverviewPage.tsx - WITH NAVIGATION
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
    BarChart3,
    TrendingUp,
    Users,
    Youtube,
    Eye,
    RefreshCw,
    Calendar,
    Activity,
    AlertCircle,
    ArrowRight,
    Building2,
    Video
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardStats {
    summary: {
        totalBranches: number;
        totalTeams: number;
        totalChannels: number;
        totalSubscribers: number;
        totalViews: number;
        totalVideos: number;
    };
    topChannels?: Array<{
        _id?: string;
        name: string;
        subscriberCount: number;
        viewCount: number;
    }>;
    recentActivity?: Array<{
        type: string;
        video?: any;
        timestamp: string;
    }>;
    branches?: Array<{
        _id: string;
        name: string;
        teams?: any[];
    }>;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

export default function DashboardOverviewPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 [Dashboard] Fetching data...');
            const data = await apiClient.getDashboardOverview();
            console.log('✅ [Dashboard] Data loaded:', data);
            console.log('📺 [Dashboard] topChannels:', data.topChannels);
            console.log('📺 [Dashboard] topChannels length:', data.topChannels?.length);
            console.log('🎬 [Dashboard] recentActivity:', data.recentActivity);
            console.log('🎬 [Dashboard] recentActivity length:', data.recentActivity?.length);

            // Fallback: if topChannels missing and user is admin/director, fetch from admin-stats
            const userStrLocal = localStorage.getItem('user');
            let currentUser: any = null;
            if (userStrLocal) {
                try {
                    currentUser = JSON.parse(userStrLocal);
                } catch (parseErr) {
                    console.warn('⚠️ [Dashboard] Failed to parse stored user JSON', parseErr);
                }
            }
            const role = currentUser?.role || '';

            if ((!data.topChannels || data.topChannels.length === 0) && ['admin', 'director'].includes(role)) {
                console.log('ℹ️ [Dashboard] topChannels missing, fetching from admin-stats...');
                try {
                    const adminStats = await apiClient.getAdminStats();
                    console.log('✅ [Dashboard] Admin-stats topChannels:', adminStats.topChannels);
                    const merged = { ...data, topChannels: adminStats.topChannels || [] } as any;
                    setStats(merged);
                } catch (e) {
                    console.warn('⚠️ [Dashboard] Failed to fetch admin-stats for topChannels', e);
                    setStats(data as any);
                }
            } else {
                setStats(data as any);
            }
        } catch (error: any) {
            console.error('❌ [Dashboard] Error:', error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to load dashboard data";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncAll = async () => {
        try {
            setSyncing(true);
            await apiClient.syncAllChannels();
            toast.success("Sync completed successfully");
            fetchDashboardData();
        } catch (error: any) {
            console.error('❌ [Dashboard] Sync error:', error);
            toast.error("Failed to sync channels");
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i}>
                            <CardHeader className="pb-3">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-32" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-2xl mx-auto mt-20">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="ml-2">
                            <p className="font-semibold mb-2">Failed to load dashboard data</p>
                            <p className="text-sm mb-4">{error}</p>
                            <Button onClick={fetchDashboardData} size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    const hasNoData = stats?.summary &&
        stats.summary.totalBranches === 0 &&
        stats.summary.totalTeams === 0 &&
        stats.summary.totalChannels === 0;

    // Get user role for conditional navigation
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userRole = user?.role || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Trang tổng quan
                            </h1>
                            <p className="text-slate-600 mt-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Admin Stats Button - Only for Admin/Director */}
                            {['admin', 'director'].includes(userRole) && (
                                <Button
                                    onClick={() => navigate('/dashboard/admin-stats')}
                                    variant="outline"
                                    className="border-blue-200 hover:bg-blue-50"
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Thống kê
                                </Button>
                            )}
                            <Button
                                onClick={handleSyncAll}
                                disabled={syncing}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                                {syncing ? 'Syncing...' : 'Sync All Channels'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning if no data */}
            {hasNoData && (
                <div className="px-6 pt-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="ml-2">
                            <p className="font-semibold">No data available</p>
                            <p className="text-sm mt-1">Database appears to be empty. Add some data to see statistics.</p>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Stats Grid */}
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Branches - CLICKABLE */}
                    <Card
                        className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur cursor-pointer"
                        onClick={() => {
                            if (stats?.summary?.totalBranches && stats.summary.totalBranches > 0) {
                                // If you have branches list, could navigate to first branch
                                // or show branches list page
                                toast.info('Click on a branch in the list below to view details');
                            }
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Chi nhánh</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {stats?.summary?.totalBranches || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600 font-medium">Đang hoạt động</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Teams */}
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Teams</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                {stats?.summary?.totalTeams || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <Activity className="w-4 h-4 text-blue-500 mr-1" />
                                <span className="text-blue-600 font-medium">Active teams</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Channels */}
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Kênh YouTube</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                {stats?.summary?.totalChannels || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600 font-medium">Đã kết nối</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Subscribers */}
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Subscribers</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {formatNumber(stats?.summary?.totalSubscribers || 0)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600 font-medium">Tổng đăng ký</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Views */}
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Lượt xem</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                {formatNumber(stats?.summary?.totalViews || 0)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <Eye className="w-4 h-4 text-amber-500 mr-1" />
                                <span className="text-amber-600 font-medium">Tổng views</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Videos */}
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/80 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Videos</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                {stats?.summary?.totalVideos || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm">
                                <Activity className="w-4 h-4 text-violet-500 mr-1" />
                                <span className="text-violet-600 font-medium">Tổng videos</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Branches List - CLICKABLE */}
                {stats?.branches && stats.branches.length > 0 && (
                    <Card className="border-slate-200 bg-white/80 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Building2 className="w-6 h-6" />
                                Chi nhánh
                            </CardTitle>
                            <CardDescription>Click để xem chi tiết từng chi nhánh</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats.branches.map((branch, index) => (
                                    <div
                                        key={branch._id || index}
                                        onClick={() => navigate(`/dashboard/branch/${branch._id}`)}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all border border-slate-200 hover:border-blue-300 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold shadow-lg">
                                                {branch.name?.charAt(0) || 'B'}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{branch.name}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        {branch.teams?.length || 0} teams
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Top Channels - CLICKABLE */}
                {stats?.topChannels && stats.topChannels.length > 0 && (
                    <Card className="border-slate-200 bg-white/80 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Video className="w-6 h-6" />
                                Top Channels
                            </CardTitle>
                            <CardDescription>Các kênh có hiệu suất cao nhất - Click để xem analytics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topChannels.map((channel, index) => (
                                    <div
                                        key={channel._id || index}
                                        onClick={() => {
                                            if (channel._id) {
                                                navigate(`/dashboard/channels/${channel._id}/analytics`);
                                            } else {
                                                toast.info('Channel analytics not available');
                                            }
                                        }}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-red-50 hover:to-orange-50 transition-all border border-slate-200 hover:border-red-300 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold shadow-lg">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{channel.name}</h4>
                                                <div className="flex gap-4 mt-1">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        {formatNumber(channel.subscriberCount)} subs
                                                    </Badge>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        {formatNumber(channel.viewCount)} views
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Activity */}
                {stats?.recentActivity && stats.recentActivity.length > 0 && (
                    <Card className="border-slate-200 bg-white/80 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Recent Activity</CardTitle>
                            <CardDescription>Hoạt động gần đây của hệ thống</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">
                                                {activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">
                                                {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
