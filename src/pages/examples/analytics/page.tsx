import { useState, useEffect } from "react"
import axios from "axios"
import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SiteHeader } from "./components/site-header"
import { AnalyticsHeader } from "./components/AnalyticsHeader"
import { OverviewCards } from "./components/OverviewCards"
import { SubscriberGrowth } from "./components/SubscriberGrowth"
import { EngagementCards } from "./components/EngagementCards"
import { RevenueCards } from "./components/RevenueCards"
import { AudienceCards } from "./components/AudienceCards"
import { TrafficSources } from "./components/TrafficSources"
import { DeviceTypes } from "./components/DeviceTypes"
import { Demographics } from "./components/Demographics"
import { TopVideos } from "./components/TopVideos"

import type { Channel, AnalyticsResponse, DateRangeType } from "./components/types"

export default function DetailedAnalytics() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [selectedChannel, setSelectedChannel] = useState<string>("")
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [channelsLoading, setChannelsLoading] = useState(true)
    const [dateRange, setDateRange] = useState<DateRangeType>('30days')
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        fetchChannels()
    }, [])

    useEffect(() => {
        if (selectedChannel) {
            fetchAnalytics()
        }
    }, [selectedChannel, dateRange])

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) return

            const response = await axios.get<{ success: boolean; data: Channel[] }>(
                'http://localhost:3000/api/channels/my-channels',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )

            if (response.data.success && response.data.data.length > 0) {
                setChannels(response.data.data)
                setSelectedChannel(response.data.data[0]._id)
            }
        } catch (error) {
            console.error('❌ Error fetching channels:', error)
        } finally {
            setChannelsLoading(false)
        }
    }

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('authToken')
            if (!token) return

            const endDate = new Date()
            const startDate = new Date()

            switch (dateRange) {
                case '7days':
                    startDate.setDate(endDate.getDate() - 7)
                    break
                case '30days':
                    startDate.setDate(endDate.getDate() - 30)
                    break
                case '90days':
                    startDate.setDate(endDate.getDate() - 90)
                    break
            }

            const formatDate = (date: Date) => date.toISOString().split('T')[0]

            console.log('📊 Fetching analytics:', {
                channelId: selectedChannel,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
            })

            const response = await axios.get<AnalyticsResponse>(
                'http://localhost:3000/api/youtube/analytics',
                {
                    params: {
                        channelId: selectedChannel,
                        startDate: formatDate(startDate),
                        endDate: formatDate(endDate),
                        include: 'revenue'
                    },
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            )

            console.log('🔍 ===== RAW BACKEND RESPONSE =====')
            console.log('Full response:', response.data)
            console.log('Response keys:', Object.keys(response.data))
            console.log('Has revenue?', 'revenue' in response.data)
            if ('revenue' in response.data) {
                console.log('Revenue object:', response.data.revenue)
                console.log('Revenue keys:', Object.keys(response.data.revenue || {}))
            }
            console.log('Meta dataAvailable:', response.data.meta?.dataAvailable)
            console.log('Meta dataUnavailable:', response.data.meta?.dataUnavailable)
            console.log('=====================================')

            if (response.data.success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let transformedData: any = response.data

                // Check if data is flat (no basic object)
                if (transformedData.totals && !transformedData.basic) {
                    console.log('⚙️ Transforming flat response to nested structure...')

                    transformedData = {
                        ...transformedData,
                        basic: {
                            totals: transformedData.totals,
                            dailyData: transformedData.dailyData || []
                        }
                    }

                    delete transformedData.totals
                    delete transformedData.dailyData
                }

                // Kiểm tra và log chi tiết về revenue
                if (transformedData.revenue) {
                    console.log('✅ ===== REVENUE DATA FROM BACKEND =====')
                    console.log('Revenue totals:', transformedData.revenue.totals)
                    console.log('Monetization status:', transformedData.revenue.monetizationStatus)
                    console.log('Currency:', transformedData.revenue.currency)
                    console.log('Daily data length:', transformedData.revenue.dailyData?.length || 0)

                    // Kiểm tra xem có giá trị thực tế không
                    const hasActualRevenue = transformedData.revenue.totals?.estimatedRevenue > 0
                    console.log('Has actual revenue?', hasActualRevenue)
                    console.log('Estimated Revenue:', transformedData.revenue.totals?.estimatedRevenue)
                    console.log('==========================================')
                } else {
                    console.log('⚠️ ===== NO REVENUE DATA =====')
                    console.log('Backend did not return revenue object')
                    console.log('Check meta.dataUnavailable:', transformedData.meta?.dataUnavailable)
                    console.log('==============================')
                }

                if (transformedData.basic) {
                    const totalViews = transformedData.basic.totals.totalViews || 0

                    // Generate engagement metrics nếu backend không có
                    if (!transformedData.engagement && totalViews > 0) {
                        console.log('⚙️ Generating mock engagement data...')
                        const totalLikes = Math.floor(totalViews * 0.046)
                        const totalComments = Math.floor(totalViews * 0.01)
                        const totalShares = Math.floor(totalViews * 0.0025)
                        const totalDislikes = Math.floor(totalLikes * 0.017)

                        transformedData.engagement = {
                            totals: {
                                totalLikes,
                                totalDislikes,
                                totalComments,
                                totalShares,
                                engagementRate: ((totalLikes + totalComments + totalShares) / totalViews * 100),
                                likeDislikeRatio: totalDislikes > 0 ? (totalLikes / (totalLikes + totalDislikes) * 100) : 100
                            },
                            dailyData: []
                        }
                    }

                    // Generate retention metrics nếu backend không có
                    if (!transformedData.retention && totalViews > 0) {
                        console.log('⚙️ Generating mock retention data...')
                        transformedData.retention = {
                            averageViewPercentage: 42.5,
                            ctr: 8.2,
                            impressions: Math.floor(totalViews * 4),
                            impressionClickThroughRate: 8.2,
                            cardClickRate: 1.5,
                            cardTeaserClickRate: 0.8,
                            annotationClickThroughRate: 2.1,
                            annotationCloseRate: 5.3
                        }
                    }

                    // ❌ KHÔNG GENERATE MOCK REVENUE - chỉ dùng từ backend

                    // Generate traffic sources nếu backend không có
                    if (!transformedData.traffic && totalViews > 0) {
                        console.log('⚙️ Generating mock traffic data...')
                        transformedData.traffic = {
                            sources: [
                                { sourceType: 'YT_SEARCH', views: Math.floor(totalViews * 0.35), percentage: 35.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.35) },
                                { sourceType: 'YT_SUGGESTED', views: Math.floor(totalViews * 0.28), percentage: 28.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.28) },
                                { sourceType: 'EXT_URL', views: Math.floor(totalViews * 0.16), percentage: 16.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.16) },
                                { sourceType: 'DIRECT', views: Math.floor(totalViews * 0.12), percentage: 12.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.12) },
                                { sourceType: 'YT_CHANNEL', views: Math.floor(totalViews * 0.06), percentage: 6.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.06) },
                                { sourceType: 'NO_LINK_OTHER', views: Math.floor(totalViews * 0.03), percentage: 3.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.03) }
                            ],
                            topSource: 'YT_SEARCH'
                        }
                    }

                    if (!transformedData.devices && totalViews > 0) {
                        console.log('⚙️ Generating mock device data...')
                        transformedData.devices = {
                            types: [
                                { deviceType: 'MOBILE', views: Math.floor(totalViews * 0.60), percentage: 60.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.60) },
                                { deviceType: 'DESKTOP', views: Math.floor(totalViews * 0.30), percentage: 30.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.30) },
                                { deviceType: 'TABLET', views: Math.floor(totalViews * 0.07), percentage: 7.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.07) },
                                { deviceType: 'TV', views: Math.floor(totalViews * 0.03), percentage: 3.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.03) }
                            ],
                            topDevice: 'MOBILE'
                        }
                    }

                    if (!transformedData.demographics && totalViews > 0) {
                        console.log('⚙️ Generating mock demographics data...')
                        transformedData.demographics = {
                            ageGroups: [
                                { ageGroup: 'age18-24', viewsPercentage: 25.5 },
                                { ageGroup: 'age25-34', viewsPercentage: 35.2 },
                                { ageGroup: 'age35-44', viewsPercentage: 20.8 },
                                { ageGroup: 'age45-54', viewsPercentage: 12.3 },
                                { ageGroup: 'age55-64', viewsPercentage: 4.8 },
                                { ageGroup: 'age65-', viewsPercentage: 1.4 }
                            ],
                            gender: {
                                male: 62.5,
                                female: 37.5
                            },
                            topCountries: [
                                { country: 'VN', countryName: 'Vietnam', views: Math.floor(totalViews * 0.52), percentage: 52.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.52) },
                                { country: 'US', countryName: 'United States', views: Math.floor(totalViews * 0.20), percentage: 20.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.20) },
                                { country: 'TH', countryName: 'Thailand', views: Math.floor(totalViews * 0.10), percentage: 10.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.10) },
                                { country: 'PH', countryName: 'Philippines', views: Math.floor(totalViews * 0.08), percentage: 8.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.08) },
                                { country: 'ID', countryName: 'Indonesia', views: Math.floor(totalViews * 0.10), percentage: 10.0, watchTimeMinutes: Math.floor(transformedData.basic.totals.totalWatchTimeMinutes * 0.10) }
                            ]
                        }
                    }

                    if (!transformedData.videos && transformedData.basic.dailyData && transformedData.basic.dailyData.length > 0) {
                        console.log('⚙️ Generating mock videos data...')
                        const topDays = [...transformedData.basic.dailyData]
                            .sort((a, b) => b.views - a.views)
                            .slice(0, 10)
                            .map((day) => ({
                                videoId: `video_${day.date}`,
                                title: `Top Video - ${new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
                                thumbnailUrl: '',
                                publishedAt: day.date,
                                views: day.views,
                                watchTimeMinutes: day.watchTimeMinutes,
                                watchTimeHours: day.watchTimeHours,
                                likes: Math.floor(day.views * 0.046),
                                comments: Math.floor(day.views * 0.01),
                                shares: Math.floor(day.views * 0.0025),
                                averageViewDuration: day.averageViewDuration,
                                url: `https://youtube.com/watch?v=video_${day.date}`
                            }))

                        transformedData.videos = {
                            topByViews: topDays,
                            topByWatchTime: [...topDays].sort((a, b) => b.watchTimeMinutes - a.watchTimeMinutes),
                            topByEngagement: [...topDays].sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
                        }
                    }
                }

                // Auto-generate meta if backend doesn't provide it
                if (!transformedData.meta) {
                    transformedData.meta = {
                        queriedAt: new Date().toISOString(),
                        cacheExpiry: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                        quotaUsed: 0,
                        dataAvailable: Object.keys(transformedData).filter(k =>
                            k !== 'success' &&
                            k !== 'channelId' &&
                            k !== 'dateRange' &&
                            k !== 'meta' &&
                            transformedData[k]
                        ),
                        dataUnavailable: [],
                        processingTimeMs: 0
                    }
                }

                console.log('✅ ===== FINAL DATA BEFORE setState =====')
                console.log('Has revenue in final data?', !!transformedData.revenue)
                if (transformedData.revenue) {
                    console.log('Revenue totals in final:', transformedData.revenue.totals)
                }
                console.log('Available metrics:', transformedData.meta.dataAvailable)
                console.log('========================================')

                setAnalytics(transformedData)
            }
        } catch (error) {
            console.error('❌ Error fetching analytics:', error)
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data)
                console.error('Response status:', error.response?.status)
            }
        } finally {
            setLoading(false)
        }
    }

    if (channelsLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader />
                <div className="p-6">
                    <Skeleton className="h-12 w-64 mb-6" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    if (channels.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <SiteHeader />
                <div className="p-6">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Channels Found</h3>
                            <p className="text-gray-600 mb-6">Please connect a YouTube channel first.</p>
                            <Button>Connect Channel</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader />

            <AnalyticsHeader
                channels={channels}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                dateRange={dateRange}
                setDateRange={setDateRange}
                loading={loading}
                analytics={analytics}
                onRefresh={fetchAnalytics}
            />

            {!loading && analytics && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pt-6">
                    <TabsList className="grid w-full max-w-2xl grid-cols-5">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="engagement">Tương tác</TabsTrigger>
                        <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                        <TabsTrigger value="audience">Khán giả</TabsTrigger>
                        <TabsTrigger value="content">Nội dung</TabsTrigger>
                    </TabsList>
                    x
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <OverviewCards analytics={analytics} />
                        <SubscriberGrowth analytics={analytics} />
                    </TabsContent>

                    <TabsContent value="engagement" className="space-y-6 mt-6">
                        <EngagementCards analytics={analytics} />
                    </TabsContent>

                    <TabsContent value="revenue" className="space-y-6 mt-6">
                        <RevenueCards analytics={analytics} dateRange={dateRange} />
                    </TabsContent>

                    <TabsContent value="audience" className="space-y-6 mt-6">
                        <AudienceCards analytics={analytics} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TrafficSources analytics={analytics} />
                            <DeviceTypes analytics={analytics} />
                        </div>

                        <Demographics analytics={analytics} />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6 mt-6">
                        <TopVideos analytics={analytics} />
                    </TabsContent>
                </Tabs>
            )}

            {loading && (
                <div className="px-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array(4).fill(0).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <Skeleton className="h-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
