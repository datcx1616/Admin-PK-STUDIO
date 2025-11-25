export interface Channel {
    _id: string
    name: string
    channelId: string
    thumbnail?: string
}

export interface AnalyticsResponse {
    success: boolean
    channelId: string
    dateRange: {
        startDate: string
        endDate: string
    }
    basic: {
        totals: {
            totalViews: number
            totalWatchTimeMinutes: number
            totalWatchTimeHours: string
            totalSubscribersGained: number
            totalSubscribersLost: number
            totalSubscribersNet: number
            averageViewDuration: number
        }
        dailyData: Array<{
            date: string
            views: number
            watchTimeMinutes: number
            watchTimeHours: string
            averageViewDuration: number
            subscribersGained: number
            subscribersLost: number
            subscribersNet: number
        }>
    }
    engagement?: {
        totals: {
            totalLikes: number
            totalDislikes: number
            totalComments: number
            totalShares: number
            engagementRate: number
            likeDislikeRatio: number
        }
        dailyData: Array<{
            date: string
            likes: number
            dislikes: number
            comments: number
            shares: number
        }>
    }
    revenue?: {
        totals: {
            estimatedRevenue: number
            estimatedAdRevenue: number
            estimatedRedPartnerRevenue: number
            cpm: number
            rpm: number
            grossRevenue: number
            monetizedPlaybacks: number
            adImpressions: number
            playbackBasedCpm: number
        }
        dailyData: Array<{
            date: string
            estimatedRevenue: number
            estimatedAdRevenue: number
        }>
        monetizationStatus: 'enabled' | 'disabled'
        currency: string
    }
    traffic?: {
        sources: Array<{
            sourceType: string
            views: number
            percentage: number
            watchTimeMinutes: number
        }>
        topSource: string
    }
    devices?: {
        types: Array<{
            deviceType: string
            views: number
            percentage: number
            watchTimeMinutes: number
        }>
        topDevice: string
    }
    demographics?: {
        ageGroups: Array<{
            ageGroup: string
            viewsPercentage: number
        }>
        gender: {
            male: number
            female: number
        }
        topCountries: Array<{
            country: string
            countryName: string
            views: number
            percentage: number
            watchTimeMinutes: number
        }>
    }
    videos?: {
        topByViews: Array<VideoMetrics>
        topByWatchTime: Array<VideoMetrics>
        topByEngagement: Array<VideoMetrics>
    }
    retention?: {
        averageViewPercentage: number
        ctr: number
        impressions: number
        impressionClickThroughRate: number
        cardClickRate: number
        cardTeaserClickRate: number
        annotationClickThroughRate: number
        annotationCloseRate: number
    }
    meta: {
        queriedAt: string
        cacheExpiry: string
        quotaUsed: number
        dataAvailable: string[]
        dataUnavailable: string[]
        processingTimeMs: number
    }
}

export interface VideoMetrics {
    videoId: string
    title: string
    thumbnailUrl: string
    publishedAt: string
    views: number
    watchTimeMinutes: number
    watchTimeHours: string
    likes: number
    comments: number
    shares: number
    averageViewDuration: number
    url: string
}

export type DateRangeType = '7days' | '30days' | '90days'
