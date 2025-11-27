import { IconCirclePlusFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { youtubeApi } from '@/lib/youtubeApi';
import React, { useState, useEffect } from 'react';

export function SiteHeader() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);
            await youtubeApi.login();
        } catch (err: any) {
            setError(err.message || 'Lỗi không xác định');
            console.error('Login error:', err);
        }
    };

    const fetchAnalytics = async () => {
        // TODO: Fix analytics - need channelId parameter
        // setLoading(true);
        // setError(null);
        // try {
        //     const data = await youtubeApi.getChannelAnalytics(channelId, '2024-01-01', '2024-12-31');
        //     setAnalytics(data);
        //     console.log('Analytics data:', data);
        // } catch (err: any) {
        //     console.error('Error fetching analytics:', err);
        //     setError(err.message);
        // } finally {
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        // Temporarily disabled - analytics needs channelId
        // const checkAndFetch = async () => {
        //     try {
        //         const status = await youtubeApi.getStatus();
        //         if (status.connected) {
        //             fetchAnalytics();
        //         }
        //     } catch (error) {
        //         console.log('Chưa kết nối YouTube');
        //     }
        // };

        // checkAndFetch();
    }, []);

    return (
        <header className="bg-background/90 pb-3 sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full pt-2 items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <h1 className="text-base font-medium">Quản Lý Kênh YouTube</h1>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        <IconCirclePlusFilled className="mr-2 h-4 w-4" />
                        Đăng nhập YouTube
                    </Button>

                    {loading && (
                        <span className="text-sm text-gray-500">Đang tải...</span>
                    )}

                    {analytics && (
                        <span className="text-sm text-green-600 font-medium">
                            ✓ Đã kết nối
                        </span>
                    )}

                    {error && (
                        <span className="text-sm text-red-600">
                            ❌ {error}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}