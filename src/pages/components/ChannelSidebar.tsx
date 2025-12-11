
import * as React from "react"
import { ChevronRight, ChevronLeft, Youtube, Plus, MoreHorizontal, UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { channelsAPI } from "@/lib/channels-api"
import { branchesAPI } from "@/lib/branches-api"
import type { Channel } from "@/types/channel.types"
import { toast } from "sonner"
import { youtubeApi } from "@/lib/youtubeApi"
import { SelectTeamDialog } from "./SelectTeamDialog"
import { AssignEditorDialog } from "./AssignEditorDialog"

interface ChannelSidebarProps {
    branchId?: string
    branchName?: string
    teamId?: string
    teamName?: string
    className?: string
    side?: "left" | "right"
    mode?: "fixed" | "inline"
    onChannelSelect?: (channel: Channel) => void;
    showDialog?: boolean;
    /** Chiều cao header để đồng bộ với content area */
    headerHeight?: number;
    /** Controlled open state từ parent */
    isOpen?: boolean;
    /** Callback khi toggle đóng/mở */
    onToggle?: (isOpen: boolean) => void;
}

export function ChannelSidebar({
    branchId,
    branchName,
    teamId,
    teamName,
    className,
    side = "left",
    mode = "inline",
    onChannelSelect,
    headerHeight = 57,
    isOpen: controlledIsOpen,
    onToggle,
}: ChannelSidebarProps) {
    // Internal state khi không có controlled state
    const [internalIsOpen, setInternalIsOpen] = React.useState(true);

    // Sử dụng controlled state nếu có, nếu không dùng internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const handleToggle = (newState: boolean) => {
        if (onToggle) {
            onToggle(newState);
        } else {
            setInternalIsOpen(newState);
        }
    };
    const [channels, setChannels] = React.useState<Channel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeChannelId, setActiveChannelId] = React.useState<string | null>(null);

    // State cho dialog chọn nhóm (khi ở chi nhánh)
    const [showSelectTeamDialog, setShowSelectTeamDialog] = React.useState(false);
    const [connectingChannel, setConnectingChannel] = React.useState(false);

    // State cho dropdown menu actions
    const [showAssignEditorDialog, setShowAssignEditorDialog] = React.useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [selectedChannelForAction, setSelectedChannelForAction] = React.useState<Channel | null>(null);
    const [deletingChannel, setDeletingChannel] = React.useState(false);

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

    // Refetch channels sau khi kết nối mới
    const refetchChannels = async () => {
        setLoading(true);
        try {
            let data: Channel[] = [];
            if (teamId) {
                data = await channelsAPI.getByTeam(teamId);
                data = data.filter(channel => {
                    const channelTeamId = typeof channel.team === 'string'
                        ? channel.team
                        : channel.team?._id;
                    return channelTeamId === teamId;
                });
            } else if (branchId) {
                data = await branchesAPI.getChannels(branchId) as Channel[];
            } else {
                data = await channelsAPI.getAll();
            }
            setChannels(data);
        } catch (error) {
            toast.error('Failed to reload channels');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Xử lý kết nối kênh YouTube
     * - Nếu có teamId (đang ở trong nhóm): Mở OAuth trực tiếp với teamId
     * - Nếu có branchId (đang ở chi nhánh): Hiện dialog chọn nhóm trước
     */
    const handleConnectChannel = async () => {
        if (teamId) {
            // Đang ở trong nhóm → kết nối trực tiếp
            setConnectingChannel(true);
            try {
                toast.info(`Đang kết nối kênh cho nhóm "${teamName || 'Team'}"...`);
                await youtubeApi.login(teamId);
                // Sau khi OAuth hoàn tất, reload danh sách kênh
                await refetchChannels();
            } catch (error) {
                console.error('Connect channel error:', error);
                toast.error('Không thể kết nối kênh');
            } finally {
                setConnectingChannel(false);
            }
        } else if (branchId) {
            // Đang ở chi nhánh → hiện dialog chọn nhóm
            setShowSelectTeamDialog(true);
        } else {
            toast.warning('Vui lòng chọn chi nhánh hoặc nhóm trước khi kết nối kênh');
        }
    };

    /**
     * Callback sau khi chọn nhóm từ dialog
     */
    const handleTeamSelected = async (selectedTeamId: string, selectedTeamName: string) => {
        setShowSelectTeamDialog(false);
        setConnectingChannel(true);
        try {
            toast.info(`Đang kết nối kênh cho nhóm "${selectedTeamName}"...`);
            await youtubeApi.login(selectedTeamId);
            // Sau khi OAuth hoàn tất, reload danh sách kênh
            await refetchChannels();
        } catch (error) {
            console.error('Connect channel error:', error);
            toast.error('Không thể kết nối kênh');
        } finally {
            setConnectingChannel(false);
        }
    };

    /**
     * Mở dialog gán editor cho kênh
     */
    const handleAssignEditor = (channel: Channel, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedChannelForAction(channel);
        setShowAssignEditorDialog(true);
    };

    /**
     * Mở dialog xác nhận xóa kênh
     */
    const handleDeleteChannel = (channel: Channel, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedChannelForAction(channel);
        setShowDeleteDialog(true);
    };

    /**
     * Xác nhận xóa kênh
     */
    const confirmDeleteChannel = async () => {
        if (!selectedChannelForAction) return;

        setDeletingChannel(true);
        try {
            await channelsAPI.delete(selectedChannelForAction._id);
            toast.success(`Đã xóa kênh "${selectedChannelForAction.name}"`);
            // Reload danh sách kênh
            await refetchChannels();
            // Reset active channel nếu đang xem kênh bị xóa
            if (activeChannelId === selectedChannelForAction._id) {
                setActiveChannelId(null);
            }
        } catch (error) {
            console.error('Delete channel error:', error);
            toast.error('Không thể xóa kênh');
        } finally {
            setDeletingChannel(false);
            setShowDeleteDialog(false);
            setSelectedChannelForAction(null);
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
                        onClick={() => handleToggle(true)}
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
                            isOpen ? "w-[230px]" : "w-0"
                        )
                        : cn(
                            "h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
                            isOpen ? "w-[230px]" : "w-0"
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
                        {/* Header - Ẩn khi headerHeight = 0 (header được render ở parent) */}
                        {headerHeight > 0 && (
                            <div
                                className="flex items-center justify-between px-2 shrink-0"
                                style={{ height: headerHeight }}
                            >
                                <div className="flex items-center gap-1">
                                    <h3
                                        className="font-medium text-[14px] leading-[20px]"
                                        style={{ color: "rgb(59,69,85) !important" }}
                                    >
                                        Danh sách kênh
                                    </h3>



                                    <span className="text-xs text-gray-500">({loading ? '...' : channels.length})</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggle(false)}
                                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                                >
                                    {side === "right" ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        <ChevronLeft className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Border line dưới header - chỉ hiển thị khi có header */}
                        {headerHeight > 0 && <div className="border-b border-gray-200" />}

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
                                                    "group flex items-center gap-3 px-6 py-1.5 mx-2 cursor-pointer transition-colors my-1 rounded-lg",
                                                    isActive
                                                        ? "bg-[#F7F7F7]"
                                                        : "hover:bg-[#F7F7F7]"
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
                                                        "text-sm truncate flex-1 text-gray-700"
                                                    )}
                                                    title={channel.name}
                                                >
                                                    {channel.name}
                                                </span>

                                                {/* Dropdown Menu - 3 dots */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0 hover:bg-[#DEDFE3] focus:bg-[#DEDFE3] active:bg-[#DEDFE3]"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem
                                                            onClick={(e) => handleAssignEditor(channel, e as unknown as React.MouseEvent)}
                                                            className="cursor-pointer"
                                                        >
                                                            <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
                                                            <span>Gán cho Editor</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) => handleDeleteChannel(channel, e as unknown as React.MouseEvent)}
                                                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            <span>Xóa kênh</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        {/* Nút Kết nối kênh YouTube */}
                        <div className="flex justify-center px-3 py-3 pb-4">
                            <Button
                                variant="ghost"
                                onClick={handleConnectChannel}
                                disabled={connectingChannel}
                                className="w-full flex items-center gap-2 justify-start px-2 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 font-normal border-none shadow-none transition-colors"
                                style={{ boxShadow: "none" }}
                            >
                                <span className="flex items-center justify-center rounded-full border border-dashed border-gray-300 hover:border-red-400 bg-transparent mr-2 transition-colors" style={{ width: 24, height: 24 }}>
                                    {connectingChannel ? (
                                        <span className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4 text-gray-400" />
                                    )}
                                </span>
                                {/* <Youtube className="h-4 w-4 text-red-500 mr-1" /> */}
                                <span className="text-sm">
                                    {connectingChannel ? 'Đang kết nối...' : 'Kết nối kênh...'}
                                </span>
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Overlay for mobile (fixed mode) */}
            {mode === "fixed" && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => handleToggle(false)}
                />
            )}

            {/* Dialog chọn nhóm (khi ở chi nhánh) */}
            {branchId && (
                <SelectTeamDialog
                    isOpen={showSelectTeamDialog}
                    onClose={() => setShowSelectTeamDialog(false)}
                    branchId={branchId}
                    branchName={branchName}
                    onTeamSelect={handleTeamSelected}
                />
            )}

            {/* Dialog gán editor cho kênh */}
            <AssignEditorDialog
                isOpen={showAssignEditorDialog}
                onClose={() => {
                    setShowAssignEditorDialog(false);
                    setSelectedChannelForAction(null);
                }}
                channel={selectedChannelForAction}
                branchId={branchId}
                onSuccess={() => {
                    setShowAssignEditorDialog(false);
                    setSelectedChannelForAction(null);
                    refetchChannels();
                }}
            />

            {/* Dialog xác nhận xóa kênh */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa kênh</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa kênh <strong>"{selectedChannelForAction?.name}"</strong>?
                            <br />
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setSelectedChannelForAction(null);
                            }}
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteChannel}
                            disabled={deletingChannel}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deletingChannel ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang xóa...
                                </>
                            ) : (
                                'Xóa kênh'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}