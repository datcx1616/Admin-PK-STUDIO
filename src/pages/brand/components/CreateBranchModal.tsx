
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
import { Building2, X } from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { useUsers } from '@/hooks/useUsers';
import type { CreateBranchRequest } from '@/types/branch.types';

interface CreateBranchModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateBranchModal({ open, onClose, onSuccess }: CreateBranchModalProps) {
    const { createBranch } = useBranches({ autoFetch: false });
    const { users } = useUsers({ filters: { role: 'branch_director' } });

    const [formData, setFormData] = useState<CreateBranchRequest>({
        name: '',
        code: '',
        description: '',
        location: '',
        director: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                code: '',
                description: '',
                location: '',
                director: '',
            });
            setErrors({});
        }
    }, [open]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên chi nhánh là bắt buộc';
        }

        if (formData.code && !/^[A-Z0-9]+$/.test(formData.code)) {
            newErrors.code = 'Mã chi nhánh chỉ được chứa chữ in hoa và số';
        }

        if (!formData.description.trim()) {
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
            const payload: CreateBranchRequest = {
                name: formData.name,
                description: formData.description,
            };

            if (formData.code) payload.code = formData.code;
            if (formData.location) payload.location = formData.location;
            if (formData.director) payload.director = formData.director;

            await createBranch(payload);
            onSuccess();
        } catch (error) {
            console.error('Tạo chi nhánh thất bại:', error);
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
                            <h2 className="text-xl font-bold text-slate-900">Thêm Chi Nhánh Mới</h2>
                            <p className="text-sm text-slate-500">Điền thông tin chi nhánh</p>
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
                    <div>
                        <Label htmlFor="name">
                            Tên Chi Nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ví dụ: Chi nhánh Hà Nội"
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
                        <Label htmlFor="code">Mã Chi Nhánh</Label>
                        <Input
                            id="code"
                            placeholder="Ví dụ: HN, HCM, DN"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            maxLength={10}
                            className={`uppercase ${errors.code ? 'border-red-500' : ''}`}
                            disabled={loading}
                        />
                        {errors.code ? (
                            <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                        ) : (
                            <p className="text-xs text-slate-500 mt-1">
                                Tùy chọn. Chỉ được dùng chữ in hoa và số
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">
                            Mô Tả <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả về chi nhánh..."
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
                            placeholder="Ví dụ: Hà Nội, Việt Nam"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={loading}
                        />
                        <p className="text-xs text-slate-500 mt-1">Tùy chọn</p>
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
                        <p className="text-xs text-slate-500 mt-1">
                            Tùy chọn. Chọn người dùng có vai trò Giám đốc chi nhánh
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-lg font-semibold">ℹ</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 mb-1">Lưu ý:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-800">
                                    <li>Chi nhánh sẽ được tạo với trạng thái Hoạt động</li>
                                    <li>Bạn có thể thêm các nhóm vào chi nhánh sau khi tạo</li>
                                    <li>Mã chi nhánh không thể thay đổi sau khi tạo</li>
                                </ul>
                            </div>
                        </div>
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
                                    Đang tạo...
                                </>
                            ) : (
                                'Tạo Chi Nhánh'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
