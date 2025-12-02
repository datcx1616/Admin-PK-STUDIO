import { Monitor, Smartphone, Tablet, Tv } from "lucide-react"

export const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
}

export const formatCurrency = (num: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(num)
}

export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export const formatPercent = (num?: number | null): string => {
    if (num === null || num === undefined) return 'N/A'
    const n = Number(num)
    if (!Number.isFinite(n)) return 'N/A'
    return n.toFixed(2) + '%'
}

export const getDeviceIcon = (deviceType: string) => {
    const icons: Record<string, typeof Monitor> = {
        'MOBILE': Smartphone,
        'DESKTOP': Monitor,
        'TABLET': Tablet,
        'TV': Tv
    }
    return icons[deviceType] || Monitor
}

export const getTrafficSourceName = (sourceType: string): string => {
    const names: Record<string, string> = {
        'YT_SEARCH': 'YouTube Search',
        'YT_SUGGESTED': 'Suggested Videos',
        'EXT_URL': 'External URLs',
        'DIRECT': 'Direct Links',
        'YT_CHANNEL': 'Channel Pages',
        'NO_LINK_OTHER': 'Other Internal',
        'PLAYLIST': 'Playlists',
        'YT_STORY': 'YouTube Stories',
        'SHORTS': 'Shorts Feed'
    }
    return names[sourceType] || sourceType
}

export const getAgeGroupName = (ageGroup: string): string => {
    const names: Record<string, string> = {
        'age18-24': '18-24',
        'age25-34': '25-34',
        'age35-44': '35-44',
        'age45-54': '45-54',
        'age55-64': '55-64',
        'age65-': '65+'
    }
    return names[ageGroup] || ageGroup
}
