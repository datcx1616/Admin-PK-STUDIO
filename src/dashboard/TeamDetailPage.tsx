// src/pages/dashboard/TeamDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
    Users,
    Youtube,
    Video,
    Eye,
    UserCheck,
    ArrowLeft,
    Clock,
    TrendingUp
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

interface TeamDetail {
    team: {
        _id: string;
        name: string;
    };
    statistics: {
        totalChannels: number;
        totalVideos: number;
        totalSubscribers: number;
        totalViews: number;
    };
    channels: Array<{
        _id: string;
        name: string;
        subscriberCount: number;
        viewCount: number;
    }>;
    recentVideos: Array<{
        _id: string;
        title: string;
        status: string;
        channel: {
            name: string;
        };
        createdAt: string;
    }>;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'approved': 'bg-green-100 text-green-700 border-green-200',
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'rejected': 'bg-red-100 text-red-700 border-red-200',
        'draft': 'bg-gray-100 text-gray-700 border-gray-200',
        'published': 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function TeamDetailPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<TeamDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamDetail = async () => {
            if (!teamId) {
                toast.error("Team ID is required");
                return;
            }

            try {
                setLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const response = await fetch(`${API_URL}/dashboard/teams/${teamId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch team details');
                const result = await response.json();
                setData(result);
            } catch (error) {
                toast.error("Failed to load team details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamDetail();
    }, [teamId]);

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
                    <h2 className="text-2xl font-bold text-slate-900">Team not found</h2>
                    <Button onClick={() => navigate('/dashboard')} className="mt-4">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-900 to-blue-700 bg-clip-text text-transparent">
                                {data.team.name}
                            </h1>
                            <p className="text-slate-600 mt-1">Team Performance Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Videos</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Video className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {data.statistics.totalVideos}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Subscribers</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                    <UserCheck className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.statistics.totalSubscribers)}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 bg-white/90 backdrop-blur">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-slate-600 font-medium">Total Views</CardDescription>
                                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <Eye className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold text-slate-900">
                                {formatNumber(data.statistics.totalViews)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Channels Table */}
                {data.channels && data.channels.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Youtube className="w-6 h-6" />
                                Team Channels
                            </CardTitle>
                            <CardDescription>All channels managed by this team</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-slate-200 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="font-semibold text-slate-700">Channel Name</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Subscribers</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Views</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right">Performance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.channels.map((channel) => (
                                            <TableRow key={channel._id} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-medium text-slate-900">
                                                    {channel.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                        {formatNumber(channel.subscriberCount)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        {formatNumber(channel.viewCount)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm font-medium text-green-600">
                                                            {((channel.viewCount / channel.subscriberCount) || 0).toFixed(1)} avg views/sub
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Videos */}
                {data.recentVideos && data.recentVideos.length > 0 && (
                    <Card className="border-slate-200 bg-white/90 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Video className="w-6 h-6" />
                                Recent Videos
                            </CardTitle>
                            <CardDescription>Latest video submissions from this team</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.recentVideos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-2">{video.title}</h4>
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Youtube className="w-4 h-4" />
                                                    {video.channel.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={`${getStatusColor(video.status)} border font-medium`}>
                                            {video.status}
                                        </Badge>
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
