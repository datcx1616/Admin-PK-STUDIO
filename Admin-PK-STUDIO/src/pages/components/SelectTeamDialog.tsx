// src/pages/components/SelectTeamDialog.tsx
/**
 * Dialog chọn nhóm (Team) khi kết nối kênh từ chi nhánh
 * Hiển thị danh sách nhóm trong chi nhánh để user chọn trước khi kết nối YouTube
 */

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Youtube, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { teamsAPI, type Team } from "@/lib/teams-api";
import { toast } from "sonner";

interface SelectTeamDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branchId: string;
    branchName?: string;
    onTeamSelect: (teamId: string, teamName: string) => void;
}

export function SelectTeamDialog({
    isOpen,
    onClose,
    branchId,
    branchName,
    onTeamSelect,
}: SelectTeamDialogProps) {
    const [teams, setTeams] = React.useState<Team[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedTeamId, setSelectedTeamId] = React.useState<string | null>(null);

    // Fetch teams khi dialog mở
    React.useEffect(() => {
        if (isOpen && branchId) {
            fetchTeams();
        }
    }, [isOpen, branchId]);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const data = await teamsAPI.getAll({ branchId });
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams:', error);
            toast.error('Không thể tải danh sách nhóm');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = () => {
        if (selectedTeamId) {
            const team = teams.find(t => t._id === selectedTeamId);
            if (team) {
                onTeamSelect(team._id, team.name);
            }
        }
    };

    const handleClose = () => {
        setSelectedTeamId(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-600" />
                        Kết nối kênh YouTube
                    </DialogTitle>
                    <DialogDescription>
                        {branchName
                            ? `Chọn nhóm trong chi nhánh "${branchName}" để kết nối kênh YouTube`
                            : 'Chọn nhóm để kết nối kênh YouTube'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        // Loading skeleton
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : teams.length === 0 ? (
                        // Empty state
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Users className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500 mb-2">
                                Chi nhánh này chưa có nhóm nào
                            </p>
                            <p className="text-xs text-gray-400">
                                Vui lòng tạo nhóm trước khi kết nối kênh
                            </p>
                        </div>
                    ) : (
                        // Team list
                        <ScrollArea className="max-h-[300px]">
                            <div className="space-y-2">
                                {teams.map((team) => {
                                    const isSelected = selectedTeamId === team._id;
                                    const channelCount = team.channelsCount || team.channels?.length || 0;
                                    const memberCount = team.membersCount || team.members?.length || 0;

                                    return (
                                        <div
                                            key={team._id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setSelectedTeamId(team._id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setSelectedTeamId(team._id);
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                "hover:bg-gray-50 hover:border-gray-300",
                                                isSelected && "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                                            )}
                                        >
                                            {/* Team Icon */}
                                            <div className={cn(
                                                "flex items-center justify-center h-10 w-10 rounded-full",
                                                isSelected ? "bg-blue-100" : "bg-gray-100"
                                            )}>
                                                <Users className={cn(
                                                    "h-5 w-5",
                                                    isSelected ? "text-blue-600" : "text-gray-500"
                                                )} />
                                            </div>

                                            {/* Team Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    isSelected ? "text-blue-700" : "text-gray-900"
                                                )}>
                                                    {team.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {memberCount} thành viên • {channelCount} kênh
                                                </p>
                                            </div>

                                            {/* Selection indicator */}
                                            {isSelected && (
                                                <ChevronRight className="h-5 w-5 text-blue-500" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSelect}
                        disabled={!selectedTeamId || teams.length === 0}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Youtube className="mr-2 h-4 w-4" />
                        Tiếp tục kết nối
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
