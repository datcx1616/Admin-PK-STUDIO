// src/pages/branch-analytics/utils/formatters.ts

export function formatNumber(num: number | undefined | null): string {
    if (num === undefined || num === null || isNaN(num)) return '0';
    
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    if (currency === 'USD') {
        return `$${amount.toFixed(2)}`;
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount * 23000);
}

export function formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}

export function formatWatchTime(minutes: number): string {
    if (!minutes || isNaN(minutes)) return '0 phút';
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 0) {
        return `${hours.toLocaleString()}h ${mins}m`;
    }
    return `${minutes.toLocaleString()} phút`;
}

export function formatPercentage(value: number): string {
    if (value === undefined || value === null || isNaN(value)) return '0%';
    return `${value.toFixed(2)}%`;
}

export function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
        return 'N/A';
    }
}

export function getSourceName(sourceType: string): string {
    const sourceMap: Record<string, string> = {
        'SUBSCRIBER': 'Người đăng ký',
        'RELATED_VIDEO': 'Video liên quan',
        'NO_LINK_OTHER': 'Khác',
        'YT_OTHER_PAGE': 'Trang YouTube khác',
        'END_SCREEN': 'Màn hình kết thúc',
        'YT_SEARCH': 'Tìm kiếm YouTube',
        'YT_CHANNEL': 'Trang kênh',
        'EXT_URL': 'Liên kết bên ngoài',
        'PLAYLIST': 'Playlist',
        'NOTIFICATION': 'Thông báo'
    };
    return sourceMap[sourceType] || sourceType;
}

export function getDeviceName(deviceType: string): string {
    const deviceMap: Record<string, string> = {
        'TV': 'TV / Smart TV',
        'MOBILE': 'Điện thoại',
        'DESKTOP': 'Máy tính',
        'TABLET': 'Máy tính bảng'
    };
    return deviceMap[deviceType] || deviceType;
}

