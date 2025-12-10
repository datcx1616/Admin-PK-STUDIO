// src/pages/branch-analytics/types/branch-analytics.types.ts

export interface BranchAnalyticsData {
    success: boolean;
    data: {
        branch: {
            id: string;
            name: string;
            code: string;
        };
        totalTeams: number;
        totalChannels: number;
        channels: Array<{
            id: string;
            name: string;
        }>;
        dateRange: {
            startDate: string;
            endDate: string;
        };
        basic: {
            totals: {
                totalViews: number;
                totalWatchTimeMinutes: number;
                totalWatchTimeHours: string;
                totalSubscribersGained: number;
                totalSubscribersLost: number;
                totalSubscribersNet: number;
                averageViewDuration: number;
            };
            dailyData: Array<{
                date: string;
                views: number;
                watchTimeMinutes: number;
                watchTimeHours: string;
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
                likeDislikeRatio: number;
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
            ageGroups: any[];
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
            topByViews: VideoStats[];
            topByWatchTime: VideoStats[];
            topByEngagement: VideoStats[];
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
                percentage: string;
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
                percentage: string;
            }>;
            topService: string;
            totalShares: number;
        };
        channelAnalytics: ChannelAnalytics[];
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
    channelName: string;
}

export interface ChannelAnalytics {
    channelId: string;
    youtubeChannelId: string;
    channelName: string;
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
            monetizedPlaybacks: number;
            adImpressions: number;
            cpm: number;
            rpm: number;
        };
        dailyData: Array<{
            date: string;
            estimatedRevenue: number;
            estimatedAdRevenue: number;
            cpm: number;
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
            watchTimeMinutes: number;
            percentage: number;
        }>;
        subscribedPercentage: number;
        unsubscribedPercentage: number;
    } | null;
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