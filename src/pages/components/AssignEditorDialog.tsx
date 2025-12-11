// src/pages/components/AssignEditorDialog.tsx
/**
 * Dialog để gán kênh cho Editor
 *
 * Logic lấy danh sách editors:
 * 1. Nếu channel có teamId → lấy team details → lấy members từ team.members
 * 2. Nếu chỉ có branchId → lấy tất cả teams trong branch → lấy members từ các teams
 *
 * Sử dụng API:
 * - GET /api/teams/:id để lấy team với members
 * - GET /api/branches/:id/teams để lấy teams trong branch
 * - POST /api/channels/:id/assign để gán editor cho kênh
 */

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Check, Youtube, User, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Channel } from "@/types/channel.types"
import type { User as UserType } from "@/types/user.types"
import { channelsAPI } from "@/lib/channels-api"
import { teamsAPI } from "@/lib/teams-api"
import { branchesAPI } from "@/lib/branches-api"

interface AssignEditorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    channel: Channel | null;
    onSuccess?: () => void;
    /** branchId từ parent - dùng khi channel không có đủ thông tin branch */
    branchId?: string;
}

export function AssignEditorDialog({
    isOpen,
    onClose,
    channel,
    onSuccess,
    branchId: parentBranchId,
}: AssignEditorDialogProps) {
    const [editors, setEditors] = React.useState<UserType[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [assigning, setAssigning] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedEditorId, setSelectedEditorId] = React.useState<string | null>(null);

    // Fetch editors khi dialog mở hoặc channel/branchId thay đổi
    React.useEffect(() => {
        if (isOpen && channel) {
            fetchEditors();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, channel?._id, parentBranchId]);

    // Reset state khi đóng dialog
    React.useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
            setSelectedEditorId(null);
            setEditors([]);
        }
    }, [isOpen]);

    const fetchEditors = async () => {
        if (!channel) return;

        setLoading(true);
        try {
            // Lấy teamId từ channel
            // channel.team có thể là string (ID) hoặc object
            const channelTeamId = typeof channel.team === 'string'
                ? channel.team
                : channel.team?._id;

            console.log('🔄 [AssignEditor] Fetching editors...');
            console.log('📌 Channel:', channel.name);
            console.log('📌 Channel Team (raw):', channel.team);
            console.log('📌 Channel Team ID:', channelTeamId);
            console.log('📌 Parent Branch ID:', parentBranchId);

            let allEditors: UserType[] = [];

            // CÁCH MỚI: Lấy editors từ team.members thay vì từ API users
            // Vì khi thêm editor vào team qua ManageMembersModal, họ được add vào team.members
            if (channelTeamId) {
                // Trường hợp 1: Channel thuộc một team cụ thể
                // → Lấy members từ team đó
                console.log('🔍 [AssignEditor] Fetching team members for teamId:', channelTeamId);
                try {
                    const teamDetail = await teamsAPI.getById(channelTeamId);
                    console.log('📊 [AssignEditor] Team detail:', teamDetail);

                    // Lấy members có role = editor từ team
                    const teamMembers = (teamDetail.members || []).filter(
                        (member: any) => member.role === 'editor'
                    );
                    console.log('📊 [AssignEditor] Team editors:', teamMembers);

                    // Convert members sang UserType format
                    allEditors = teamMembers.map((member: any) => ({
                        _id: member._id,
                        name: member.name,
                        email: member.email,
                        role: member.role as any,
                        isActive: true,
                        createdAt: '',
                    }));
                } catch (err) {
                    console.error('❌ [AssignEditor] Error fetching team:', err);
                }
            }

            if (allEditors.length === 0 && parentBranchId) {
                // Trường hợp 2: Không có teamId hoặc team không có members
                // → Lấy tất cả teams trong branch → lấy members từ các teams
                console.log('🔍 [AssignEditor] Fetching all teams in branch:', parentBranchId);
                try {
                    const teamsInBranch = await branchesAPI.getTeams(parentBranchId);
                    console.log('📊 [AssignEditor] Teams in branch:', teamsInBranch);

                    // Lấy members từ tất cả teams
                    const editorsMap = new Map<string, UserType>(); // Để loại bỏ duplicate

                    for (const team of teamsInBranch) {
                        try {
                            const teamDetail = await teamsAPI.getById(team._id);
                            const teamEditors = (teamDetail.members || []).filter(
                                (member: any) => member.role === 'editor'
                            );

                            teamEditors.forEach((member: any) => {
                                if (!editorsMap.has(member._id)) {
                                    editorsMap.set(member._id, {
                                        _id: member._id,
                                        name: member.name,
                                        email: member.email,
                                        role: member.role as any,
                                        team: { _id: team._id, name: team.name },
                                        isActive: true,
                                        createdAt: '',
                                    });
                                }
                            });
                        } catch (err) {
                            console.error(`❌ [AssignEditor] Error fetching team ${team._id}:`, err);
                        }
                    }

                    allEditors = Array.from(editorsMap.values());
                    console.log('📊 [AssignEditor] All editors from branch teams:', allEditors);
                } catch (err) {
                    console.error('❌ [AssignEditor] Error fetching teams in branch:', err);
                }
            }

            console.log('✅ [AssignEditor] Final editors count:', allEditors.length);
            setEditors(allEditors);
        } catch (error) {
            console.error("Failed to fetch editors:", error);
            toast.error("Không thể tải danh sách editor");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedEditorId || !channel) return;

        setAssigning(true);
        try {
            const editor = editors.find(e => e._id === selectedEditorId);

            console.log('🔄 [AssignEditor] ========== BẮT ĐẦU GÁN KÊNH ==========');
            console.log('📌 Channel ID:', channel._id);
            console.log('📌 Channel Name:', channel.name);
            console.log('📌 Editor ID:', selectedEditorId);
            console.log('📌 Editor Name:', editor?.name);
            console.log('📌 Editor Email:', editor?.email);

            // Gọi API: POST /api/channels/:id/assign
            const result = await channelsAPI.assignEditor(channel._id, { userId: selectedEditorId });

            console.log('✅ [AssignEditor] ========== KẾT QUẢ GÁN KÊNH ==========');
            console.log('📋 [AssignEditor] Full result:', JSON.stringify(result, null, 2));
            console.log('📋 [AssignEditor] assignedTo:', result.assignedTo);
            console.log('📋 [AssignEditor] assignedEditors:', result.assignedEditors);

            toast.success(`Đã gán kênh "${channel.name}" cho ${editor?.name}`);

            onSuccess?.();
        } catch (error: any) {
            console.error("❌ [AssignEditor] Failed to assign editor:", error);
            console.error("❌ [AssignEditor] Error response:", error.response?.data);
            toast.error(error.response?.data?.message || "Không thể gán editor cho kênh");
        } finally {
            setAssigning(false);
        }
    };

    // Filter editors by search query
    const filteredEditors = editors.filter(editor =>
        editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        editor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Gán kênh cho Editor
                    </DialogTitle>
                    <DialogDescription>
                        Chọn editor để quản lý kênh{" "}
                        <span className="font-medium text-gray-900">
                            {channel?.name}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {/* Channel info */}
                {channel && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                            <AvatarFallback className="bg-red-100 text-red-700">
                                <Youtube className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {channel.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {typeof channel.team !== 'string' && channel.team?.branch && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        <Building2 className="h-3 w-3 mr-1" />
                                        {channel.team.branch.name}
                                    </Badge>
                                )}
                                {channel.team && typeof channel.team !== 'string' && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        <Users className="h-3 w-3 mr-1" />
                                        {channel.team.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm editor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Editor list */}
                <ScrollArea className="h-[240px] border rounded-lg">
                    <div className="p-2">
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </div>
                            ))
                        ) : filteredEditors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                <User className="h-10 w-10 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">
                                    {searchQuery
                                        ? "Không tìm thấy editor"
                                        : channel?.team
                                            ? `Chưa có editor nào trong nhóm "${typeof channel.team === 'string' ? 'này' : channel.team.name}"`
                                            : parentBranchId
                                                ? "Chưa có editor nào trong chi nhánh này"
                                                : "Chưa có editor nào"}
                                </p>
                                {!searchQuery && (channel?.team || parentBranchId) && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Vui lòng thêm editor vào nhóm qua "Quản Lý Thành Viên" trước khi gán kênh
                                    </p>
                                )}
                            </div>
                        ) : (
                            filteredEditors.map((editor) => {
                                const isSelected = selectedEditorId === editor._id;

                                return (
                                    <div
                                        key={editor._id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setSelectedEditorId(editor._id)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") setSelectedEditorId(editor._id);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                            isSelected
                                                ? "bg-blue-50 border border-blue-200"
                                                : "hover:bg-gray-50"
                                        )}
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={editor.avatar} alt={editor.name} />
                                            <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                                                {editor.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {editor.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {editor.email}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="shrink-0 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedEditorId || assigning}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {assigning ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Đang gán...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Gán Editor
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
