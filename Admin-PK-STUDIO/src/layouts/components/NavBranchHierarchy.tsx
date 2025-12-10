// src/layouts/components/NavBranchHierarchy.tsx
// VERSION 16: Separated chevron click (expand/collapse) from branch name click (navigate)
import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronRight, Building2, Users2, User2, Plus, Pencil, Trash2, Users, Youtube } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { branchesAPI } from "@/lib/branches-api"
import { teamsAPI } from "@/lib/teams-api"
import { cn } from "@/lib/utils"
import { CreateBranchModal } from "@/pages/brand/components/CreateBranchModal"
import { EditBranchModal } from "@/pages/brand/components/EditBranchModal"
import { CreateTeamModal } from "@/pages/teams/components/CreateTeamModal"
import { EditTeamModal } from "@/pages/teams/components/EditTeamModal"
import { DeleteTeamDialog } from "@/pages/teams/components/DeleteTeamDialog"
import { ManageMembersModal } from "@/pages/teams/components/ManageMembersModal"
import { AssignEditorsToTeamDialog } from "@/pages/teams/components/AssignEditorsToTeamDialog"
import type { Branch } from "@/types/branch.types"
import type { Team } from "@/lib/teams-api"

interface Member {
    _id: string
    name: string
    email: string
    role: string
}

interface TeamInHierarchy {
    _id: string
    name: string
    members?: Member[]
    membersCount?: number
}

interface BranchWithTeams extends Branch {
    teams?: TeamInHierarchy[]
}

// Helper để lấy user hiện tại
const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
    } catch {
        return null
    }
}

// Skeleton Loading Component
function HierarchySkeleton() {
    return (
        <SidebarGroup className="bg-[#F7F7F7]">
            <SidebarGroupLabel>Tổ chức</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center gap-2 px-2 py-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                    <div className="ml-6 mt-1 space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1.5">
                            <Skeleton className="h-3 w-3 rounded" />
                            <Skeleton className="h-3 flex-1" />
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5">
                            <Skeleton className="h-3 w-3 rounded" />
                            <Skeleton className="h-3 flex-1" />
                        </div>
                    </div>
                </SidebarMenuItem>

                <SidebarMenuItem className="mt-2">
                    <div className="flex items-center gap-2 px-2 py-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                    <div className="ml-6 mt-1 space-y-1">
                        <div className="flex items-center gap-2 px-2 py-1.5">
                            <Skeleton className="h-3 w-3 rounded" />
                            <Skeleton className="h-3 flex-1" />
                        </div>
                    </div>
                </SidebarMenuItem>

                <SidebarMenuItem className="mt-2">
                    <div className="flex items-center gap-2 px-2 py-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

export function NavBranchHierarchy() {
    const navigate = useNavigate()
    const location = useLocation()
    const [branches, setBranches] = React.useState<BranchWithTeams[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [expandedBranches, setExpandedBranches] = React.useState<Set<string>>(new Set())
    const [expandedTeams, setExpandedTeams] = React.useState<Set<string>>(new Set())
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [openBranchDropdown, setOpenBranchDropdown] = React.useState<string | null>(null)
    const [openTeamDropdown, setOpenTeamDropdown] = React.useState<string | null>(null)
    const [openMemberDropdown, setOpenMemberDropdown] = React.useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [showCreateTeamModal, setShowCreateTeamModal] = React.useState(false)
    const [showEditTeamModal, setShowEditTeamModal] = React.useState(false)
    const [showDeleteTeamDialog, setShowDeleteTeamDialog] = React.useState(false)
    const [showManageMembersModal, setShowManageMembersModal] = React.useState(false)
    const [showAssignEditorsDialog, setShowAssignEditorsDialog] = React.useState(false)
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null)
    const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null)
    const [isHoveredBranchId, setIsHoveredBranchId] = React.useState<string | null>(null)

    const currentUser = getCurrentUser()
    const userRole = currentUser?.role

    // Fetch dữ liệu
    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('🔄 [NavBranchHierarchy] Fetching branches...')

            const branchesData = await branchesAPI.getAll()
            console.log('✅ [NavBranchHierarchy] Branches:', branchesData)

            let filteredBranches = branchesData

            if (userRole === 'branch_director' && currentUser?.branch?._id) {
                filteredBranches = branchesData.filter(
                    b => b._id === currentUser.branch._id
                )
            }

            const branchesWithTeams = await Promise.all(
                filteredBranches.map(async (branch) => {
                    try {
                        console.log(`🔄 [NavBranchHierarchy] Fetching teams for branch: ${branch.name}`)

                        const teamsData = await branchesAPI.getTeams(branch._id)
                        console.log(`✅ [NavBranchHierarchy] Teams for ${branch.name}:`, teamsData)

                        let filteredTeams = teamsData

                        if (userRole === 'manager' && currentUser?.team?._id) {
                            filteredTeams = teamsData.filter((t: any) => t._id === currentUser.team._id)
                        }

                        const teamsWithMembers = await Promise.all(
                            filteredTeams.map(async (team: any) => {
                                try {
                                    console.log(`🔄 [NavBranchHierarchy] Fetching details for team: ${team.name}`)

                                    const teamDetail = await teamsAPI.getById(team._id)
                                    console.log(`✅ [NavBranchHierarchy] Team detail for ${team.name}:`, teamDetail)

                                    const members = (teamDetail.members || []).filter((member: Member) =>
                                        member.role === 'editor'
                                    )

                                    return {
                                        ...team,
                                        members: members,
                                        membersCount: members.length
                                    }
                                } catch (error) {
                                    console.error(`❌ Error fetching team details for ${team.name}:`, error)
                                    return {
                                        ...team,
                                        members: [],
                                        membersCount: 0
                                    }
                                }
                            })
                        )

                        console.log(`✅ [NavBranchHierarchy] Final teams with members for ${branch.name}:`, teamsWithMembers)

                        return {
                            ...branch,
                            teams: teamsWithMembers
                        }
                    } catch (error) {
                        console.error(`❌ Error fetching teams for branch ${branch._id}:`, error)
                        return { ...branch, teams: [] }
                    }
                })
            )

            console.log('✅ [NavBranchHierarchy] Final branches with teams and members:', branchesWithTeams)

            const finalBranches = ['admin', 'director'].includes(userRole)
                ? branchesWithTeams
                : branchesWithTeams.filter(b => b.teams && b.teams.length > 0)

            setBranches(finalBranches)

            if (finalBranches.length > 0) {
                setExpandedBranches(new Set([finalBranches[0]._id]))
            }
        } catch (error) {
            console.error('❌ [NavBranchHierarchy] Error fetching data:', error)
            setError('Không thể tải dữ liệu tổ chức')
        } finally {
            setLoading(false)
        }
    }, [userRole, currentUser?.branch?._id, currentUser?.team?._id])

    React.useEffect(() => {
        if (userRole && userRole !== 'editor') {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [fetchData, userRole])

    const toggleBranch = React.useCallback((branchId: string) => {
        setExpandedBranches(prev => {
            const next = new Set(prev)
            if (next.has(branchId)) {
                next.delete(branchId)
            } else {
                next.add(branchId)
            }
            return next
        })
    }, [])

    const toggleTeam = React.useCallback((teamId: string) => {
        setExpandedTeams(prev => {
            const next = new Set(prev)
            if (next.has(teamId)) {
                next.delete(teamId)
            } else {
                next.add(teamId)
            }
            return next
        })
    }, [])

    const handleDelete = async () => {
        if (selectedBranch) {
            try {
                await branchesAPI.delete(selectedBranch._id)
                setShowDeleteDialog(false)
                setSelectedBranch(null)
                fetchData()
            } catch (error) {
                console.error('❌ Error deleting branch:', error)
            }
        }
    }

    if (userRole === 'editor') {
        return null
    }

    if (loading) {
        return <HierarchySkeleton />
    }

    if (error) {
        return (
            <SidebarGroup className="bg-[#F7F7F7]">
                <SidebarGroupLabel>Tổ chức</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-2 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        )
    }

    if (branches.length === 0) {
        return (
            <SidebarGroup className="bg-[#F7F7F7]">
                <div className="flex items-center justify-between px-2 mb-1 group hover:bg-accent rounded transition-colors cursor-pointer">
                    <SidebarGroupLabel className="mb-0">Tổ chức</SidebarGroupLabel>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="h-5 w-5 rounded hover:bg-accent flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-hover:scale-110 active:scale-95"
                        title="Thêm chi nhánh"
                    >
                        <Plus className="h-3.5 w-3.5 transition-transform" />
                    </button>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-2 py-2 text-sm text-muted-foreground">
                            Không có dữ liệu
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
                <CreateBranchModal
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchData()
                    }}
                />
            </SidebarGroup>
        )
    }

    return (
        <SidebarGroup className="bg-[#F7F7F7]">
            <div className="flex items-center justify-between px-2 mb-1 group hover:bg-accent rounded transition-colors cursor-pointer">
                <SidebarGroupLabel className="mb-0">Tổ chức</SidebarGroupLabel>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="h-5 w-5 rounded hover:bg-accent flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-hover:scale-110 active:scale-95"
                    title="Thêm chi nhánh"
                >
                    <Plus className="h-3.5 w-3.5 transition-transform" />
                </button>
            </div>
            <SidebarMenu className="p-0 space-y-1">
                {branches.map((branch) => {
                    const isBranchExpanded = expandedBranches.has(branch._id)
                    const hasTeams = branch.teams && branch.teams.length > 0

                    return (
                        <Collapsible
                            key={branch._id}
                            open={isBranchExpanded}
                            onOpenChange={() => toggleBranch(branch._id)}
                        >
                            <SidebarMenuItem className="p-0">
                                <div
                                    className={cn(
                                        "group h-auto py-1.5 px-2 relative rounded-md w-full flex items-center gap-2",
                                        location.pathname === `/branches/${branch._id}`
                                            ? "bg-[#DEDFE3]"
                                            : "hover:bg-[#EAEBEE]"
                                    )}
                                    onMouseEnter={() => setIsHoveredBranchId(branch._id)}
                                    onMouseLeave={() => setIsHoveredBranchId(null)}
                                >
                                    {/* 1. ICON - Building2 mặc định, hover thành ChevronRight nếu có team, nếu không thì luôn là Building2 */}
                                    <div
                                        className="h-3.5 w-3.5 shrink-0 cursor-pointer flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (hasTeams) toggleBranch(branch._id)
                                        }}
                                        title={hasTeams ? "Mở/đóng chi nhánh" : "Chi nhánh chưa có nhóm"}
                                    >
                                        {hasTeams && isHoveredBranchId === branch._id ? (
                                            <ChevronRight className={cn(
                                                "h-3.5 w-3.5 transition-transform duration-200",
                                                expandedBranches.has(branch._id) && "rotate-90"
                                            )} style={{ color: 'oklch(0.145 0 0)' }} />
                                        ) : (
                                            <Building2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'oklch(0.145 0 0)' }} />
                                        )}
                                    </div>

                                    {/* 2. BRANCH NAME - Click to navigate */}
                                    <span
                                        className="flex-1 wrap-break-word pr-6 cursor-pointer"
                                        onClick={() => navigate(`/branches/${branch._id}`)}
                                        title="Xem chi nhánh"
                                    >
                                        {branch.name}
                                    </span>

                                    {/* 3. THREE DOTS MENU - Unchanged */}
                                    <DropdownMenu
                                        open={openBranchDropdown === branch._id}
                                        onOpenChange={(open) => setOpenBranchDropdown(open ? branch._id : null)}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <span
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    setOpenBranchDropdown(branch._id)
                                                }}
                                                className={cn(
                                                    "absolute right-2 p-0.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                                    "hover:bg-[#EAEBEE]"
                                                )}
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <circle cx="8" cy="3" r="1.5" />
                                                    <circle cx="8" cy="8" r="1.5" />
                                                    <circle cx="8" cy="13" r="1.5" />
                                                </svg>
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    setOpenBranchDropdown(null)
                                                    setSelectedBranch(branch)
                                                    setShowCreateTeamModal(true)
                                                }}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                <span>Thêm Nhóm</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    setOpenBranchDropdown(null)
                                                    setTimeout(() => {
                                                        setSelectedBranch(branch)
                                                        setShowEditModal(true)
                                                    }, 0)
                                                }}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                <span>Chỉnh Sửa</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    setOpenBranchDropdown(null)
                                                    setSelectedBranch(branch)
                                                    setShowDeleteDialog(true)
                                                }}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Xóa</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {hasTeams && (
                                    <CollapsibleContent className="[&>div]:border-none">
                                        <SidebarMenuSub className="p-0 m-0 mt-1 border-none space-y-1">
                                            {(branch.teams ?? []).map((team) => {
                                                const isTeamExpanded = expandedTeams.has(team._id)
                                                return (
                                                    <Collapsible
                                                        key={team._id}
                                                        open={isTeamExpanded}
                                                        onOpenChange={() => toggleTeam(team._id)}
                                                    >
                                                        <SidebarMenuSubItem className="p-0">
                                                            {/* TEAM ITEM - chỉnh cỡ chữ giống branch */}
                                                            <SidebarMenuSubButton
                                                                className={cn(
                                                                    "group h-auto py-1.5 px-2 pl-6 relative rounded-md w-full flex items-center gap-2",
                                                                    location.pathname === `/teams/${team._id}`
                                                                        ? "bg-[#DEDFE3]"
                                                                        : "hover:bg-[#EAEBEE]"
                                                                )}
                                                                style={{ fontFamily: 'gitbook-content-font, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji', fontSize: '16px', lineHeight: '24px', fontWeight: 360, fontStyle: 'normal', color: 'oklch(0.145 0 0)' }}
                                                                onClick={() => navigate(`/teams/${team._id}`)}
                                                            >
                                                                <Users2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'oklch(0.145 0 0)' }} />
                                                                <span className="flex-1 truncate pr-6">{team.name}</span>
                                                                <DropdownMenu
                                                                    open={openTeamDropdown === team._id}
                                                                    onOpenChange={(open) => setOpenTeamDropdown(open ? team._id : null)}
                                                                >
                                                                    <DropdownMenuTrigger asChild>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                e.preventDefault()
                                                                                setOpenTeamDropdown(team._id)
                                                                            }}
                                                                            className={cn(
                                                                                "absolute right-2 p-0.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity",
                                                                                "hover:bg-[#EAEBEE]"
                                                                            )}
                                                                        >
                                                                            <svg
                                                                                className="h-3.5 w-3.5"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <circle cx="8" cy="3" r="1.5" />
                                                                                <circle cx="8" cy="8" r="1.5" />
                                                                                <circle cx="8" cy="13" r="1.5" />
                                                                            </svg>
                                                                        </button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-48">
                                                                        <DropdownMenuItem
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation()
                                                                                e.preventDefault()
                                                                                setOpenTeamDropdown(null)
                                                                                try {
                                                                                    const fullTeam = await teamsAPI.getById(team._id)
                                                                                    setSelectedTeam(fullTeam)
                                                                                    setShowManageMembersModal(true)
                                                                                } catch (error) {
                                                                                    console.error('Error fetching team:', error)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Users className="mr-2 h-4 w-4" />
                                                                            <span>Quản Lý Thành Viên</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                e.preventDefault()
                                                                                setOpenTeamDropdown(null)
                                                                                console.log('Assign channel to team:', team._id)
                                                                            }}
                                                                        >
                                                                            <Youtube className="mr-2 h-4 w-4" />
                                                                            <span>Gán Kênh</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation()
                                                                                e.preventDefault()
                                                                                setOpenTeamDropdown(null)
                                                                                try {
                                                                                    const fullTeam = await teamsAPI.getById(team._id)
                                                                                    setSelectedTeam(fullTeam)
                                                                                    setShowEditTeamModal(true)
                                                                                } catch (error) {
                                                                                    console.error('Error fetching team:', error)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            <span>Chỉnh Sửa</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation()
                                                                                e.preventDefault()
                                                                                setOpenTeamDropdown(null)
                                                                                try {
                                                                                    const fullTeam = await teamsAPI.getById(team._id)
                                                                                    setSelectedTeam(fullTeam)
                                                                                    setShowDeleteTeamDialog(true)
                                                                                } catch (error) {
                                                                                    console.error('Error fetching team:', error)
                                                                                }
                                                                            }}
                                                                            className="text-red-600 focus:text-red-600"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            <span>Xóa</span>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    </Collapsible>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>

            {/* Modals */}
            <CreateBranchModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false)
                    fetchData()
                }}
            />

            {selectedBranch && (
                <EditBranchModal
                    open={showEditModal}
                    branch={selectedBranch}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedBranch(null)
                    }}
                    onSuccess={() => {
                        setShowEditModal(false)
                        setSelectedBranch(null)
                        fetchData()
                    }}
                />
            )}

            <CreateTeamModal
                open={showCreateTeamModal}
                branchId={selectedBranch?._id}
                onClose={() => {
                    setShowCreateTeamModal(false)
                    setSelectedBranch(null)
                }}
                onSuccess={() => {
                    setShowCreateTeamModal(false)
                    setSelectedBranch(null)
                    fetchData()
                }}
            />

            {selectedTeam && (
                <EditTeamModal
                    open={showEditTeamModal}
                    team={selectedTeam}
                    onClose={() => {
                        setShowEditTeamModal(false)
                        setSelectedTeam(null)
                    }}
                    onSuccess={() => {
                        setShowEditTeamModal(false)
                        setSelectedTeam(null)
                        fetchData()
                    }}
                />
            )}

            {selectedTeam && (
                <DeleteTeamDialog
                    open={showDeleteTeamDialog}
                    team={selectedTeam}
                    onClose={() => {
                        setShowDeleteTeamDialog(false)
                        setSelectedTeam(null)
                    }}
                    onSuccess={() => {
                        setShowDeleteTeamDialog(false)
                        setSelectedTeam(null)
                        fetchData()
                    }}
                />
            )}

            {selectedTeam && (
                <ManageMembersModal
                    open={showManageMembersModal}
                    team={selectedTeam}
                    onClose={() => {
                        setShowManageMembersModal(false)
                        setSelectedTeam(null)
                    }}
                    onSuccess={() => {
                        setShowManageMembersModal(false)
                        setSelectedTeam(null)
                        fetchData()
                    }}
                />
            )}

            {selectedTeam && (
                <AssignEditorsToTeamDialog
                    team={selectedTeam}
                    isOpen={showAssignEditorsDialog}
                    onClose={() => {
                        setShowAssignEditorsDialog(false)
                        setSelectedTeam(null)
                    }}
                    onSuccess={() => {
                        fetchData()
                        setShowAssignEditorsDialog(false)
                        setSelectedTeam(null)
                    }}
                />
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa chi nhánh</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa chi nhánh "{selectedBranch?.name}"? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarGroup>
    )
}