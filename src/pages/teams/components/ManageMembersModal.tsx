// components/teams/ManageMembersModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertCircle,
    CheckCircle,
    Users,
    Search,
    UserPlus,
    UserMinus,
    Loader2,
    Mail,
} from 'lucide-react';
import { teamsAPI, type Team } from '@/lib/teams-api';
import { apiClient } from '@/lib/api-client';
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

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface ManageMembersModalProps {
    open: boolean;
    team: Team | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ManageMembersModal({ open, team, onClose, onSuccess }: ManageMembersModalProps) {
    const [currentMembers, setCurrentMembers] = useState<User[]>([]);
    const [availableEditors, setAvailableEditors] = useState<User[]>([]);
    const [filteredEditors, setFilteredEditors] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEditors, setSelectedEditors] = useState<Set<string>>(new Set());

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Remove member confirmation
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
    const [removingMember, setRemovingMember] = useState(false);

    useEffect(() => {
        if (open && team) {
            fetchData();
            setSearchQuery('');
            setSelectedEditors(new Set());
            setSuccessMessage('');
            setErrorMessage('');
        }
    }, [open, team]);

    useEffect(() => {
        // Filter editors based on search query
        if (searchQuery) {
            const filtered = availableEditors.filter(
                (editor) =>
                    editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    editor.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredEditors(filtered);
        } else {
            setFilteredEditors(availableEditors);
        }
    }, [searchQuery, availableEditors]);

    const fetchData = async () => {
        if (!team) return;

        setFetchingData(true);
        try {
            // Fetch latest team data to get current members
            const teamData = await teamsAPI.getById(team._id);
            setCurrentMembers(teamData.members || []);

            // Fetch all editors
            const editorsData = await apiClient.getUsers({ role: 'editor' });
            const allEditors = editorsData.users || editorsData.data || [];

            // Filter out editors who are already members
            const currentMemberIds = new Set((teamData.members || []).map((m) => m._id));
            const available = allEditors.filter((editor) => !currentMemberIds.has(editor._id));

            setAvailableEditors(available);
            setFilteredEditors(available);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Không thể tải dữ liệu');
        } finally {
            setFetchingData(false);
        }
    };

    const toggleEditorSelection = (editorId: string) => {
        setSelectedEditors((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(editorId)) {
                newSet.delete(editorId);
            } else {
                newSet.add(editorId);
            }
            return newSet;
        });
    };

    const handleAddMembers = async () => {
        if (!team || selectedEditors.size === 0) return;

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Add members one by one
            const promises = Array.from(selectedEditors).map((userId) => teamsAPI.addMember(team._id, userId));

            await Promise.all(promises);

            setSuccessMessage(`✅ Đã thêm ${selectedEditors.size} thành viên thành công!`);
            setSelectedEditors(new Set());

            // Refresh data
            await fetchData();

            setTimeout(() => {
                onSuccess?.();
            }, 1500);
        } catch (error: any) {
            console.error('Error adding members:', error);
            setErrorMessage(error.message || 'Lỗi khi thêm thành viên!');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const confirmRemoveMember = (member: User) => {
        setMemberToRemove(member);
        setShowRemoveConfirm(true);
    };

    const handleRemoveMember = async () => {
        if (!team || !memberToRemove) return;

        setRemovingMember(true);
        setErrorMessage('');

        try {
            await teamsAPI.removeMember(team._id, memberToRemove._id);

            setSuccessMessage(`✅ Đã xóa ${memberToRemove.name} khỏi nhóm!`);
            setShowRemoveConfirm(false);
            setMemberToRemove(null);

            // Refresh data
            await fetchData();

            setTimeout(() => {
                setSuccessMessage('');
                onSuccess?.();
            }, 1500);
        } catch (error: any) {
            console.error('Error removing member:', error);
            setErrorMessage(error.message || 'Lỗi khi xóa thành viên!');
            setShowRemoveConfirm(false);
            setMemberToRemove(null);
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setRemovingMember(false);
        }
    };

    if (!team) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!max-w-[1000px] w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle>Quản Lý Thành Viên</DialogTitle>
                                <DialogDescription>Thêm hoặc xóa thành viên trong nhóm {team.name}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Success/Error Messages */}
                    {successMessage && (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-6">
                        {/* Current Members Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    THÀNH VIÊN HIỆN TẠI ({currentMembers.length})
                                </h3>
                            </div>

                            {fetchingData ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                            ) : currentMembers.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>Chưa có thành viên nào trong nhóm</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                                    {currentMembers.map((member) => (
                                        <div key={member._id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-blue-500 text-white text-sm">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate">{member.email}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {member.role}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => confirmRemoveMember(member)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <UserMinus className="h-4 w-4 mr-1" />
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add Members Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-slate-700">THÊM THÀNH VIÊN MỚI</h3>
                                {selectedEditors.size > 0 && (
                                    <Button
                                        onClick={handleAddMembers}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700"
                                        size="sm"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Đang thêm...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Thêm {selectedEditors.size} thành viên
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm editor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {fetchingData ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                            ) : filteredEditors.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {searchQuery
                                            ? 'Không tìm thấy editor nào phù hợp'
                                            : 'Không có editor nào khả dụng để thêm vào nhóm'}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                                    {filteredEditors.map((editor) => (
                                        <label
                                            key={editor._id}
                                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedEditors.has(editor._id)}
                                                onCheckedChange={() => toggleEditorSelection(editor._id)}
                                                disabled={loading}
                                            />
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-orange-500 text-white text-sm">
                                                    {editor.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{editor.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate">{editor.email}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {editor.role}
                                            </Badge>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {selectedEditors.size > 0 && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        Đã chọn <strong>{selectedEditors.size}</strong> editor để thêm vào nhóm
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button variant="outline" onClick={onClose} disabled={loading || removingMember}>
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Remove Member Confirmation Dialog */}
            <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <UserMinus className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle>Xóa Thành Viên</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa <strong>{memberToRemove?.name}</strong> khỏi nhóm?
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Lưu ý:</p>
                                <p>Thành viên này sẽ không còn quyền truy cập vào các kênh của nhóm.</p>
                            </div>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={removingMember}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemoveMember();
                            }}
                            disabled={removingMember}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {removingMember ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    Xóa Thành Viên
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
