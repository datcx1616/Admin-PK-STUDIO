

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Crown,
    Monitor,
    Edit2,
    Search,
    UserPlus,
    Download,
    Filter,
    X,
    Building2,
} from 'lucide-react';
import { UserTable } from '@/pages/examples/roles/components/UserTable';
import { UserFormDialog } from '@/pages/examples/roles/components/UserFormDialog';
import { useUsers } from '@/hooks/useUsers';
import type { User } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';
import axios from 'axios';
import { toast } from 'sonner';

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

export default function UsersManagementPage() {
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const {
        users,
        loading,
        stats,
        refetch,
        createUser,
        updateUser,
        deleteUser,
        changeRole,
        assignBranch,
    } = useUsers({
        filters: {
            role: selectedRole === 'all' ? undefined : (selectedRole as any),
            searchQuery: searchQuery || undefined,
            branchId: selectedBranch || undefined,
        },
    });

    useEffect(() => {
        fetchBranches();
        fetchTeams();
    }, []);

    const fetchBranches = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            const response = await axios.get(`${API_URL}/branches`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBranches(response.data.branches || response.data.data || response.data || []);
        } catch (error) {
            console.error('Lỗi khi tải chi nhánh:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

            const response = await axios.get(`${API_URL}/teams`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTeams(response.data.teams || response.data.data || response.data || []);
        } catch (error) {
            console.error('Lỗi khi tải nhóm:', error);
        }
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormMode('create');
        setFormDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormMode('edit');
        setFormDialogOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        if (formMode === 'create') {
            await createUser(data);
        } else if (editingUser) {
            await updateUser(editingUser._id, data);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
        } catch (error) {
            // Lỗi đã được xử lý trong hook
        }
    };

    const handleToggleActive = async (user: User) => {
        try {
            await updateUser(user._id, { isActive: !user.isActive });
            toast.success(
                user.isActive
                    ? 'Đã vô hiệu hóa người dùng thành công'
                    : 'Đã kích hoạt người dùng thành công'
            );
        } catch (error) {
            // Lỗi đã được xử lý trong hook
        }
    };

    const handleChangeRole = async (user: User) => {
        const roleLabels = Object.entries(ROLE_CONFIG)
            .map(([key, config]) => `${key}: ${config.label}`)
            .join('\n');

        const newRole = prompt(
            `Nhập vai trò mới cho ${user.name}:\n\n${roleLabels}\n\nVai trò hiện tại: ${user.role}`,
            user.role
        );

        if (newRole && newRole !== user.role && Object.keys(ROLE_CONFIG).includes(newRole)) {
            try {
                await changeRole(user._id, newRole);
            } catch (error) {
                // Lỗi đã được xử lý trong hook
            }
        } else if (newRole && !Object.keys(ROLE_CONFIG).includes(newRole)) {
            toast.error('Vai trò không hợp lệ');
        }
    };

    const handleAssignBranch = async (user: User) => {
        if (branches.length === 0) {
            toast.error('Không có chi nhánh nào để gán');
            return;
        }

        const branchList = branches.map(b => `${b.code}: ${b.name}`).join('\n');
        const branchInput = prompt(
            `Chọn chi nhánh cho ${user.name}:\n\n${branchList}\n\nNhập mã chi nhánh (code):`,
            ''
        );

        if (branchInput) {
            const branch = branches.find(b => b.code === branchInput || b._id === branchInput);
            if (branch) {
                try {
                    await assignBranch(user._id, branch._id);
                } catch (error) {
                    // Lỗi đã được xử lý trong hook
                }
            } else {
                toast.error('Không tìm thấy chi nhánh với mã này');
            }
        }
    };

    const handleExportUsers = () => {
        const csv = [
            ['Tên', 'Email', 'Vai trò', 'Chi nhánh', 'Nhóm', 'Trạng thái', 'Ngày tạo'].join(','),
            ...users.map(user => [
                `"${user.name}"`,
                user.email,
                user.role,
                typeof user.branch === 'object' ? `"${user.branch?.name || '-'}"` : '-',
                typeof user.team === 'object' ? `"${user.team?.name || '-'}"` : '-',
                user.isActive ? 'Hoạt động' : 'Không hoạt động',
                new Date(user.createdAt).toLocaleDateString('vi-VN'),
            ].join(',')),
        ].join('\n');

        const BOM = '\uFEFF'; // UTF-8 BOM for Excel
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nguoi_dung_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearFilters = () => {
        setSelectedRole('all');
        setSearchQuery('');
        setSelectedBranch('');
    };

    const hasActiveFilters = selectedRole !== 'all' || searchQuery || selectedBranch;

    const roleStats = [
        {
            title: 'Tổng người dùng',
            count: stats.total,
            icon: Users,
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-600',
        },
        {
            title: 'Admin & Giám đốc',
            count: stats.admin + stats.director,
            icon: Crown,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            title: 'Giám đốc chi nhánh',
            count: stats.branch_director,
            icon: Building2,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Quản lý',
            count: stats.manager,
            icon: Monitor,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Biên tập viên',
            count: stats.editor,
            icon: Edit2,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Tiêu đề */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
                        <p className="text-slate-600 mt-1">Quản lý người dùng và phân quyền trong hệ thống</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportUsers}
                            disabled={users.length === 0}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Xuất file CSV
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleCreateUser}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Thêm người dùng
                        </Button>
                    </div>
                </div>

                {/* Thẻ thống kê */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {roleStats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                                        <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                                    </div>
                                    <div className={`${stat.iconBg} p-3 rounded-xl`}>
                                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Bộ lọc */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {/* Thanh tìm kiếm */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm theo tên, email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Bộ lọc
                                {hasActiveFilters && (
                                    <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                        {[selectedRole !== 'all', searchQuery, selectedBranch].filter(Boolean).length}
                                    </span>
                                )}
                            </Button>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>

                        {/* Tab vai trò */}
                        <Tabs value={selectedRole} onValueChange={setSelectedRole}>
                            <TabsList className="bg-slate-100 border rounded-lg grid grid-cols-3 md:grid-cols-6 p-1 gap-1 h-auto">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-red-700 data-[state=active]:text-white text-xs rounded-md py-2"
                                >
                                    Tất cả ({stats.total})
                                </TabsTrigger>
                                {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                                    <TabsTrigger
                                        key={key}
                                        value={key}
                                        className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs rounded-md py-2"
                                    >
                                        {config.label} ({(stats as any)[key] || 0})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        {/* Bộ lọc nâng cao */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                                        Lọc theo chi nhánh
                                    </label>
                                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tất cả chi nhánh" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Tất cả chi nhánh</SelectItem>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch._id} value={branch._id}>
                                                    {branch.name} ({branch.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Bảng người dùng */}
            <UserTable
                users={users}
                loading={loading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onChangeRole={handleChangeRole}
                onAssignBranch={handleAssignBranch}
                onToggleActive={handleToggleActive}
            />

            {/* Hộp thoại form */}
            <UserFormDialog
                open={formDialogOpen}
                onClose={() => {
                    setFormDialogOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                branches={branches}
                teams={teams}
                mode={formMode}
            />
        </div>
    );
}
