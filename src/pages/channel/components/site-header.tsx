import { IconCirclePlusFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { youtubeApi } from '@/lib/youtubeApi';
import { useState, } from 'react';
import { RefreshCw } from 'lucide-react';

interface SiteHeaderProps {
    onRefresh?: () => void | Promise<void>;
}

export function SiteHeader({ onRefresh }: SiteHeaderProps = {}) {
    const [analytics] = useState<any>(null);
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

    const handleRefresh = async () => {
        if (onRefresh) {
            setLoading(true);
            try {
                await onRefresh();
            } catch (error) {
                console.error('Refresh error:', error);
            } finally {
                setLoading(false);
            }
        } else {
            window.location.reload();
        }
    };


    return (
        <header className="bg-white shadow-sm">
            <div className="px-6 py-5 flex w-full items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-900">Quản Lý Kênh YouTube</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>

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