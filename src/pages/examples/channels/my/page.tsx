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
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { SiteHeader } from "@/pages/examples/channels/components/site-header";


export default function MyChannelsPage() {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                // Use getChannels to fetch full channel details
                const response = await apiClient.getChannels();
                if (response?.data) {
                    setChannels(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch channels", error);
                toast.error("Không thể tải danh sách kênh.");
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, []);

    function formatNumber(num: number | undefined): string {
        if (num === undefined) return "0";
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    }

    function formatDate(dateString: string | undefined): string {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-6">

            <SiteHeader />
            {channels.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">Bạn chưa được phân công quản lý kênh nào.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {channels.map((channel: any) => (
                        <Card key={channel._id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <CardTitle className="text-lg font-bold line-clamp-1 mr-2">
                                            {channel.name}
                                        </CardTitle>
                                        <Badge variant={channel.isConnected ? "default" : "secondary"} className="shrink-0">
                                            {channel.isConnected ? "Connected" : "Disconnected"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {channel.description || "Chưa có mô tả"}
                                    </CardDescription>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                            {channel.team?.name || "No Team"}
                                        </span>
                                        <span>•</span>
                                        <span>Tham gia: {formatDate(channel.createdAt)}</span>
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
                                    className="flex-1"
                                    onClick={() => navigate("/videos/create")}
                                >
                                    <IconVideoPlus className="mr-2 h-4 w-4" />
                                    Upload Video
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
