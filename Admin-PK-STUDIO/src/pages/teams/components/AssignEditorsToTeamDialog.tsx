// src/pages/teams/components/AssignEditorsToTeamDialog.tsx
// Component để phân công editors cho team

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Users, CheckCircle, Info, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { teamsAPI } from "@/lib/teams-api"
import axiosInstance from "@/lib/axios-instance"
import type { Team } from "@/types/teams.types"

interface Editor {
    _id: string
    name: string
    email: string
    role: string
    branch?: {
        _id: string
        name: string
    }
}

interface AssignEditorsToTeamDialogProps {
    team: Team | null
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function AssignEditorsToTeamDialog({
    team,
    isOpen,
    onClose,
    onSuccess
}: AssignEditorsToTeamDialogProps) {
    const [editors, setEditors] = useState<Editor[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedEditors, setSelectedEditors] = useState<string[]>([])

    const { toast } = useToast()

    useEffect(() => {
        if (isOpen && team) {
            fetchEditors()
            // Set currently assigned editors (team members)
            const currentMemberIds = team.members?.map(m => m._id) || []
            setSelectedEditors(currentMemberIds)
        }
    }, [isOpen, team])

    const fetchEditors = async () => {
        if (!team) return

        setLoading(true)
        try {
            // Fetch all editors in the same branch as the team
            const response = await axiosInstance.get('/api/users?role=editor')
            let allEditors = response.data.data || response.data || []

            // Filter editors by branch
            const teamBranchId = typeof team.branch === 'string'
                ? team.branch
                : team.branch._id

            const filteredEditors = allEditors.filter((editor: Editor) => {
                if (!editor.branch) return false
                const editorBranchId = typeof editor.branch === 'string'
                    ? editor.branch
                    : editor.branch._id
                return editorBranchId === teamBranchId
            })

            console.log('✅ Fetched editors for team:', filteredEditors.length)
            setEditors(filteredEditors)
        } catch (error) {
            console.error('❌ Error fetching editors:', error)
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách editor",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!team) return

        setSaving(true)
        try {
            // Get current members
            const currentMemberIds = team.members?.map(m => m._id) || []

            // Find editors to add and remove
            const toAdd = selectedEditors.filter(id => !currentMemberIds.includes(id))
            const toRemove = currentMemberIds.filter(id => !selectedEditors.includes(id))

            console.log('➕ Adding editors to team:', toAdd)
            console.log('➖ Removing editors from team:', toRemove)

            // Add new members
            for (const editorId of toAdd) {
                await teamsAPI.addMember(team._id, editorId)
                console.log('✅ Added editor:', editorId)
            }

            // Remove members
            for (const editorId of toRemove) {
                await teamsAPI.removeMember(team._id, editorId)
                console.log('✅ Removed editor:', editorId)
            }

            toast({
                title: "Thành công",
                description: `Đã cập nhật ${toAdd.length + toRemove.length} thay đổi`,
            })

            // Call success callback
            onSuccess?.()

            // Close dialog
            onClose()
        } catch (error: any) {
            console.error('❌ Error updating team members:', error)

            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Không thể cập nhật phân công"

            toast({
                title: "Lỗi",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const filteredEditors = editors.filter(editor => {
        if (!searchQuery) return true
        return (
            editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            editor.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    if (!team) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle>Phân công Editor cho Team</DialogTitle>
                    <DialogDescription>
                        Chọn editors để phân công vào team {team.name}
                    </DialogDescription>
                </DialogHeader>

                {/* Team Info */}
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span>
                                Chi nhánh: {typeof team.branch === 'string' ? team.branch : team.branch?.name}
                            </span>
                            {team.leader && (
                                <span>
                                    · Trưởng nhóm: {team.leader.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <Badge variant="secondary">
                        {team.members?.length || 0} thành viên
                    </Badge>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm editor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Editors List */}
                <ScrollArea className="h-[350px] border rounded-md">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Đang tải danh sách editors...
                            </p>
                        </div>
                    ) : filteredEditors.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            {searchQuery
                                ? "Không tìm thấy editor nào"
                                : "Không có editor nào trong chi nhánh này"}
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {filteredEditors.map((editor) => {
                                const isSelected = selectedEditors.includes(editor._id)
                                return (
                                    <div
                                        key={editor._id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedEditors(selectedEditors.filter(id => id !== editor._id))
                                            } else {
                                                setSelectedEditors([...selectedEditors, editor._id])
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedEditors([...selectedEditors, editor._id])
                                                } else {
                                                    setSelectedEditors(selectedEditors.filter(id => id !== editor._id))
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-blue-100 text-blue-700">
                                                {editor.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{editor.name}</p>
                                            <p className="text-xs text-muted-foreground">{editor.email}</p>
                                            {editor.branch && (
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {editor.branch.name}
                                                </Badge>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <CheckCircle className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* Summary */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Đã chọn <strong>{selectedEditors.length}</strong> editor để phân công cho team này.
                        {selectedEditors.length > 0 && (
                            <span className="block mt-1 text-xs">
                                Các editor này sẽ có thể làm việc trên các kênh của team.
                            </span>
                        )}
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu phân công'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
