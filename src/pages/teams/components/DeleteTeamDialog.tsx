// components/teams/DeleteTeamDialog.tsx
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { teamsAPI, type Team } from '@/lib/teams-api';

interface DeleteTeamDialogProps {
    open: boolean;
    team: Team | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteTeamDialog({ open, team, onClose, onSuccess }: DeleteTeamDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!team) return;

        setLoading(true);
        setError('');

        try {
            await teamsAPI.delete(team._id);
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error deleting team:', error);
            setError(error.message || 'Lỗi khi xóa nhóm!');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    if (!team) return null;

    // ✅ FIX: Kiểm tra đúng cách
    const membersCount = team.members?.length || team.membersCount || 0;
    const channelsCount = team.channels?.length || team.channelsCount || 0;

    const hasMembers = membersCount > 0;
    const hasChannels = channelsCount > 0;
    const canDelete = !hasMembers && !hasChannels;

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <AlertDialogTitle>Xóa Nhóm</AlertDialogTitle>
                            <AlertDialogDescription>Bạn có chắc chắn muốn xóa nhóm "{team.name}"?</AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {!canDelete && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <p className="font-medium mb-2">Không thể xóa nhóm này vì:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {hasMembers && <li>Nhóm còn {membersCount} thành viên</li>}
                                {hasChannels && <li>Nhóm còn {channelsCount} kênh</li>}
                            </ul>
                            <p className="mt-2 text-sm">Vui lòng xóa tất cả thành viên và kênh trước khi xóa nhóm.</p>
                        </AlertDescription>
                    </Alert>
                )}

                {canDelete && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Cảnh báo:</p>
                                <p>Hành động này không thể hoàn tác. Nhóm sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                            </div>
                        </div>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // ✅ Prevent default behavior
                            if (!canDelete) return; // ✅ Double check
                            handleDelete();
                        }}
                        disabled={loading || !canDelete} // ✅ Disable nếu không thể xóa
                        className={`${canDelete
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa Nhóm
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
