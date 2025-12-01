// components/teams/EditTeamModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Edit, Loader2 } from 'lucide-react';
import { teamsAPI, type Team, type UpdateTeamRequest } from '@/lib/teams-api';
import { apiClient } from '@/lib/api-client';

interface Branch {
    _id: string;
    name: string;
    code: string;
    description?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface EditTeamModalProps {
    open: boolean;
    team: Team | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function EditTeamModal({ open, team, onClose, onSuccess }: EditTeamModalProps) {
    const [formData, setFormData] = useState<UpdateTeamRequest & { branchId?: string }>({
        name: '',
        description: '',
        leaderId: '',
        branchId: '',
    });

    const [branches, setBranches] = useState<Branch[]>([]);
    const [managers, setManagers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Load team data when modal opens
    useEffect(() => {
        if (open && team) {
            setFormData({
                name: team.name,
                description: team.description,
                leaderId: team.leader?._id || '',
                branchId: team.branch?._id || '',
            });
            setErrors({});
            setSuccessMessage('');
            setErrorMessage('');

            // Fetch branches
            fetchBranches();

            // Fetch managers for this team's branch
            if (team.branch?._id) {
                fetchManagersForBranch(team.branch._id);
            }
        }
    }, [open, team]);

    // Fetch managers when branch changes
    useEffect(() => {
        if (formData.branchId) {
            fetchManagersForBranch(formData.branchId);
        } else {
            setManagers([]);
        }
    }, [formData.branchId]);

    const fetchBranches = async () => {
        try {
            const branchesData = await apiClient.getBranches();
            const branchesArray = branchesData.branches || branchesData.data || [];
            setBranches(branchesArray);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    const fetchManagersForBranch = async (branchId: string) => {
        setFetchingData(true);
        try {
            const managersData = await apiClient.getUsers({
                role: 'manager',
                branch: branchId,
            });
            const managersArray = managersData.users || managersData.data || [];
            setManagers(managersArray);
        } catch (error) {
            console.error('Error fetching managers:', error);
            setManagers([]);
        } finally {
            setFetchingData(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Tên nhóm là bắt buộc';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên nhóm phải có ít nhất 3 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!team || !validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await teamsAPI.update(team._id, formData);

            setSuccessMessage('✅ Cập nhật nhóm thành công!');

            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error updating team:', error);
            setErrorMessage(error.message || 'Lỗi khi cập nhật nhóm!');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    if (!team) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[1000px] w-full max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Edit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>Chỉnh Sửa Nhóm</DialogTitle>
                            <DialogDescription>Cập nhật thông tin nhóm {team.name}</DialogDescription>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Team Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên Nhóm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="VD: Nhóm Sản Xuất Video"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500' : ''}
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô Tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả về nhiệm vụ, mục tiêu của nhóm..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            disabled={loading}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="branch">
                            Chi Nhánh <span className="text-red-500">*</span>
                        </Label>
                        {branches.length === 0 ? (
                            <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800">
                                    Chưa có chi nhánh nào. Vui lòng tạo chi nhánh trước.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <Select
                                    value={formData.branchId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            branchId: value,
                                            leaderId: '',
                                        })
                                    }
                                    disabled={loading}
                                >
                                    <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="-- Chọn Chi Nhánh --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch._id} value={branch._id}>
                                                {branch.name} ({branch.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.branchId ? (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.branchId}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-500">Chọn chi nhánh mới sẽ reset trưởng nhóm</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Team Leader Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="leader">Trưởng Nhóm (Manager)</Label>

                        {fetchingData ? (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải danh sách managers...
                            </div>
                        ) : managers.length === 0 ? (
                            <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800">
                                    Không có Manager nào trong chi nhánh này.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <Select
                                    value={formData.leaderId}
                                    onValueChange={(value) => setFormData({ ...formData, leaderId: value })}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="-- Chọn Trưởng Nhóm --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((manager) => (
                                            <SelectItem key={manager._id} value={manager._id}>
                                                {manager.name} ({manager.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">Manager sẽ quản lý nhóm này</p>
                            </>
                        )}
                    </div>

                    {/* Current Members Info */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Nhóm hiện có <strong>{team.members?.length || 0}</strong> thành viên và{' '}
                            <strong>{team.channels?.length || 0}</strong> kênh. Để thêm/xóa thành viên hoặc kênh, vui lòng sử dụng
                            chức năng tương ứng trong trang chi tiết nhóm.
                        </AlertDescription>
                    </Alert>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Lưu Thay Đổi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
