// components/teams/CreateTeamModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Users, Loader2 } from 'lucide-react';
import { teamsAPI, type CreateTeamRequest } from '@/lib/teams-api';
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

interface CreateTeamModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateTeamModal({ open, onClose, onSuccess }: CreateTeamModalProps) {
    const [formData, setFormData] = useState<CreateTeamRequest>({
        name: '',
        description: '',
        branchId: '',
        leaderId: '',
        memberIds: [],
    });

    const [branches, setBranches] = useState<Branch[]>([]);
    const [managers, setManagers] = useState<User[]>([]);
    const [editors, setEditors] = useState<User[]>([]);

    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            fetchInitialData();
            setFormData({
                name: '',
                description: '',
                branchId: '',
                leaderId: '',
                memberIds: [],
            });
            setErrors({});
            setSuccessMessage('');
            setErrorMessage('');
        }
    }, [open]);

    // Fetch managers when branch changes
    useEffect(() => {
        if (formData.branchId) {
            fetchManagersForBranch(formData.branchId);
        } else {
            setManagers([]);
        }
    }, [formData.branchId]);

    const fetchInitialData = async () => {
        setFetchingData(true);
        try {
            // Fetch branches
            const branchesData = await apiClient.getBranches();
            const branchesArray = branchesData.branches || branchesData.data || [];
            setBranches(branchesArray);

            // Fetch all editors
            const editorsData = await apiClient.getUsers({ role: 'editor' });
            const editorsArray = editorsData.users || editorsData.data || [];
            setEditors(editorsArray);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setErrorMessage('Không thể tải dữ liệu ban đầu');
        } finally {
            setFetchingData(false);
        }
    };

    const fetchManagersForBranch = async (branchId: string) => {
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
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên nhóm là bắt buộc';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên nhóm phải có ít nhất 3 ký tự';
        }

        if (!formData.branchId) {
            newErrors.branchId = 'Vui lòng chọn chi nhánh';
        }

        if (!formData.leaderId) {
            newErrors.leaderId = 'Vui lòng chọn trưởng nhóm (Manager)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await teamsAPI.create(formData);

            setSuccessMessage('✅ Tạo nhóm thành công!');

            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error('Error creating team:', error);
            setErrorMessage(error.message || 'Lỗi khi tạo nhóm!');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const toggleMember = (memberId: string) => {
        setFormData((prev) => ({
            ...prev,
            memberIds: prev.memberIds?.includes(memberId)
                ? prev.memberIds.filter((id) => id !== memberId)
                : [...(prev.memberIds || []), memberId],
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[1000px] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle>Thêm Nhóm Mới</DialogTitle>
                            <DialogDescription>Tạo nhóm làm việc cho chi nhánh</DialogDescription>
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
                            autoFocus
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
                        <p className="text-xs text-slate-500">{formData.description.length}/500 ký tự</p>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="branch">
                            Chi Nhánh <span className="text-red-500">*</span>
                        </Label>

                        {fetchingData ? (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải danh sách chi nhánh...
                            </div>
                        ) : branches.length === 0 ? (
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
                                            memberIds: [],
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
                                    <p className="text-xs text-slate-500">Nhóm sẽ thuộc chi nhánh này</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Team Leader Selection */}
                    {formData.branchId && (
                        <div className="space-y-2">
                            <Label htmlFor="leader">
                                Trưởng Nhóm (Manager) <span className="text-red-500">*</span>
                            </Label>

                            {managers.length === 0 ? (
                                <Alert className="bg-yellow-50 border-yellow-200">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800">
                                        Không có Manager nào trong chi nhánh này. Vui lòng thêm Manager trước.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    <Select
                                        value={formData.leaderId}
                                        onValueChange={(value) => setFormData({ ...formData, leaderId: value })}
                                        disabled={loading}
                                    >
                                        <SelectTrigger className={errors.leaderId ? 'border-red-500' : ''}>
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
                                    {errors.leaderId ? (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.leaderId}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-500">Manager sẽ quản lý nhóm này</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Members Selection */}
                    {formData.branchId && (
                        <div className="space-y-2">
                            <Label>
                                Thành Viên (Editors) <span className="text-slate-400">(Tùy chọn)</span>
                            </Label>

                            {editors.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>Chưa có Editor nào. Có thể thêm thành viên sau.</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
                                    <p className="text-xs text-slate-500 mb-2">
                                        Chọn {formData.memberIds?.length || 0} / {editors.length} editors
                                    </p>
                                    <div className="space-y-2">
                                        {editors.map((editor) => (
                                            <label
                                                key={editor._id}
                                                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={formData.memberIds?.includes(editor._id)}
                                                    onCheckedChange={() => toggleMember(editor._id)}
                                                    disabled={loading}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{editor.name}</p>
                                                    <p className="text-xs text-slate-500">{editor.email}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    {/* <Alert className="bg-green-50 border-green-200">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-lg font-semibold">ℹ</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-green-900 mb-1">Lưu ý:</p>
                                <ul className="list-disc list-inside space-y-1 text-green-800">
                                    <li>Nhóm sẽ được tạo với trạng thái "Hoạt động"</li>
                                    <li>Manager có thể quản lý tất cả thành viên và kênh của nhóm</li>
                                    <li>Editors có thể được thêm hoặc xóa sau khi tạo nhóm</li>
                                    <li>Có thể thêm kênh YouTube vào nhóm sau khi tạo</li>
                                </ul>
                            </div>
                        </div>
                    </Alert> */}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading || branches.length === 0}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <Users className="w-4 h-4 mr-2" />
                                    Tạo Nhóm
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
