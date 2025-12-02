
import * as React from "react"
import { ChevronRight, ChevronLeft, Menu, Youtube, Users, Eye, TrendingUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { channelsAPI } from "@/lib/channels-api"
import type { Channel, ChannelDetail } from "@/types/channel.types"
import { toast } from "sonner"

interface ChannelSidebarProps {
    branchId?: string
    teamId?: string
    className?: string
    side?: "left" | "right"
    mode?: "fixed" | "inline"
}

export function ChannelSidebar({
    branchId,
    teamId,
    className,
    side = "left",
    mode = "inline"
}: ChannelSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(true)
    const [channels, setChannels] = React.useState<Channel[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedChannel, setSelectedChannel] = React.useState<ChannelDetail | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [loadingDetail, setLoadingDetail] = React.useState(false)

    // Fetch channels based on branchId or teamId
    React.useEffect(() => {
        const fetchChannels = async () => {
            setLoading(true)
            try {
                let data: Channel[] = []

                if (teamId) {
                    console.log('🔄 Fetching channels for team:', teamId)
                    data = await channelsAPI.getByTeam(teamId)
                } else if (branchId) {
                    console.log('🔄 Fetching channels for branch:', branchId)
                    data = await channelsAPI.getByBranch(branchId)
                } else {
                    console.log('🔄 Fetching all channels')
                    data = await channelsAPI.getAll()
                }

                console.log('✅ Fetched channels:', data)
                setChannels(data)
            } catch (error) {
                console.error('❌ Error fetching channels:', error)
                toast.error('Failed to load channels')
            } finally {
                setLoading(false)
            }
        }

        fetchChannels()
    }, [branchId, teamId])

    // Handle channel click - fetch detailed info
    const handleChannelClick = async (channel: Channel) => {
        setLoadingDetail(true)
        setDialogOpen(true)

        try {
            console.log('🔄 Fetching channel detail:', channel._id)
            const detail = await channelsAPI.getDetail(channel._id)
            console.log('✅ Channel detail:', detail)
            setSelectedChannel(detail)
        } catch (error) {
            console.error('❌ Error fetching channel detail:', error)
            toast.error('Failed to load channel details')
            setDialogOpen(false)
        } finally {
            setLoadingDetail(false)
        }
    }

    // Format numbers
    const formatNumber = (num: number | undefined) => {
        if (!num) return '0'
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    return (
        <>
            {/* Toggle Button - Fixed position when sidebar is closed */}
            {mode === "fixed" && !isOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "fixed top-20 z-50 h-8 w-8 rounded-full shadow-md bg-background border",
                        side === "right" ? "right-4" : "left-4"
                    )}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    mode === "fixed"
                        ? cn(
                            "fixed top-0 h-full bg-background transition-all duration-300 ease-in-out z-40",
                            side === "right" ? "right-0 border-l" : "left-0 border-r",
                            isOpen ? "w-96" : "w-0"
                        )
                        : cn(
                            "sticky top-0 h-[calc(100vh-0px)] transition-all duration-300 ease-in-out overflow-hidden",
                            isOpen ? "bg-background w-96" : "bg-transparent w-8",
                            isOpen
                                ? side === "right" ? "border-l bg-background" : "border-r bg-background"
                                : "border-transparent"
                        ),
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    {isOpen ? (
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <div>
                                <h3 className="text-gray-900 font-bold text-sm">Danh sách kênh</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {loading ? 'Đang tải...' : `${channels.length} kênh`}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-7 w-7 text-gray-500 hover:text-gray-700"
                            >
                                {side === "right" ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-12">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(true)}
                                className="h-7 w-7 rounded-full bg-background border shadow text-gray-700"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Content */}
                    <ScrollArea className={cn("flex-1", !isOpen && "hidden")}>
                        <div className="p-3 space-y-2">
                            {loading ? (
                                // Loading skeletons
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="p-3 rounded-lg border bg-card">
                                        <div className="flex items-start gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : channels.length === 0 ? (
                                // Empty state
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Youtube className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        Chưa có kênh nào
                                    </p>
                                </div>
                            ) : (
                                // Channel list
                                channels.map((channel) => (
                                    <button
                                        key={channel._id}
                                        onClick={() => handleChannelClick(channel)}
                                        className="w-full p-3 rounded-lg border bg-card hover:bg-accent transition-all hover:shadow-sm text-left"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                                                <AvatarFallback className="bg-red-100 text-red-700">
                                                    <Youtube className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-medium text-sm truncate">
                                                        {channel.name}
                                                    </h4>
                                                    {channel.isConnected ? (
                                                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 shrink-0">
                                                            Connected
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200 shrink-0">
                                                            Offline
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>{formatNumber(channel.subscriberCount)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        <span>{formatNumber(channel.viewCount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Channel Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {loadingDetail ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : selectedChannel ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedChannel.thumbnailUrl} alt={selectedChannel.name} />
                                        <AvatarFallback className="bg-red-100 text-red-700">
                                            <Youtube className="h-8 w-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <DialogTitle className="text-xl mb-1">
                                            {selectedChannel.name}
                                        </DialogTitle>
                                        <DialogDescription className="flex flex-wrap items-center gap-2">
                                            {selectedChannel.customUrl && (
                                                <span className="text-blue-600">
                                                    {selectedChannel.customUrl}
                                                </span>
                                            )}
                                            {selectedChannel.isConnected ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    Connected
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                                    Disconnected
                                                </Badge>
                                            )}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Description */}
                                {selectedChannel.description && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Mô tả</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedChannel.description}
                                        </p>
                                    </div>
                                )}

                                {/* Statistics */}
                                <div>
                                    <h4 className="font-semibold mb-3">Thống kê</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span className="text-xs">Subscribers</span>
                                            </div>
                                            <p className="text-xl font-bold">
                                                {formatNumber(selectedChannel.subscriberCount)}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                                <Eye className="h-4 w-4" />
                                                <span className="text-xs">Total Views</span>
                                            </div>
                                            <p className="text-xl font-bold">
                                                {formatNumber(selectedChannel.viewCount)}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                                <Youtube className="h-4 w-4" />
                                                <span className="text-xs">Videos</span>
                                            </div>
                                            <p className="text-xl font-bold">
                                                {selectedChannel.videoCount || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics (if available) */}
                                {selectedChannel.analytics && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Analytics</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="text-xs">Views</span>
                                                </div>
                                                <p className="text-lg font-bold">
                                                    {formatNumber(selectedChannel.analytics.views)}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-xs">Subscribers Gained</span>
                                                </div>
                                                <p className="text-lg font-bold">
                                                    +{formatNumber(selectedChannel.analytics.subscribersGained)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Team Info */}
                                {selectedChannel.team && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Team</h4>
                                        <div className="p-3 rounded-lg border bg-card">
                                            <p className="font-medium">{selectedChannel.team.name}</p>
                                            {selectedChannel.team.branch && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {selectedChannel.team.branch.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Assigned Editors */}
                                {selectedChannel.assignedEditors && selectedChannel.assignedEditors.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Assigned Editors</h4>
                                        <div className="space-y-2">
                                            {selectedChannel.assignedEditors.map((editor) => (
                                                <div key={editor._id} className="flex items-center gap-3 p-2 rounded-lg border bg-card">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                            {editor.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{editor.name}</p>
                                                        <p className="text-xs text-muted-foreground">{editor.email}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {editor.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Videos */}
                                {selectedChannel.recentVideos && selectedChannel.recentVideos.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Recent Videos</h4>
                                        <div className="space-y-2">
                                            {selectedChannel.recentVideos.map((video) => (
                                                <div key={video.videoId} className="p-3 rounded-lg border bg-card">
                                                    <p className="font-medium text-sm mb-1">{video.title}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            <span>{formatNumber(video.views)}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span>{new Date(video.publishedAt).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {selectedChannel.customUrl && (
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                window.open(`https://youtube.com/${selectedChannel.customUrl}`, '_blank')
                                            }}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Xem trên YouTube
                                        </Button>
                                    )}
                                    <Button
                                        variant="default"
                                        className="flex-1"
                                        onClick={() => {
                                            window.location.href = `/channels/${selectedChannel._id}`
                                        }}
                                    >
                                        Xem chi tiết đầy đủ
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Overlay when sidebar is open (optional, for mobile) */}
            {mode === "fixed" && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}