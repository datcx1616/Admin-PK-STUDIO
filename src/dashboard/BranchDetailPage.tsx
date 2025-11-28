// src/pages/dashboard/BranchDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
    Building2,
    Users,
    Youtube,
    TrendingUp,
    ArrowLeft,
    Eye,
    UserCheck,
    Video
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface BranchDetail {
    branch: {
        _id: string;
        name: string;
    };
    statistics: {
        totalTeams: number;
        totalChannels: number;
        totalSubscribers: number;
        totalViews: number;
    };
    teams: Array<{
        _id: string;
        name: string;
        channelsCount: number;
        subscribersSum: number;
    }>;
    topChannels: Array<{
        _id: string;
        name: string;
        subscriberCount: number;
        viewCount: number;
    }>;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

export default function BranchDetailPage() {
    const { branchId } = useParams<{ branchId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<BranchDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranchDetail = async () => {
            if (!branchId) {
                toast.error("Branch ID is required");
                return;
            }

            try {
                setLoading(true);
                const response = await apiClient.getBranchDetail(branchId);
                setData(response);
            } catch (error) {
                toast.error("Failed to load branch details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranchDetail();
    }, [branchId]);

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

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Branch not found</h2>
                    <Button onClick={() => navigate('/dashboard')} className="mt-4">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-900 to-purple-700 bg-clip-text text-transparent">
                                {data.branch.name}
                            </h1>
                            <p className="text-slate-600 mt-1">Branch Performance Overview</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Teams</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {data.statistics.totalTeams}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Channels</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {data.statistics.totalChannels}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Subscribers</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <UserCheck className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.statistics.totalSubscribers)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Views</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.statistics.totalViews)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Teams Table */}
                {data.teams && data.teams.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Teams Performance
                            </CardTitle>
                            <CardDescription>Overview of all teams in this branch</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-700">Team Name</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Channels</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Total Subscribers</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.teams.map((team) => (
                                            <TableRow key={team._id} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-medium text-slate-900">
                                                    {team.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        {team.channelsCount} channels
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        {formatNumber(team.subscribersSum)} subs
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Top Channels */}
                {data.topChannels && data.topChannels.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6" />
                                Top Performing Channels
                            </CardTitle>
                            <CardDescription>Best channels in this branch</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.topChannels.map((channel, index) => (
                                    <div
                                        key={channel._id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-lg">{channel.name}</h4>
                                                <div className="flex gap-3 mt-2">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 flex items-center gap-1">
                                                        <UserCheck className="w-3 h-3" />
                                                        {formatNumber(channel.subscriberCount)} subs
                                                    </Badge>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {formatNumber(channel.viewCount)} views
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <Video className="w-4 h-4 mr-2" />
                                            View Channel
                                        </Button>
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
