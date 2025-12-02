// src/pages/examples/layout/components/NavBranchHierarchy.tsx
// VERSION 6: Hover Chevron REPLACE Icon + Navigation
import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronRight, Building2, Users2, User2, Plus, Pencil, BarChart3, Trash2, Users, Youtube } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
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
    const navigate = useNavigate()  // ✅ THÊM navigate hook
    const location = useLocation()
    const [branches, setBranches] = React.useState<BranchWithTeams[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [expandedBranches, setExpandedBranches] = React.useState<Set<string>>(new Set())
    const [expandedTeams, setExpandedTeams] = React.useState<Set<string>>(new Set())
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [showCreateTeamModal, setShowCreateTeamModal] = React.useState(false)
    const [showEditTeamModal, setShowEditTeamModal] = React.useState(false)
    const [showDeleteTeamDialog, setShowDeleteTeamDialog] = React.useState(false)
    const [showManageMembersModal, setShowManageMembersModal] = React.useState(false)
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null)
    const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null)

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

            if (finalBranches.length === 1) {
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
                <SidebarGroupLabel>Tổ chức</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="px-2 py-2 text-sm text-muted-foreground">
                            Không có dữ liệu
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
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
            <SidebarMenu>
                {branches.map((branch) => {
                    const isBranchExpanded = expandedBranches.has(branch._id)
                    const hasTeams = branch.teams && branch.teams.length > 0

                    return (
                        <Collapsible
                            key={branch._id}
                            open={isBranchExpanded}
                            onOpenChange={() => toggleBranch(branch._id)}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className={cn(
                                            "group h-auto py-1 px-2 relative hover:text-accent-foreground",
                                            location.pathname === `/branches/${branch._id}` ? "bg-[#DEDFE3]" : "hover:bg-accent"
                                        )}
                                        onClick={(e) => {
                                            // ✅ THÊM Navigation khi click vào branch
                                            if (!e.defaultPrevented) {
                                                navigate(`/branches/${branch._id}`)
                                            }
                                        }}
                                    >
                                        {/* Icon container với replacement effect */}
                                        <div className="h-3.5 w-3.5 shrink-0 relative">
                                            {/* Original icon - ẩn khi hover */}
                                            <Building2 className={cn(
                                                "h-3.5 w-3.5 absolute inset-0 transition-opacity",
                                                "group-hover:opacity-0"
                                            )} />

                                            {/* Chevron - hiện khi hover hoặc expanded */}
                                            {hasTeams && (
                                                <ChevronRight className={cn(
                                                    "h-3.5 w-3.5 absolute inset-0 transition-all",
                                                    "opacity-0 group-hover:opacity-100",
                                                    isBranchExpanded && "rotate-90 opacity-100"
                                                )} />
                                            )}
                                        </div>

                                        <span className="flex-1 wrap-break-word pr-6">{branch.name}</span>

                                        {/* More icon - hiện khi hover */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()  // ✅ THÊM preventDefault
                                                    }}
                                                    className={cn(
                                                        "absolute right-2 p-0.5 rounded hover:bg-accent",
                                                        "opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                    onClick={() => {
                                                        setSelectedBranch(branch)
                                                        setShowCreateTeamModal(true)
                                                    }}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    <span>Thêm Nhóm</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedBranch(branch)
                                                        setShowEditModal(true)
                                                    }}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Chỉnh Sửa</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => {
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
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {hasTeams && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub className="px-0 mx-0">
                                            {(branch.teams ?? []).map((team) => {
                                                const isTeamExpanded = expandedTeams.has(team._id)
                                                const hasMembers = team.members && team.members.length > 0

                                                return (
                                                    <Collapsible
                                                        key={team._id}
                                                        open={isTeamExpanded}
                                                        onOpenChange={() => toggleTeam(team._id)}
                                                    >
                                                        <SidebarMenuSubItem>
                                                            <CollapsibleTrigger asChild>
                                                                <SidebarMenuSubButton
                                                                    className={cn(
                                                                        "group relative w-full",
                                                                        !hasMembers && "cursor-default",
                                                                        location.pathname === `/teams/${team._id}` ? "bg-[#DEDFE3]" : "hover:bg-accent"
                                                                    )}
                                                                    onClick={(e) => {
                                                                        // ✅ THÊM Navigation khi click vào team
                                                                        if (!e.defaultPrevented) {
                                                                            navigate(`/teams/${team._id}`)
                                                                        }
                                                                    }}
                                                                >
                                                                    {hasMembers ? (
                                                                        // Team CÓ members - có hover effect
                                                                        <div className="h-3.5 w-3.5 shrink-0 relative">
                                                                            {/* Original icon - ẩn khi hover */}
                                                                            <Users2 className={cn(
                                                                                "h-3.5 w-3.5 absolute inset-0 transition-opacity",
                                                                                "group-hover:opacity-0"
                                                                            )} />

                                                                            {/* Chevron - hiện khi hover hoặc expanded */}
                                                                            <ChevronRight className={cn(
                                                                                "h-3.5 w-3.5 absolute inset-0 transition-all",
                                                                                "opacity-0 group-hover:opacity-100",
                                                                                isTeamExpanded && "rotate-90 opacity-100"
                                                                            )} />
                                                                        </div>
                                                                    ) : (
                                                                        // Team KHÔNG có members - giữ nguyên icon, không hover effect
                                                                        <Users2 className="h-3.5 w-3.5 shrink-0" />
                                                                    )}

                                                                    <span className="flex-1 truncate pr-6">{team.name}</span>

                                                                    {/* More icon - hiện khi hover */}
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <span
                                                                                role="button"
                                                                                tabIndex={0}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    e.preventDefault()  // ✅ THÊM preventDefault
                                                                                }}
                                                                                className={cn(
                                                                                    "absolute right-2 p-0.5 rounded hover:bg-accent",
                                                                                    "opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                                                onClick={async () => {
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
                                                                                onClick={async () => {
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
                                                                                onClick={async () => {
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
                                                            </CollapsibleTrigger>

                                                            {hasMembers && (
                                                                <CollapsibleContent>
                                                                    <SidebarMenuSub className="px-0 mx-0">
                                                                        {(team.members ?? []).map((member) => (
                                                                            <SidebarMenuSubItem key={member._id}>
                                                                                <SidebarMenuSubButton
                                                                                    className="pl-8 group relative w-full"
                                                                                >
                                                                                    {/* Icon container với transition */}
                                                                                    <div className="h-3.5 w-3.5 shrink-0 relative">
                                                                                        {/* Original icon - ẩn khi hover */}
                                                                                        <User2 className={cn(
                                                                                            "h-3.5 w-3.5 absolute inset-0 transition-opacity",
                                                                                            "group-hover:opacity-0"
                                                                                        )} />

                                                                                        {/* Chevron - hiện khi hover */}
                                                                                        <ChevronRight className={cn(
                                                                                            "h-3.5 w-3.5 absolute inset-0 transition-opacity",
                                                                                            "opacity-0 group-hover:opacity-100"
                                                                                        )} />
                                                                                    </div>

                                                                                    <span className="truncate text-xs pr-6">
                                                                                        {member.name}
                                                                                    </span>

                                                                                    {/* More icon - hiện khi hover */}
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <span
                                                                                                role="button"
                                                                                                tabIndex={0}
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation()
                                                                                                    e.preventDefault()  // ✅ THÊM preventDefault
                                                                                                }}
                                                                                                className={cn(
                                                                                                    "absolute right-2 p-0.5 rounded hover:bg-accent",
                                                                                                    "opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                                                                onClick={() => {
                                                                                                    console.log('Assign channel to member:', member._id)
                                                                                                }}
                                                                                            >
                                                                                                <Youtube className="mr-2 h-4 w-4" />
                                                                                                <span>Gán Kênh</span>
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuSeparator />
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => {
                                                                                                    console.log('Delete member:', member._id)
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
                                                                        ))}
                                                                    </SidebarMenuSub>
                                                                </CollapsibleContent>
                                                            )}
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
                        <AlertDialogCancel onClick={() => setSelectedBranch(null)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarGroup>
    )
}
