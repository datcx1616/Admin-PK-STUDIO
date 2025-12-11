// pages/teams/TeamsManagementPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Youtube,
    User,
    Building2,
    Loader2,
    UserPlus,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { teamsAPI, type Team } from '@/lib/teams-api';
import { apiClient } from '@/lib/api-client';
import { CreateTeamModal } from '@/pages/teams/components/CreateTeamModal';
import { EditTeamModal } from '@/pages/teams/components/EditTeamModal';
import { TeamDetailsModal } from '@/pages/teams/components/TeamDetailsModal';
import { DeleteTeamDialog } from '@/pages/teams/components/DeleteTeamDialog';
import { ManageMembersModal } from '@/pages/teams/components/ManageMembersModal';
import { ContentHeader } from "../components/ContentHeader";

interface Branch {
    _id: string;
    name: string;
    code: string;
}

export default function TeamsManagementPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<string>('all');

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [teams, searchQuery, selectedBranch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch teams
            const teamsData = await teamsAPI.getAll();
            setTeams(teamsData);

            // Fetch branches for filter
            const branchesData = await apiClient.getBranches();
            const branchesArray = branchesData.branches || branchesData.data || [];
            setBranches(branchesArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...teams];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (team) =>
                    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team.leader?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Branch filter
        if (selectedBranch !== 'all') {
            filtered = filtered.filter((team) => team.branch._id === selectedBranch);
        }

        setFilteredTeams(filtered);
    };

    const handleCreateSuccess = () => {
        fetchData();
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        fetchData();
        setShowEditModal(false);
        setSelectedTeam(null);
    };

    const handleDeleteSuccess = () => {
        fetchData();
        setShowDeleteDialog(false);
        setSelectedTeam(null);
    };

    const handleMembersSuccess = () => {
        fetchData();
    };

    const openEditModal = (team: Team) => {
        setSelectedTeam(team);
        setShowEditModal(true);
    };

    const openDetailsModal = (team: Team) => {
        setSelectedTeam(team);
        setShowDetailsModal(true);
    };

    const openDeleteDialog = (team: Team) => {
        setSelectedTeam(team);
        setShowDeleteDialog(true);
    };

    const openMembersModal = (team: Team) => {
        setSelectedTeam(team);
        setShowMembersModal(true);
    };

    // Calculate statistics
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
    const totalChannels = teams.reduce((sum, team) => sum + (team.channels?.length || 0), 0);

    return (
        <div className="w-full min-h-screen bg-slate-50">
            {/* Header */}
            <ContentHeader
                breadcrumbs={[
                    { label: 'Quản Lý Nhóm' }
                ]}
                actions={
                    <Button onClick={() => setShowCreateModal(true)} className="bg-red-600 hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Nhóm
                    </Button>
                }
                className="border shadow-sm border-l-0 rounded-none"
            />

            {/* <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Quản Lý Nhóm</h1>
                    <p className="text-sm text-slate-500 mt-1">Quản lý các nhóm làm việc trong hệ thống</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Nhóm
                </Button>
            </div> */}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-6">
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tổng số nhóm</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalTeams}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tổng thành viên</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalMembers}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tổng kênh</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{totalChannels}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Youtube className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="mb-6 p-6">
                <Card >
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg">Lọc và Tìm Kiếm</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm nhóm, trưởng nhóm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Branch Filter */}
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            {branch.code} - {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Teams Table */}
            <div className="mb-6 p-6">
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : filteredTeams.length === 0 ? (
                            <Alert className="m-6">
                                <Building2 className="h-4 w-4" />
                                <AlertDescription>
                                    {searchQuery || selectedBranch !== 'all'
                                        ? 'Không tìm thấy nhóm nào phù hợp với bộ lọc'
                                        : 'Chưa có nhóm nào. Hãy tạo nhóm đầu tiên!'}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead className="font-semibold">Tên Nhóm</TableHead>
                                        <TableHead className="font-semibold">Chi Nhánh</TableHead>
                                        <TableHead className="font-semibold">Trưởng Nhóm</TableHead>
                                        <TableHead className="font-semibold text-center">Thành Viên</TableHead>
                                        <TableHead className="font-semibold text-center">Kênh</TableHead>
                                        <TableHead className="font-semibold text-center">Trạng Thái</TableHead>
                                        <TableHead className="font-semibold text-right">Hành Động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeams.map((team) => (
                                        <TableRow key={team._id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{team.name}</div>
                                                    {team.description && (
                                                        <div className="text-xs text-slate-500 truncate max-w-xs">{team.description}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {team.branch.code || ''} - {team.branch.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="text-sm font-medium">{team.leader?.name || '—'}</div>
                                                    {team.leader?.email && <div className="text-xs text-slate-500">{team.leader.email}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{team.members?.length || 0}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{team.channels?.length || 0}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={team.isActive ? 'default' : 'secondary'} className={team.isActive ? 'bg-green-600' : ''}>
                                                    {team.isActive ? 'Hoạt động' : 'Không hoạt động'}
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
                                                        <DropdownMenuItem onClick={() => openDetailsModal(team)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openMembersModal(team)}>
                                                            <UserPlus className="h-4 w-4 mr-2" />
                                                            Quản lý thành viên
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEditModal(team)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDeleteDialog(team)} className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>


            {/* Modals */}
            <CreateTeamModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={handleCreateSuccess} />

            <EditTeamModal
                open={showEditModal}
                team={selectedTeam}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedTeam(null);
                }}
                onSuccess={handleEditSuccess}
            />

            <TeamDetailsModal
                open={showDetailsModal}
                teamId={selectedTeam?._id || null}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTeam(null);
                }}
            />

            <ManageMembersModal
                open={showMembersModal}
                team={selectedTeam}
                onClose={() => {
                    setShowMembersModal(false);
                    setSelectedTeam(null);
                }}
                onSuccess={handleMembersSuccess}
            />

            <DeleteTeamDialog
                open={showDeleteDialog}
                team={selectedTeam}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setSelectedTeam(null);
                }}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}
