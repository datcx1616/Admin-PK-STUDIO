
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
    Building2,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    BarChart3,
    Users,
    Youtube,
    TrendingUp,
    Loader2,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useBranches } from '@/hooks/useBranches';
import { CreateBranchModal } from './components/CreateBranchModal';
import { EditBranchModal } from './components/EditBranchModal';
import { BranchDetailModal } from './components/BranchDetailModal';
import { BranchAnalyticsModal } from './components/BranchAnalyticsModal';
import type { Branch } from '@/types/branch.types';

export default function BranchManagementPage() {
    const { branches, loading, refetch, deleteBranch } = useBranches();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('cards');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const filteredBranches = branches.filter(branch => {
        const query = searchQuery.toLowerCase();
        return (
            branch.name.toLowerCase().includes(query) ||
            branch.code?.toLowerCase().includes(query) ||
            branch.description.toLowerCase().includes(query) ||
            branch.location?.toLowerCase().includes(query)
        );
    });

    const totalBranches = branches.length;
    const activeBranches = branches.filter(b => b.isActive).length;
    const totalTeams = branches.reduce((sum, b) => sum + (b.teamsCount || 0), 0);
    const totalChannels = branches.reduce((sum, b) => sum + (b.channelsCount || 0), 0);

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        refetch();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedBranch(null);
        refetch();
    };

    const handleDelete = async () => {
        if (selectedBranch) {
            await deleteBranch(selectedBranch._id);
            setShowDeleteDialog(false);
            setSelectedBranch(null);
            refetch();
        }
    };

    const toggleCardExpand = (branchId: string) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(branchId)) {
                newSet.delete(branchId);
            } else {
                newSet.add(branchId);
            }
            return newSet;
        });
    };

    const formatNumber = (num: number | undefined): string => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'Tr';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản Lý Chi Nhánh</h1>
                        <p className="text-sm text-slate-500 mt-1">Quản lý tất cả các chi nhánh trong hệ thống</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Chi Nhánh
                    </Button>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Tổng Chi Nhánh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalBranches}</p>
                                </div>
                                <Building2 className="w-10 h-10 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Đang Hoạt Động</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{activeBranches}</p>
                                </div>
                                <TrendingUp className="w-10 h-10 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Tổng Nhóm</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalTeams}</p>
                                </div>
                                <Users className="w-10 h-10 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* <Card className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Tổng Kênh</p>
                                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalChannels}</p>
                                </div>
                                <Youtube className="w-10 h-10 text-red-500" />
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Tìm Kiếm & Bộ Lọc</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Tìm kiếm theo tên, mã, mô tả, địa điểm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="cards">Dạng Thẻ</TabsTrigger>
                        <TabsTrigger value="table">Dạng Bảng</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cards" className="mt-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : filteredBranches.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center py-12">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p className="text-slate-500">Không tìm thấy chi nhánh nào</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredBranches.map((branch) => {
                                    const isExpanded = expandedCards.has(branch._id);

                                    return (
                                        <Card key={branch._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                            <Building2 className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-white text-lg">{branch.name}</span>
                                                                {branch.code && (
                                                                    <Badge className="bg-white/20 text-white border-0 text-xs">
                                                                        {branch.code}
                                                                    </Badge>
                                                                )}
                                                                <Badge
                                                                    variant={branch.isActive ? "default" : "secondary"}
                                                                    className="text-xs"
                                                                >
                                                                    {branch.isActive ? 'Hoạt động' : 'Ngừng'}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-white/80 mt-0.5">{branch.description}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleCardExpand(branch._id)}
                                                            className="text-white hover:bg-white/20"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </Button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowDetailModal(true);
                                                                }}>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Xem Chi Tiết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowEditModal(true);
                                                                }}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Chỉnh Sửa
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowAnalyticsModal(true);
                                                                }}>
                                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                                    Phân Tích
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedBranch(branch);
                                                                        setShowDeleteDialog(true);
                                                                    }}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Xóa
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 mt-3 text-white/90 text-sm">
                                                    {branch.location && (
                                                        <span>📍 {branch.location}</span>
                                                    )}
                                                    <span>{branch.teamsCount || 0} nhóm</span>
                                                    <span>{branch.channelsCount || 0} kênh</span>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <CardContent className="pt-4">
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="p-3 bg-blue-50 rounded-lg">
                                                            <p className="text-xs text-slate-500">Giám Đốc</p>
                                                            <p className="text-sm font-medium text-slate-900 mt-1">
                                                                {branch.director?.name || 'Chưa có'}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-green-50 rounded-lg">
                                                            <p className="text-xs text-slate-500">Tổng Nhóm</p>
                                                            <p className="text-sm font-medium text-slate-900 mt-1">
                                                                {branch.teamsCount || 0}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-purple-50 rounded-lg">
                                                            <p className="text-xs text-slate-500">Tổng Kênh</p>
                                                            <p className="text-sm font-medium text-slate-900 mt-1">
                                                                {branch.channelsCount || 0}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="table" className="mt-6">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="font-semibold">Chi Nhánh</TableHead>
                                            <TableHead className="font-semibold">Địa Điểm</TableHead>
                                            <TableHead className="font-semibold">Giám Đốc</TableHead>
                                            <TableHead className="font-semibold">Nhóm</TableHead>
                                            <TableHead className="font-semibold">Kênh</TableHead>
                                            <TableHead className="font-semibold">Trạng Thái</TableHead>
                                            <TableHead className="font-semibold text-right">Hành Động</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredBranches.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                                                    Không tìm thấy chi nhánh nào
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBranches.map((branch) => (
                                                <TableRow key={branch._id} className="hover:bg-slate-50">
                                                    <TableCell>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{branch.name}</span>
                                                                {branch.code && (
                                                                    <Badge variant="outline" className="text-xs">{branch.code}</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-1">{branch.description}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{branch.location || '—'}</TableCell>
                                                    <TableCell>{branch.director?.name || '—'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{branch.teamsCount || 0}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{branch.channelsCount || 0}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={branch.isActive ? "default" : "secondary"}>
                                                            {branch.isActive ? 'Hoạt động' : 'Ngừng'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowDetailModal(true);
                                                                }}>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Xem Chi Tiết
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowEditModal(true);
                                                                }}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Chỉnh Sửa
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setSelectedBranch(branch);
                                                                    setShowAnalyticsModal(true);
                                                                }}>
                                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                                    Phân Tích
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedBranch(branch);
                                                                        setShowDeleteDialog(true);
                                                                    }}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Xóa
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CreateBranchModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            {selectedBranch && (
                <>
                    <EditBranchModal
                        open={showEditModal}
                        branch={selectedBranch}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedBranch(null);
                        }}
                        onSuccess={handleEditSuccess}
                    />

                    <BranchDetailModal
                        open={showDetailModal}
                        branchId={selectedBranch._id}
                        onClose={() => {
                            setShowDetailModal(false);
                            setSelectedBranch(null);
                        }}
                    />

                    <BranchAnalyticsModal
                        open={showAnalyticsModal}
                        branchId={selectedBranch._id}
                        branchName={selectedBranch.name}
                        onClose={() => {
                            setShowAnalyticsModal(false);
                            setSelectedBranch(null);
                        }}
                    />
                </>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác Nhận Xóa Chi Nhánh</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa chi nhánh <strong>{selectedBranch?.name}</strong>?
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
