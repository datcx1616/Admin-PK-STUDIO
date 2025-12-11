// src/pages/channel-analytics/utils/formatters.ts

export const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return "0";
    
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
};

export const formatCurrency = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return "$0.00";
    return `$${num.toFixed(2)}`;
};

export const formatPercentage = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return "0%";
    return `${num.toFixed(2)}%`;
};

export const formatDuration = (seconds: number | undefined | null): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};