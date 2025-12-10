// src/pages/components/ChannelSidebar.tsx
/**
 * REDESIGNED - Minimal Sidebar
 * Chỉ hiển thị: Checkbox + Icon + Tên kênh
 * Style giống: Editor, Markdown, Images & media...
 */

import * as React from "react"
import { ChevronRight, ChevronLeft, Youtube, Plus, File, Users, Link, BookOpen, Languages, Download } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
// import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { channelsAPI } from "@/lib/channels-api"
import { branchesAPI } from "@/lib/branches-api"
import type { Channel } from "@/types/channel.types"
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
    // const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [activeChannelId, setActiveChannelId] = React.useState<string | null>(null);

    // Fetch channels
    React.useEffect(() => {
        const fetchChannels = async () => {
            setLoading(true);
            try {
                let data: Channel[] = [];

                if (teamId) {
                    data = await channelsAPI.getByTeam(teamId);

                    // Fallback filter
                    const filteredData = data.filter(channel => {
                        const channelTeamId = typeof channel.team === 'string'
                            ? channel.team
                            : channel.team?._id;
                        return channelTeamId === teamId;
                    });

                    data = filteredData;
                } else if (branchId) {
                    data = await branchesAPI.getChannels(branchId) as Channel[];
                } else {
                    data = await channelsAPI.getAll();
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

    // const toggleSelect = (id: string, checked: boolean) => {
    //     setSelectedIds(prev => {
    //         const next = new Set(prev);
    //         if (checked) next.add(id);
    //         else next.delete(id);
    //         return next;
    //     });
    // };

    // const clearSelection = () => setSelectedIds(new Set());

    const handleChannelClick = (channel: Channel) => {
        setActiveChannelId(channel._id);
        if (onChannelSelect) {
            onChannelSelect(channel);
        }
    };

    return (
        <>
            {/* Toggle button khi đóng (fixed mode) */}
            {mode === "fixed" && !isOpen && (
                <div className={cn("fixed top-20", side === "right" ? "right-4" : "left-80")} style={{ zIndex: 99999 }}>
                    <Button
                        variant="default"
                        size="icon"
                        onClick={() => setIsOpen(true)}
                        className="h-10 w-10 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Main Sidebar */}
            <div
                className={cn(
                    mode === "fixed"
                        ? cn(
                            "fixed top-0 h-full transition-all duration-300 ease-in-out z-30",
                            side === "right" ? "right-0" : "left-0",
                            isOpen ? "w-[280px]" : "w-0"
                        )
                        : cn(
                            "sticky top-0 h-[calc(100vh-0px)] transition-all duration-300 ease-in-out",
                            isOpen ? "w-[280px]" : "w-16"  // ✅ CHANGED: w-0 → w-16 (show toggle button)
                        ),
                    className
                )}
                style={isOpen ? {
                    backgroundColor: '#FFFFFF',
                    borderRight: side === "left" ? '1px solid #E5E7EB' : 'none',
                    borderLeft: side === "right" ? '1px solid #E5E7EB' : 'none',
                } : undefined}
            >
                {isOpen ? (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Danh sách kênh</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {loading ? 'Đang tải...' : `${channels.length} kênh`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
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
                        </div>

                        {/* Channel List */}
                        <ScrollArea className="flex-1">
                            <div className="py-2">
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="px-3 py-2">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-6 w-6 rounded" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        </div>
                                    ))
                                ) : channels.length === 0 ? (
                                    // Empty state
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                        <Youtube className="h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-sm text-gray-500">Chưa có kênh nào</p>
                                    </div>
                                ) : (
                                    // Channel items - MINIMAL STYLE
                                    channels.map((channel) => {
                                        const isActive = activeChannelId === channel._id;

                                        return (
                                            <div
                                                key={channel._id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleChannelClick(channel)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleChannelClick(channel);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                                                    "hover:bg-gray-50",
                                                    isActive && "bg-blue-50 border-l-2 border-blue-600"
                                                )}
                                            >
                                                {/* Channel Icon/Avatar */}
                                                <Avatar className="h-6 w-6 shrink-0">
                                                    <AvatarImage
                                                        src={channel.thumbnailUrl}
                                                        alt={channel.name}
                                                    />
                                                    <AvatarFallback className="bg-red-100 text-red-700 text-xs">
                                                        <Youtube className="h-3.5 w-3.5" />
                                                    </AvatarFallback>
                                                </Avatar>

                                                {/* Channel Name - ONLY TEXT */}
                                                <span
                                                    className={cn(
                                                        "text-sm truncate flex-1",
                                                        isActive
                                                            ? "text-blue-700 font-medium"
                                                            : "text-gray-700"
                                                    )}
                                                    title={channel.name}
                                                >
                                                    {channel.name}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        {/* Nút Add new... style giống ảnh - shadcn/ui */}
                        <div className="flex justify-center px-3 py-3 pb-18">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full flex items-center gap-2 justify-start px-2 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 font-normal border-none shadow-none"
                                        style={{ boxShadow: "none" }}
                                    >
                                        <span className="flex items-center justify-center rounded-full border border-dashed border-gray-300 bg-transparent mr-2" style={{ width: 24, height: 24 }}>
                                            <Plus className="h-4 w-4 text-gray-300" />
                                        </span>
                                        <span className="text-base">Kết nối...</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <File className="h-4 w-4 text-gray-500" />
                                        <span>Page</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        <span>Group</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <Link className="h-4 w-4 text-gray-500" />
                                        <span>Link to...</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <BookOpen className="h-4 w-4 text-gray-500" />
                                        <span>OpenAPI Reference</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <Languages className="h-4 w-4 text-gray-500" />
                                        <span>Translation</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-2 items-center cursor-pointer">
                                        <Download className="h-4 w-4 text-gray-500" />
                                        <span>Import pages</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ) : (
                    // ✅ CLOSED STATE - Show toggle button at TOP-LEFT
                    <div className="flex flex-col h-full">
                        <div className="flex items-start pt-3 pl-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(true)}
                                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                title="Mở danh sách kênh"
                            >
                                {side === "right" ? (
                                    <ChevronLeft className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay for mobile (fixed mode) */}
            {mode === "fixed" && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}