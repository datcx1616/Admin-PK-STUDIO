// src/pages/components/ChannelSidebar.tsx
/**
 * Sidebar component to display list of channels from Branch or Team
 * Fetches channels from API based on branchId or teamId
 * Clicking a channel shows detailed information in a dialog
 */

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, ChevronLeft, Menu, Youtube, Users, Eye, TrendingUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { channelsAPI } from "@/lib/channels-api"
import { branchesAPI } from "@/lib/branches-api"
import type { Channel, ChannelDetail } from "@/types/channel.types"
import { toast } from "sonner"

interface ChannelSidebarProps {
    branchId?: string
    teamId?: string
    className?: string
    side?: "left" | "right"
    mode?: "fixed" | "inline"
    onChannelSelect?: (channel: Channel) => void;
}

export function ChannelSidebar({
    branchId,
    teamId,
    className,
    side = "left",
    mode = "inline",
    onChannelSelect,
}: ChannelSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(true);
    const [channels, setChannels] = React.useState<Channel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    // const navigate = useNavigate();

    // Fetch channels based on branchId or teamId
    React.useEffect(() => {
        const fetchChannels = async () => {
            setLoading(true);
            try {
                let data: Channel[] = [];

                if (teamId) {
                    console.log('🔄 [ChannelSidebar] Fetching channels for TEAM:', teamId)

                    // Try API first
                    data = await channelsAPI.getByTeam(teamId)

                    console.log('📦 [ChannelSidebar] API Response:', data)
                    console.log('📊 [ChannelSidebar] Total channels returned:', data.length)

                    // Debug: Check if channels have team property
                    if (data.length > 0) {
                        console.log('🔍 [ChannelSidebar] Sample channel:', data[0])
                        console.log('🔍 [ChannelSidebar] Sample channel.team:', data[0].team)
                    }

                    // FALLBACK: If API returns all channels, filter manually by teamId
                    const filteredData = data.filter(channel => {
                        const channelTeamId = typeof channel.team === 'string'
                            ? channel.team
                            : channel.team?._id

                        const matches = channelTeamId === teamId

                        if (!matches && data.length > 5) {
                            console.log('⚠️ [ChannelSidebar] Channel filtered out:', channel.name, 'teamId:', channelTeamId)
                        }

                        return matches
                    })

                    if (filteredData.length !== data.length) {
                        console.log('⚠️ [ChannelSidebar] Filtered channels count:', filteredData.length)
                    }

                    data = filteredData
                } else if (branchId) {
                    data = await branchesAPI.getChannels(branchId) as Channel[]
                } else {
                    data = await channelsAPI.getAll()
                }

                setChannels(data);
            } catch (error) {
                toast.error('Failed to load channels');
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, [branchId, teamId]);

    const toggleSelect = (id: string, checked: boolean) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(id); else next.delete(id);
            return next;
        });
    };

    const clearSelection = () => setSelectedIds(new Set());

    const formatNumber = (num?: number) => {
        if (!num) return '0';
        return num.toLocaleString('vi-VN');
    };

    const handleChannelClick = (channel: Channel) => {
        if (onChannelSelect) {
            onChannelSelect(channel);
        }
        // Nếu không có onChannelSelect thì có thể dùng navigate như cũ
        // else navigate(`/channels/${channel._id}/analytics`);
    };

    return (
        <>
            {mode === "fixed" && !isOpen && (
                <div className={cn("fixed top-20", side === "right" ? "right-4" : "left-80")} style={{ zIndex: 99999 }}>
                    <Button variant="default" size="icon" onClick={() => setIsOpen(true)} className="h-10 w-10 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 border-0 text-white">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            )}
            <div className={cn(
                mode === "fixed"
                    ? cn("fixed top-0 h-full bg-background transition-all duration-300 ease-in-out z-30", side === "right" ? "right-0 border-l" : "left-0 border-r", isOpen ? "w-[300px]" : "w-0")
                    : cn("sticky top-0 h-[calc(100vh-0px)] transition-all duration-300 ease-in-out overflow-visible", isOpen ? "bg-background w-[300px]" : "bg-transparent w-20", isOpen ? side === "right" ? "border-l bg-background" : "border-r bg-background" : "border-transparent"),
                className
            )}>
                <div className="flex flex-col h-full">
                    {isOpen ? (
                        <div className="flex items-center justify-between px-5 py-3 border-b">
                            <div>
                                <h3 className="text-gray-900 font-bold text-sm">Danh sách kênh</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {loading ? 'Đang tải...' : `${channels.length} kênh`}
                                    {selectedIds.size > 0 && (
                                        <span className="ml-2 text-blue-600 font-medium">({selectedIds.size} đã chọn)</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedIds.size > 0 && (
                                    <Button variant="outline" size="sm" onClick={clearSelection} className="h-7 px-2 text-xs">Clear</Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7 text-gray-500 hover:text-gray-700">
                                    {side === "right" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center h-12 w-full pl-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="h-8 w-8 rounded-md bg-transparent hover:bg-gray-100 text-gray-500">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <ScrollArea className={cn("flex-1", !isOpen && "hidden")}>
                        <div className="p-3 space-y-2">
                            {loading ? (
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
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Youtube className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">Chưa có kênh nào</p>
                                </div>
                            ) : (
                                channels.map((channel) => {
                                    const isSelected = selectedIds.has(channel._id);
                                    return (
                                        <div
                                            key={channel._id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleChannelClick(channel)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleChannelClick(channel); }}
                                            className={cn(
                                                "w-full p-1.5 rounded border bg-card hover:bg-accent/60 transition-all text-left flex flex-col gap-0.5 focus:outline-none cursor-pointer",
                                                isSelected && "ring-1 ring-blue-500/50 bg-blue-50/30"
                                            )}
                                        >
                                            <div className="flex items-start gap-1.5">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) => toggleSelect(channel._id, !!checked)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-0.5"
                                                />
                                                <Avatar className="h-7 w-7 shrink-0">
                                                    <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                                                    <AvatarFallback className="bg-red-100 text-red-700">
                                                        <Youtube className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-1.5 mb-0">
                                                        <h4 className="font-medium text-xs truncate leading-tight">{channel.name}</h4>
                                                        {channel.isConnected ? (
                                                            <Badge variant="outline" className="text-[9px] py-0 h-4 bg-green-50 text-green-700 border-green-200 shrink-0">Connected</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-[9px] py-0 h-4 bg-gray-50 text-gray-700 border-gray-200 shrink-0">Offline</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground mt-0.5">
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
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            {mode === "fixed" && isOpen && (
                <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
            )}
        </>
    );
}
