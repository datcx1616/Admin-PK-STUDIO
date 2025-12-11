import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    IconVideoPlus,
    IconUsers,
    IconEye,
    IconMovie,
    IconLink
} from "@tabler/icons-react";
<<<<<<< HEAD
import { channelsAPI } from "@/lib/channels-api";
=======
import { apiClient } from "@/lib/api-client";
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
import { toast } from "sonner";
import { SiteHeader } from "@/pages/channels/components/site-header";


export default function MyChannelsPage() {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        // Get user info from localStorage
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUserInfo(JSON.parse(userStr));
        }

        const fetchChannels = async () => {
            try {
<<<<<<< HEAD
                console.log('🔄 Fetching MY channels (assigned to current user)...');
                // Sử dụng API /channels/my-channels để lấy kênh được gán cho user hiện tại
                const response = await channelsAPI.getMyChannels();
                console.log('✅ My Channels response:', response);

                if (Array.isArray(response)) {
                    setChannels(response);
                    console.log(`📺 Found ${response.length} assigned channels`);
                } else if (response?.data) {
                    setChannels(response.data);
                    console.log(`📺 Found ${response.data.length} assigned channels`);
                }
            } catch (error: any) {
                console.error("❌ Failed to fetch my channels", error);
=======
                console.log('🔄 Fetching channels for current user...');
                // Use getChannels which already filters by user role in backend
                const response = await apiClient.getChannels();
                console.log('✅ Channels response:', response);

                if (response?.data) {
                    setChannels(response.data);
                    console.log(`📺 Found ${response.data.length} channels`);
                } else if (Array.isArray(response)) {
                    setChannels(response);
                    console.log(`📺 Found ${response.length} channels`);
                }
            } catch (error: any) {
                console.error("❌ Failed to fetch channels", error);
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    toast.error("Không thể tải danh sách kênh: " + error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, [navigate]);

    function formatNumber(num: number | undefined): string {
        if (num === undefined) return "0";
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-6">

            <SiteHeader />

            {/* User Info Banner */}
            {userInfo && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                                {userInfo.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{userInfo.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {userInfo.email} • <Badge variant="outline" className="ml-1">{userInfo.role}</Badge>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {channels.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <IconUsers className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có kênh được phân công</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            {userInfo?.role === 'editor'
                                ? 'Bạn chưa được quản lý (Manager) phân công quản lý kênh nào. Vui lòng liên hệ Manager hoặc Admin để được giao kênh.'
                                : 'Bạn chưa có kênh nào trong hệ thống. Vui lòng liên hệ Admin để được hỗ trợ.'
                            }
                        </p>
                        {userInfo?.role === 'admin' && (
                            <Button onClick={() => navigate('/youtube/connect')}>
                                <IconLink className="mr-2 h-4 w-4" />
                                Kết nối kênh YouTube
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {channels.map((channel: any) => (
                        <Card key={channel._id} className="flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <CardTitle className="text-lg font-bold line-clamp-1 mr-2">
                                            {channel.name}
                                        </CardTitle>
                                        <Badge variant={channel.isConnected ? "default" : "secondary"} className="shrink-0">
                                            {channel.isConnected ? "✓ Kết nối" : "○ Chưa kết nối"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {channel.description || "Chưa có mô tả"}
                                    </CardDescription>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                                            {channel.team?.name || "No Team"}
                                        </span>
                                        {channel.team?.branch?.name && (
                                            <>
                                                <span>•</span>
                                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                                                    {channel.team.branch.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pt-4">
                                {channel.thumbnail && (
                                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-md bg-muted">
                                        <img
                                            src={channel.thumbnail}
                                            alt={channel.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <IconUsers className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Subs</span>
                                        <span className="font-bold text-sm">
                                            {formatNumber(channel.subscriberCount)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                            <IconEye className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Views</span>
                                        <span className="font-bold text-sm">
                                            {formatNumber(channel.viewCount)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                                            <IconMovie className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Videos</span>
                                        <span className="font-bold text-sm">
                                            {formatNumber(channel.videoCount)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 pt-4 border-t">
                                <Button
                                    className="flex-1 bg-red-600"
                                    onClick={() => navigate("/videos/create")}
                                >
                                    <IconVideoPlus className="mr-2 h-4 w-4" />
                                    Tải video lên
                                </Button>
                                {channel.youtubeChannelId && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a
                                            href={`https://youtube.com/channel/${channel.youtubeChannelId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <IconLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
