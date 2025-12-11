import { Calendar, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Channel, DateRangeType, AnalyticsResponse } from "./types"

interface AnalyticsHeaderProps {
    channels: Channel[]
    selectedChannel: string
    setSelectedChannel: (value: string) => void
    dateRange: DateRangeType
    setDateRange: (value: DateRangeType) => void
    loading: boolean
    analytics: AnalyticsResponse | null
    onRefresh: () => void
}

export function AnalyticsHeader({
    channels,
    selectedChannel,
    setSelectedChannel,
    dateRange,
    setDateRange,
    loading,
    analytics,
    onRefresh
}: AnalyticsHeaderProps) {
    return (
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 p-4 px-6">
                <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Chọn kênh:
                    </label>
                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                        <SelectTrigger className="w-full md:w-[400px]">
                            <SelectValue placeholder="Chọn kênh" />
                        </SelectTrigger>
                        <SelectContent>
                            {channels.map(channel => (
                                <SelectItem key={channel._id} value={channel._id}>
                                    <div className="flex items-center gap-2">
                                        {channel.thumbnail && (
                                            <img src={channel.thumbnail} alt="" className="w-6 h-6 rounded-full" />
                                        )}
                                        {channel.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Khoảng thời gian:
                    </label>
                    <Select value={dateRange} onValueChange={(value: DateRangeType) => setDateRange(value)}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">7 ngày qua</SelectItem>
                            <SelectItem value="30days">30 ngày qua</SelectItem>
                            <SelectItem value="90days">90 ngày qua</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end gap-2">
                    <Button onClick={onRefresh} disabled={loading || !selectedChannel}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Đang tải...' : 'Làm mới'}
                    </Button>
                </div>
            </div>

            {analytics && (
                <div className="px-6 pb-4 flex items-center justify-between">
                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                        <Calendar className="h-3 w-3" />
                        <span>
                            {new Date(analytics.dateRange.startDate).toLocaleDateString('vi-VN')} - {new Date(analytics.dateRange.endDate).toLocaleDateString('vi-VN')}
                        </span>
                    </Badge>

                    {analytics.meta && (
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Quota: {analytics.meta.quotaUsed} units</span>
                            <span>Process: {analytics.meta.processingTimeMs}ms</span>
                            <span>Cache: {new Date(analytics.meta.cacheExpiry).toLocaleTimeString('vi-VN')}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
