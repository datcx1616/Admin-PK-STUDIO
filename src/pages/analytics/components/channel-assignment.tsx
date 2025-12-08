// src/pages/analytics/components/channel-assignment.tsx
// FIXED VERSION - Dùng channelsAPI thay vì raw axios

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Users, CheckCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { channelsAPI } from "@/lib/channels-api"  // ✅ FIXED: Import channelsAPI
import axiosInstance from "@/lib/axios-instance"  // ✅ FIXED: Dùng axiosInstance cho users

interface Editor {
    _id: string
    name: string
    email: string
    branch?: {
        _id: string
        name: string
    }
}

interface Channel {
    _id: string
    name: string
    youtubeChannelId: string
    customUrl?: string
    thumbnailUrl?: string
    subscriberCount: number
    viewCount: number
    videoCount: number
    isConnected: boolean
    channelType?: 'Personal' | 'Brand'
    team?: {
        _id: string
        name: string
        branch?: {
            _id: string
            name: string
        }
    }
    assignedTo?: Array<{
        user: {
            _id: string
            name: string
            email: string
        }
        assignedAt: string
    }>
}

interface ChannelAssignmentProps {
    channel: Channel | null
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

export function ChannelAssignment({ channel, isOpen, onClose, onUpdate }: ChannelAssignmentProps) {
    const [editors, setEditors] = useState<Editor[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedEditors, setSelectedEditors] = useState<string[]>([])
    const [filterTeam, setFilterTeam] = useState<string>("all")

    const { toast } = useToast()

    useEffect(() => {
        if (isOpen && channel) {
            fetchEditors()
            // Set currently assigned editors
            const assigned = channel.assignedTo?.map(a => a.user._id) || []
            setSelectedEditors(assigned)
        }
    }, [isOpen, channel])

    const fetchEditors = async () => {
        setLoading(true)
        try {
            // ✅ FIXED: Dùng axiosInstance thay vì raw axios
            const response = await axiosInstance.get('/api/users?role=editor')

            // Filter editors by branch if channel has a team with branch
            let filteredEditors = response.data.data || response.data || []

            // Filter by branch (since editors belong to branches, not teams directly)
            if (channel?.team?.branch) {
                const channelBranchId = typeof channel.team.branch === 'string'
                    ? channel.team.branch
                    : channel.team.branch._id

                filteredEditors = filteredEditors.filter((editor: Editor) => {
                    if (!editor.branch) return false
                    const editorBranchId = typeof editor.branch === 'string'
                        ? editor.branch
                        : editor.branch._id
                    return editorBranchId === channelBranchId
                })
            }

            console.log('Fetched editors:', filteredEditors)
            setEditors(filteredEditors)
        } catch (error) {
            console.error('Error fetching editors:', error)
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách editor",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAssignment = async () => {
        if (!channel) return

        setSaving(true)
        try {
            // Get current assignments
            const currentAssignments = channel.assignedTo?.map(a => a.user._id) || []

            // Find editors to add and remove
            const toAdd = selectedEditors.filter(id => !currentAssignments.includes(id))
            const toRemove = currentAssignments.filter(id => !selectedEditors.includes(id))

            // ✅ FIXED: Process additions using channelsAPI
            console.log('➕ Adding editors:', toAdd)
            for (const editorId of toAdd) {
                await channelsAPI.assignEditor(channel._id, { userId: editorId })
                console.log('✅ Added editor:', editorId)
            }

            // ✅ FIXED: Process removals using channelsAPI
            console.log('➖ Removing editors:', toRemove)
            for (const editorId of toRemove) {
                await channelsAPI.removeEditor(channel._id, editorId)
                console.log('✅ Removed editor:', editorId)
            }

            console.log('🔄 Calling onUpdate to refresh channels...')

            toast({
                title: "Thành công",
                description: "Cập nhật phân công thành công",
            })

            // Refresh channels immediately
            await onUpdate()

            // Then close dialog
            onClose()
        } catch (error: any) {
            console.error('Error updating assignments:', error)

            // ✅ FIXED: Better error handling
            const errorMessage = error.response?.data?.message || error.message || "Không thể cập nhật phân công"

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
        if (filterTeam !== "all" && editor.branch?._id !== filterTeam) return false
        if (searchQuery) {
            return editor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                editor.email.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    const branches = Array.from(new Set(editors.map(e => e.branch?.name).filter(Boolean)))

    if (!channel) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Phân công Editor cho kênh</DialogTitle>
                    <DialogDescription>
                        Chọn editors để phân công quản lý kênh {channel.name}
                    </DialogDescription>
                </DialogHeader>

                {/* Channel Info */}
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                        <AvatarFallback>{channel.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">{channel.customUrl}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {channel.subscriberCount?.toLocaleString()} subscribers
                            </span>
                        </div>
                    </div>
                    {channel.channelType && (
                        <Badge variant="secondary">{channel.channelType}</Badge>
                    )}
                </div>

                {/* Search & Filter */}
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
                <ScrollArea className="h-[300px] border rounded-md">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Đang tải danh sách editors...
                        </div>
                    ) : filteredEditors.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {searchQuery ? "Không tìm thấy editor nào" : "Không có editor nào trong chi nhánh này"}
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {filteredEditors.map((editor) => {
                                const isAssigned = selectedEditors.includes(editor._id)
                                return (
                                    <div
                                        key={editor._id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            if (isAssigned) {
                                                setSelectedEditors(selectedEditors.filter(id => id !== editor._id))
                                            } else {
                                                setSelectedEditors([...selectedEditors, editor._id])
                                            }
                                        }}
                                    >
                                        <Checkbox
                                            checked={isAssigned}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedEditors([...selectedEditors, editor._id])
                                                } else {
                                                    setSelectedEditors(selectedEditors.filter(id => id !== editor._id))
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {editor.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{editor.name}</p>
                                            <p className="text-xs text-muted-foreground">{editor.email}</p>
                                            <div className="flex gap-2 mt-1">
                                                {editor.branch && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {editor.branch.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {isAssigned && (
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
                        Đã chọn {selectedEditors.length} editor để phân công cho kênh này.
                        {channel.channelType === 'Brand' && (
                            <span className="block mt-1 font-medium">
                                Lưu ý: Đây là Brand Channel, một số tính năng có thể bị hạn chế.
                            </span>
                        )}
                    </AlertDescription>
                </Alert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAssignment}
                        disabled={saving || loading}
                    >
                        {saving ? 'Đang lưu...' : 'Lưu phân công'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
