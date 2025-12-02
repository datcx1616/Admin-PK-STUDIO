
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Building2, X } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useUsers } from '@/hooks/useUsers';
import type { Branch, UpdateBranchRequest } from '@/types/branch.types';

interface EditBranchModalProps {
    open: boolean;
    branch: Branch;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditBranchModal({ open, branch, onClose, onSuccess }: EditBranchModalProps) {
    const { updateBranch } = useBranches({ autoFetch: false });
    const { users } = useUsers({ filters: { role: 'branch_director' } });

    const [formData, setFormData] = useState<UpdateBranchRequest>({
        name: '',
        description: '',
        location: '',
        isActive: true,
        director: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && branch) {
            setFormData({
                name: branch.name,
                description: branch.description,
                location: branch.location || '',
                isActive: branch.isActive,
                director: branch.director?._id || '',
            });
            setErrors({});
        }
    }, [open, branch]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Tên chi nhánh là bắt buộc';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'Mô tả là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await updateBranch(branch._id, formData);
            onSuccess();
        } catch (error) {
            console.error('Cập nhật chi nhánh thất bại:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Chỉnh Sửa Chi Nhánh</h2>
                            <p className="text-sm text-slate-500">Cập nhật thông tin chi nhánh</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {branch.code && (
                        <div>
                            <Label>Mã Chi Nhánh</Label>
                            <Input
                                value={branch.code}
                                disabled
                                className="bg-slate-100"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Mã chi nhánh không thể thay đổi
                            </p>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="name">
                            Tên Chi Nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500' : ''}
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">
                            Mô Tả <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            disabled={loading}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="location">Địa Điểm</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="director">Giám Đốc Chi Nhánh</Label>
                        <Select
                            value={formData.director || undefined}
                            onValueChange={(value) => setFormData({ ...formData, director: value })}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-- Chọn Giám Đốc (Tùy chọn) --" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.length === 0 ? (
                                    <div className="p-2 text-sm text-slate-500 text-center">
                                        Không có giám đốc khả dụng
                                    </div>
                                ) : (
                                    users.map((user) => (
                                        <SelectItem key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Trạng Thái Hoạt Động
                            </Label>
                            <p className="text-xs text-slate-500 mt-1">
                                Chi nhánh ngừng hoạt động sẽ bị ẩn khỏi hầu hết các màn hình
                            </p>
                        </div>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập Nhật Chi Nhánh'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
