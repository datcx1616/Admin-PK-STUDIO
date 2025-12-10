// src/types/channel-analytics.types.ts

export interface ChannelAnalyticsData {
    success: boolean;
    channelId: string;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    meta: {
        queriedAt: string;
        cacheExpiry: string;
        quotaUsed: number;
        dataAvailable: string[];
        dataUnavailable: string[];
        processingTimeMs: number;
    };
    basic: {
        totals: {
            totalViews: number;
            totalWatchTimeMinutes: number;
            totalSubscribersGained: number;
            totalSubscribersLost: number;
            totalWatchTimeHours: string;
            totalSubscribersNet: number;
            averageViewDuration: number;
        };
        dailyData: Array<{
            date: string;
            views: number;
            watchTimeMinutes: number;
            watchTimeHours: string;
            averageViewDuration: number;
            subscribersGained: number;
            subscribersLost: number;
            subscribersNet: number;
            estimatedRevenue: number;
        }>;
    };
    engagement: {
        totals: {
            totalLikes: number;
            totalDislikes: number;
            totalComments: number;
            totalShares: number;
            engagementRate: number;
            likeDislikeRatio: number;
        };
        dailyData: Array<{
            date: string;
            likes: number;
            dislikes: number;
            comments: number;
            shares: number;
            engagementRate: number;
        }>;
    };
    revenue: {
        totals: {
            estimatedRevenue: number;
            estimatedAdRevenue: number;
            estimatedRedPartnerRevenue: number;
            cpm: number;
            rpm: number;
            grossRevenue: number;
            monetizedPlaybacks: number;
            adImpressions: number;
            playbackBasedCpm: number;
        };
        dailyData: Array<{
            date: string;
            estimatedRevenue: number;
            estimatedAdRevenue: number;
            cpm: number;
            rpm: number;
            monetizedPlaybacks: number;
            adImpressions: number;
        }>;
        monetizationStatus: string;
        currency: string;
    };
    traffic: {
        sources: Array<{
            sourceType: string;
            views: number;
            percentage: number;
            watchTimeMinutes: number;
        }>;
        topSource: string;
    };
    devices: {
        types: Array<{
            deviceType: string;
            views: number;
            percentage: number;
            watchTimeMinutes: number;
        }>;
        topDevice: string;
    };
    demographics: {
        ageGroups: any[];
        gender: {
            male: number;
            female: number;
        };
        topCountries: Array<{
            country: string;
            countryName: string;
            views: number;
            percentage: number;
            watchTimeMinutes: number;
        }>;
    };
    videos: {
        topByViews: VideoStats[];
        topByWatchTime: VideoStats[];
        topByEngagement: VideoStats[];
    };
    retention: {
        averageViewPercentage: number;
        annotationClickThroughRate: number;
        annotationCloseRate: number;
        cardClickRate: number;
        cardTeaserClickRate: number;
        ctr: number;
        impressions: number;
        impressionClickThroughRate: number;
    };
    playbackLocation: {
        locations: Array<{
            locationType: string;
            locationName: string;
            views: number;
            watchTimeMinutes: number;
            percentage: string;
        }>;
        topLocation: string;
    };
    operatingSystem: {
        systems: Array<{
            osType: string;
            osName: string;
            views: number;
            watchTimeMinutes: number;
            percentage: string;
        }>;
        topOS: string;
    };
    subscriptionStatus: {
        statuses: Array<{
            status: string;
            statusName: string;
            views: number;
            watchTimeMinutes: number;
            percentage: string;
        }>;
        subscribedPercentage: string;
        unsubscribedPercentage: string;
    };
    sharingServices: {
        services: Array<{
            service: string;
            serviceName: string;
            shares: number;
            percentage: string;
        }>;
        topService: string;
        totalShares: number;
    };
}

export interface VideoStats {
    videoId: string;
    title: string;
    thumbnailUrl: string;
    publishedAt: string;
    views: number;
    watchTimeMinutes: number;
    watchTimeHours: string;
    likes: number;
    comments: number;
    shares: number;
    averageViewDuration: number;
    url: string;
}