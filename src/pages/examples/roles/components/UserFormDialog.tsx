

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

interface Branch {
    _id: string;
    name: string;
    code: string;
}

interface Team {
    _id: string;
    name: string;
    branch: string;
}

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
    user?: User | null;
    branches?: Branch[];
    teams?: Team[];
    mode?: 'create' | 'edit';
}

export function UserFormDialog({
    open,
    onClose,
    onSubmit,
    user,
    branches = [],
    teams = [],
    mode = 'create',
}: UserFormDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        branchId: '',
        teamId: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

    useEffect(() => {
        if (user && mode === 'edit') {
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                confirmPassword: '',
                role: user.role,
                branchId: typeof user.branch === 'object' ? user.branch?._id || '' : '',
                teamId: typeof user.team === 'object' ? user.team?._id || '' : '',
            });
        } else {
            resetForm();
        }
    }, [user, mode, open]);

    useEffect(() => {
        if (formData.branchId) {
            const filtered = teams.filter((t) => t.branch === formData.branchId);
            setFilteredTeams(filtered);
        } else {
            setFilteredTeams([]);
        }
    }, [formData.branchId, teams]);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            branchId: '',
            teamId: '',
        });
        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Kiểm tra tên
        if (!formData.name.trim()) {
            newErrors.name = 'Tên là bắt buộc';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên phải có ít nhất 3 ký tự';
        }

        // Kiểm tra email
        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Định dạng email không hợp lệ';
        }

        // Kiểm tra mật khẩu (chỉ khi tạo mới)
        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'Mật khẩu là bắt buộc';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu không khớp';
            }
        } else if (formData.password) {
            // Khi chỉnh sửa và có nhập mật khẩu mới
            if (formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu không khớp';
            }
        }

        // Kiểm tra vai trò
        if (!formData.role) {
            newErrors.role = 'Vai trò là bắt buộc';
        }

        // Kiểm tra chi nhánh (bắt buộc cho branch_director, manager, editor)
        if (['branch_director', 'manager', 'editor'].includes(formData.role) && !formData.branchId) {
            newErrors.branchId = 'Chi nhánh là bắt buộc cho vai trò này';
        }

        // Kiểm tra nhóm (bắt buộc cho manager, editor)
        if (['manager', 'editor'].includes(formData.role) && !formData.teamId) {
            newErrors.teamId = 'Nhóm là bắt buộc cho vai trò này';
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
            if (mode === 'create') {
                const createData: CreateUserRequest = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role as any,
                };

                if (formData.branchId) createData.branchId = formData.branchId;
                if (formData.teamId) createData.teamId = formData.teamId;

                await onSubmit(createData);
            } else {
                const updateData: UpdateUserRequest = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    role: formData.role as any,
                };

                if (formData.password) {
                    updateData.password = formData.password;
                }

                if (formData.branchId) updateData.branchId = formData.branchId;
                if (formData.teamId) updateData.teamId = formData.teamId;

                await onSubmit(updateData);
            }

            onClose();
            resetForm();
        } catch (error) {
            console.error('Lỗi khi gửi form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            // Reset các trường phụ thuộc khi thay đổi vai trò
            if (field === 'role') {
                newData.branchId = '';
                newData.teamId = '';
            }

            // Reset team khi thay đổi chi nhánh
            if (field === 'branchId') {
                newData.teamId = '';
            }

            return newData;
        });

        // Xóa lỗi của trường vừa sửa
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const requiresBranch = ['branch_director', 'manager', 'editor'].includes(formData.role);
    const requiresTeam = ['manager', 'editor'].includes(formData.role);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Tạo người dùng mới' : 'Chỉnh sửa người dùng'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Thêm người dùng mới vào hệ thống'
                            : 'Cập nhật thông tin người dùng'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Họ tên */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Nguyễn Văn A"
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="nguyenvana@example.com"
                            className={errors.email ? 'border-red-500' : ''}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Mật khẩu */}
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Mật khẩu {mode === 'create' && <span className="text-red-500">*</span>}
                            {mode === 'edit' && <span className="text-xs text-slate-500 ml-2">(Để trống nếu không đổi)</span>}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                placeholder="••••••••"
                                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    {(mode === 'create' || formData.password) && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Xác nhận mật khẩu {mode === 'create' && <span className="text-red-500">*</span>}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Vai trò */}
                    <div className="space-y-2">
                        <Label htmlFor="role">
                            Vai trò <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => handleChange('role', value)}
                            disabled={loading}
                        >
                            <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{config.label}</span>
                                            <span className="text-xs text-slate-500">{config.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Chi nhánh (điều kiện) */}
                    {requiresBranch && (
                        <div className="space-y-2">
                            <Label htmlFor="branch">
                                Chi nhánh <span className="text-red-500">*</span>
                            </Label>
                            {branches.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    ⚠️ Không có chi nhánh nào. Vui lòng tạo chi nhánh trước.
                                </div>
                            ) : (
                                <>
                                    <Select
                                        value={formData.branchId}
                                        onValueChange={(value) => handleChange('branchId', value)}
                                        disabled={loading}
                                    >
                                        <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn chi nhánh" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch._id} value={branch._id}>
                                                    {branch.name} ({branch.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.branchId && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.branchId}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Nhóm (điều kiện) */}
                    {requiresTeam && formData.branchId && (
                        <div className="space-y-2">
                            <Label htmlFor="team">
                                Nhóm <span className="text-red-500">*</span>
                            </Label>
                            {filteredTeams.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    ⚠️ Chi nhánh này chưa có nhóm nào. Vui lòng tạo nhóm trước.
                                </div>
                            ) : (
                                <>
                                    <Select
                                        value={formData.teamId}
                                        onValueChange={(value) => handleChange('teamId', value)}
                                        disabled={loading}
                                    >
                                        <SelectTrigger className={errors.teamId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn nhóm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredTeams.map((team) => (
                                                <SelectItem key={team._id} value={team._id}>
                                                    {team.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.teamId && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.teamId}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
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
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...'}
                                </>
                            ) : (
                                <>{mode === 'create' ? 'Tạo người dùng' : 'Cập nhật'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
