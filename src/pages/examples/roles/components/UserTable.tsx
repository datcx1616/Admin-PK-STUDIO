
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    Building2,
    UserCheck,
    UserX,
} from 'lucide-react';
import type { User } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

interface UserTableProps {
    users: User[];
    loading?: boolean;
    onEdit?: (user: User) => void;
    onDelete?: (userId: string) => void;
    onChangeRole?: (user: User) => void;
    onAssignBranch?: (user: User) => void;
    onToggleActive?: (user: User) => void;
}

export function UserTable({
    users,
    loading = false,
    onEdit,
    onDelete,
    onChangeRole,
    onAssignBranch,
    onToggleActive,
}: UserTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const getInitials = (name: string): string => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[parts.length - 1][0];
        }
        return name.substring(0, 2);
    };

    const getBranchName = (user: User): string => {
        if (!user.branch) return '-';
        if (typeof user.branch === 'object' && user.branch.name) {
            return user.branch.name;
        }
        return '-';
    };

    const getTeamName = (user: User): string => {
        if (!user.team) return '-';
        if (typeof user.team === 'object' && user.team.name) {
            return user.team.name;
        }
        return '-';
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return '-';
        }
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete && onDelete) {
            onDelete(userToDelete._id);
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 border rounded-lg">
                <UserX className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Không tìm thấy người dùng</p>
                <p className="text-sm mt-2">Thử điều chỉnh bộ lọc hoặc tạo người dùng mới</p>
            </div>
        );
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-[300px]">Người dùng</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Chi nhánh</TableHead>
                            <TableHead>Nhóm</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const roleConfig = ROLE_CONFIG[user.role];

                            return (
                                <TableRow key={user._id} className="hover:bg-slate-50">
                                    {/* Thông tin người dùng */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className={`${roleConfig.avatarColor} h-10 w-10`}>
                                                <AvatarFallback className="text-white font-semibold">
                                                    {getInitials(user.name).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Vai trò */}
                                    <TableCell>
                                        <Badge className={`${roleConfig.color} border-0`}>
                                            {roleConfig.label}
                                        </Badge>
                                    </TableCell>

                                    {/* Chi nhánh */}
                                    <TableCell>
                                        <p className="text-sm text-slate-700">
                                            {getBranchName(user)}
                                        </p>
                                    </TableCell>

                                    {/* Nhóm */}
                                    <TableCell>
                                        <p className="text-sm text-slate-700">
                                            {getTeamName(user)}
                                        </p>
                                    </TableCell>

                                    {/* Trạng thái */}
                                    <TableCell>
                                        <Badge
                                            variant={user.isActive ? 'default' : 'secondary'}
                                            className={
                                                user.isActive
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                                            }
                                        >
                                            {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </Badge>
                                    </TableCell>

                                    {/* Ngày tạo */}
                                    <TableCell>
                                        <p className="text-sm text-slate-600">
                                            {formatDate(user.createdAt)}
                                        </p>
                                    </TableCell>

                                    {/* Thao tác */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                {onEdit && (
                                                    <DropdownMenuItem onClick={() => onEdit(user)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                )}

                                                {onChangeRole && (
                                                    <DropdownMenuItem onClick={() => onChangeRole(user)}>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Đổi vai trò
                                                    </DropdownMenuItem>
                                                )}

                                                {onAssignBranch && (
                                                    <DropdownMenuItem onClick={() => onAssignBranch(user)}>
                                                        <Building2 className="mr-2 h-4 w-4" />
                                                        Gán chi nhánh
                                                    </DropdownMenuItem>
                                                )}

                                                {onToggleActive && (
                                                    <DropdownMenuItem onClick={() => onToggleActive(user)}>
                                                        {user.isActive ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Vô hiệu hóa
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Kích hoạt
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                )}

                                                {onDelete && user.role !== 'admin' && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(user)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Xóa người dùng
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Hộp thoại xác nhận xóa */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn người dùng{' '}
                            <span className="font-semibold">{userToDelete?.name}</span>.
                            Thao tác này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
