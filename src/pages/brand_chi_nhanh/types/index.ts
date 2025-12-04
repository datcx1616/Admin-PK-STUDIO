// Branch Analytics Types
export interface BranchAnalytics {
    summary?: {
        totalChannels?: number
        totalTeams?: number
        totalSubscribers?: number
        totalViews?: number
        totalVideos?: number
        totalWatchTime?: number
        averageViewDuration?: number
        totalSubscribersNet?: number
        totalLikes?: number
        totalComments?: number
        totalShares?: number
        engagementRate?: number
    }
    analytics?: {
        views?: number
        watchTime?: number
        estimatedRevenue?: number
        subscribersGained?: number
        subscribersLost?: number
        subscribersNet?: number
        averageViewDuration?: number
        likes?: number
        comments?: number
        shares?: number
        engagementRate?: number
    }
    revenue?: {
        estimatedRevenue?: number
        adRevenue?: number
        rpm?: number
        cpm?: number
        monetizedPlaybacks?: number
        adImpressions?: number
    }
    channels?: Array<{
        _id: string
        id?: string
        name: string
        youtubeChannelId?: string
        subscriberCount?: number
        viewCount?: number
    }>
}

export interface TeamWithStats {
    _id: string
    name: string
    description?: string
    membersCount: number
    channelsCount?: number
    leader?: {
        _id: string
        name: string
        email: string
    }
    stats?: {
        totalViews: number
        totalSubscribers: number
    }
}

export interface ChannelWithStats {
    _id: string
    name: string
    youtubeChannelId: string
    subscriberCount: number
    viewCount: number
    videoCount?: number
    thumbnailUrl?: string
    team?: {
        _id: string
        name: string
    }
}

export interface TotalStats {
    teams: number
    channels: number
    members: number
    subscribers: number
    views: number
    videos: number
}
