// src/pages/dashboard/AdminStatsPage.tsx
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
    Users,
    Building2,
    UsersRound,
    Youtube,
    Eye,
    TrendingUp,
    DollarSign,
    Clock,
    Shield,
    UserCog,
    UserCheck,
    User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface AdminStats {
    system: {
        totalUsers: number;
        totalBranches: number;
        totalTeams: number;
        totalChannels: number;
    };
    usersByRole: {
        admin: number;
        director: number;
        branch_director: number;
        manager: number;
        editor: number;
    };
    channelsByBranch: Array<{
        branchName: string;
        count: number;
    }>;
    analytics: {
        totalSubscribers: number;
        totalViews: number;
        totalWatchTime: number;
        estimatedRevenue: number;
    };
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    if (hours >= 1000) return `${(hours / 1000).toFixed(1)}K hours`;
    return `${hours} hours`;
};

export default function AdminStatsPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                console.log('🔄 [AdminStats] Fetching admin stats...');
                const data = await apiClient.getAdminStats();
                console.log('✅ [AdminStats] Received data:', data);
                console.log('📊 [AdminStats] Data structure:', {
                    hasSystem: !!data?.system,
                    hasUsersByRole: !!data?.usersByRole,
                    hasChannelsByBranch: !!data?.channelsByBranch,
                    hasAnalytics: !!data?.analytics,
                    system: data?.system,
                    usersByRole: data?.usersByRole
                });
                setStats(data);
            } catch (error) {
                toast.error("Failed to load admin statistics");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    const roleIcons = {
        admin: Shield,
        director: UserCog,
        branch_director: Building2,
        manager: UserCheck,
        editor: User
    };

    const roleColors = {
        admin: 'from-red-500 to-pink-500',
        director: 'from-blue-500 to-cyan-500',
        branch_director: 'from-purple-500 to-indigo-500',
        manager: 'from-green-500 to-emerald-500',
        editor: 'from-orange-500 to-yellow-500'
    };

    const roleLabels = {
        admin: 'Admin',
        director: 'Director',
        branch_director: 'Branch Director',
        manager: 'Manager',
        editor: 'Editor'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-5">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-700 bg-clip-text text-transparent">
                        Thống kê của quản trị viên
                    </h1>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Users</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {stats?.system?.totalUsers || 0}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Branches</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {stats?.system?.totalBranches || 0}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Teams</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <UsersRound className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {stats?.system?.totalTeams || 0}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Channels</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {stats?.system?.totalChannels || 0}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Users by Role */}
                <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            Users by Role
                        </CardTitle>
                        <CardDescription>Distribution of users across different roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {Object.entries(stats?.usersByRole || {}).map(([role, count]) => {
                                const Icon = roleIcons[role as keyof typeof roleIcons];
                                const colorClass = roleColors[role as keyof typeof roleColors];
                                const label = roleLabels[role as keyof typeof roleLabels];

                                return (
                                    <Card key={role} className="relative overflow-hidden group hover:shadow-lg transition-all border-slate-200">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5 group-hover:opacity-10 transition-opacity`} />
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <CardDescription className="text-xs text-slate-600 font-medium uppercase tracking-wide">
                                                    {label}
                                                </CardDescription>
                                                <div className={`p-2 bg-gradient-to-br ${colorClass} rounded-lg shadow-md`}>
                                                    <Icon className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-3xl font-bold text-slate-900">
                                                {count}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Analytics */}
                <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            YouTube Analytics
                        </CardTitle>
                        <CardDescription>Overall platform performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Subscribers</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatNumber(stats?.analytics?.totalSubscribers || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Total Views</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatNumber(stats?.analytics?.totalViews || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Watch Time</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatTime(stats?.analytics?.totalWatchTime || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Revenue</p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        ${formatNumber(stats?.analytics?.estimatedRevenue || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Channels by Branch */}
                {stats?.channelsByBranch && stats.channelsByBranch.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Building2 className="w-6 h-6" />
                                Channels by Branch
                            </CardTitle>
                            <CardDescription>Channel distribution across branches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-700">Branch Name</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Channels</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Percentage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats.channelsByBranch.map((branch, index) => {
                                            const total = stats.channelsByBranch.reduce((sum, b) => sum + b.count, 0);
                                            const percentage = ((branch.count / total) * 100).toFixed(1);

                                            return (
                                                <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="font-medium text-slate-900">
                                                        {branch.branchName}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
                                                            {branch.count} channels
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700 w-12 text-right">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
