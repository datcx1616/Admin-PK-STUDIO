// src/types/analytics.types.ts

/**
 * Base analytics totals
 */
export interface AnalyticsTotals {
  totalViews: number;
  totalWatchTimeMinutes: number;
  totalWatchTimeHours: number;
  averageViewDuration: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSubscribers: number;
  totalSubscribersGained: number;
  totalSubscribersLost: number;
  totalSubscribersNet: number;
  totalVideos: number;
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  likeDislikeRatio: number;
  commentsPerVideo: number;
}

/**
 * Revenue metrics
 */
export interface RevenueMetrics {
  estimatedRevenue: number;
  estimatedAdRevenue: number;
  monetizedPlaybacks: number;
  adImpressions: number;
  cpm: number;
  rpm: number;
}

/**
 * Traffic source
 */
export interface TrafficSource {
  sourceType: string;
  views: number;
  watchTimeMinutes: number;
  percentage: number;
}

/**
 * Device type
 */
export interface DeviceType {
  deviceType: string;
  views: number;
  watchTimeMinutes: number;
  percentage: number;
}

/**
 * Geographic data
 */
export interface CountryData {
  country: string;
  countryName: string;
  views: number;
  watchTimeMinutes: number;
  percentage: number;
}

/**
 * Demographics
 */
export interface Demographics {
  ageGroups: Array<{
    ageRange: string;
    percentage: number;
  }>;
  gender: {
    male: number;
    female: number;
  };
  topCountries: CountryData[];
}

/**
 * Video stats
 */
export interface VideoStats {
  videoId: string;
  videoTitle: string;
  thumbnailUrl?: string;
  views: number;
  watchTimeMinutes: number;
  likes: number;
  comments: number;
  shares: number;
  publishedAt: string;
}

/**
 * Retention metrics
 */
export interface RetentionMetrics {
  averageViewPercentage: number;
  cardClickRate: number;
  impressions: number;
  impressionClickThroughRate: number;
}

/**
 * Complete analytics response
 */
export interface AnalyticsResponse {
  basic: {
    totals: AnalyticsTotals;
    timeSeriesData: Array<{
      date: string;
      views: number;
      watchTimeMinutes: number;
      subscribersGained: number;
      subscribersLost: number;
    }>;
  };
  engagement: EngagementMetrics;
  revenue: {
    totals: RevenueMetrics;
    timeSeriesData: Array<{
      date: string;
      estimatedRevenue: number;
      estimatedAdRevenue: number;
    }>;
    monetizationStatus: string;
    currency: string;
  };
  traffic: {
    sources: TrafficSource[];
    topSource: string;
  };
  devices: {
    types: DeviceType[];
    topDevice: string;
  };
  demographics: Demographics;
  videos: {
    topByViews: VideoStats[];
    topByWatchTime: VideoStats[];
    topByEngagement: VideoStats[];
  };
  retention: RetentionMetrics;
}

/**
 * Channel analytics (specific to one channel)
 */
export interface ChannelAnalytics extends AnalyticsResponse {
  channel: {
    _id: string;
    name: string;
    youtubeChannelId: string;
  };
}

/**
 * Team analytics (aggregated from team's channels)
 */
export interface TeamAnalytics extends AnalyticsResponse {
  team: {
    _id: string;
    name: string;
  };
  summary: {
    totalChannels: number;
    totalMembers: number;
  };
}

/**
 * Branch analytics (aggregated from branch's channels)
 */
export interface BranchAnalytics extends AnalyticsResponse {
  branch: {
    _id: string;
    name: string;
  };
  summary: {
    totalChannels: number;
    totalTeams: number;
  };
}