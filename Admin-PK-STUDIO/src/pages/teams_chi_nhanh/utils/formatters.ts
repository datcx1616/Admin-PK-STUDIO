// src/pages/team-analytics/utils/formatters.ts

export function formatNumber(num: number | undefined | null): string {
    if (num === undefined || num === null || isNaN(num)) return "0";
    
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
}

export function formatCurrency(amount: number | undefined | null, currency: string = 'USD'): string {
    if (amount === undefined || amount === null || isNaN(amount)) return "$0.00";
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export function formatPercentage(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) return "0%";
    return `${value.toFixed(2)}%`;
}

export function formatDuration(seconds: number | undefined | null): string {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export const TRAFFIC_SOURCE_NAMES: Record<string, string> = {
    YT_SEARCH: 'Tìm kiếm YouTube',
    SUBSCRIBER: 'Người đăng ký',
    YT_OTHER_PAGE: 'Trang YouTube khác',
    SHORTS: 'YouTube Shorts',
    YT_CHANNEL: 'Trang kênh',
    PLAYLIST: 'Danh sách phát',
    NO_LINK_OTHER: 'Không có liên kết',
    RELATED_VIDEO: 'Video liên quan',
    EXT_URL: 'URL bên ngoài',
    NOTIFICATION: 'Thông báo',
    END_SCREEN: 'Màn hình kết thúc',
    BROWSE: 'Duyệt',
    EMBEDDED: 'Nhúng'
};

export const DEVICE_TYPE_NAMES: Record<string, string> = {
    MOBILE: 'Di động',
    DESKTOP: 'Máy tính',
    TV: 'TV',
    TABLET: 'Máy tính bảng',
    GAME_CONSOLE: 'Máy chơi game'
};

export const OS_NAMES: Record<string, string> = {
    ANDROID: 'Android',
    WINDOWS: 'Windows',
    MACINTOSH: 'macOS',
    IOS: 'iOS',
    LINUX: 'Linux',
    CHROME_OS: 'Chrome OS',
    ROKUOS: 'Roku OS',
    PLAYSTATION: 'PlayStation',
    XBOX: 'Xbox'
};