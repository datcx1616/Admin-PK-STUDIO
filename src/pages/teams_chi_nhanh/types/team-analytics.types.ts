// src/pages/team-analytics/types/team-analytics.types.ts

export interface TeamAnalyticsData {
    success: boolean;
    data: {
        team: {
            id: string;
            name: string;
        };
        totalChannels: number;
        channels: Array<{
            id: string;
            name: string;
            thumbnail?: string;
        }>;
        dateRange: {
            startDate: string;
            endDate: string;
        };
        basic: {
            totals: {
                totalViews: number;
                totalWatchTimeMinutes: number;
                totalWatchTimeHours: number;
                totalSubscribersGained: number;
                totalSubscribersLost: number;
                totalSubscribersNet: number;
                averageViewDuration: number;
            };
            dailyData: Array<{
                date: string;
                views: number;
                watchTimeMinutes: number;
                watchTimeHours: number;
                subscribersGained: number;
                subscribersLost: number;
                subscribersNet: number;
                averageViewDuration: number;
                totalDuration: number;
            }>;
        };
        engagement: {
            totals: {
                totalLikes: number;
                totalDislikes: number;
                totalComments: number;
                totalShares: number;
                engagementRate: number;
                likeDislikeRatio: number | null;
            };
        };
        revenue: {
            totals: {
                estimatedRevenue: number;
                estimatedAdRevenue: number;
                monetizedPlaybacks: number;
                adImpressions: number;
                cpm: number;
                rpm: number;
            };
            dailyData: Array<{
                date: string;
                estimatedRevenue: number;
                estimatedAdRevenue: number;
                monetizedPlaybacks: number;
                adImpressions: number;
                cpm: number;
                rpm: number;
            }>;
            monetizationStatus: string;
            currency: string;
        };
        traffic: {
            sources: Array<{
                sourceType: string;
                views: number;
                watchTimeMinutes: number;
                percentage: number;
            }>;
            topSource: string;
        };
        devices: {
            types: Array<{
                deviceType: string;
                views: number;
                watchTimeMinutes: number;
                percentage: number;
            }>;
            topDevice: string;
        };
        demographics: {
            ageGroups: Array<any>;
            gender: {
                male: number;
                female: number;
            };
            topCountries: Array<{
                country: string;
                countryName: string;
                views: number;
                watchTimeMinutes: number;
                percentage: number;
            }>;
        };
        videos: {
            topByViews: Array<VideoStats>;
            topByWatchTime: Array<VideoStats>;
            topByEngagement: Array<VideoStats>;
        };
        retention: {
            averageViewPercentage: number;
            cardClickRate: number;
            impressions: number;
            impressionClickThroughRate: number;
        };
        playbackLocation: {
            locations: Array<{
                locationType: string;
                locationName: string;
                views: number;
                watchTimeMinutes: number;
                percentage: number;
            }>;
            topLocation: string;
        };
        operatingSystem: {
            systems: Array<{
                osType: string;
                osName: string;
                views: number;
                watchTimeMinutes: number;
                percentage: number;
            }>;
            topOS: string;
        };
        subscriptionStatus: {
            statuses: Array<{
                status: string;
                statusName: string;
                views: number;
                percentage: number;
            }>;
            subscribedPercentage: number;
            unsubscribedPercentage: number;
        };
        sharingServices: {
            services: Array<{
                service: string;
                serviceName: string;
                shares: number;
                percentage: number;
            }>;
            topService: string;
            totalShares: number;
        };
        channelAnalytics: Array<ChannelAnalyticsItem>;
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
    channelName?: string;
}

export interface ChannelAnalyticsItem {
    channelId: string;
    youtubeChannelId: string;
    channelName: string;
    basic: {
        totals: {
            totalViews: number;
            totalWatchTimeMinutes: number;
            totalSubscribersGained: number;
            totalSubscribersLost: number;
            totalWatchTimeHours: number;
            totalSubscribersNet: number;
            averageViewDuration: number;
        };
    };
    engagement: {
        totals: {
            totalLikes: number;
            totalDislikes: number;
            totalComments: number;
            totalShares: number;
            engagementRate: number;
            likeDislikeRatio: number | null;
        };
    };
    revenue: {
        totals: {
            estimatedRevenue: number;
            estimatedAdRevenue: number;
            monetizedPlaybacks: number;
            adImpressions: number;
            cpm: number;
            rpm: number;
        };
        monetizationStatus: string;
        currency: string;
    };
}