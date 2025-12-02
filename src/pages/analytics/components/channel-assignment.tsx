import React, { useState, useEffect } from "react"
import axios from "@/lib/axios-instance"
import {
    Users,
    UserPlus,
    UserMinus,
    Search,
    Calendar,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Editor {
    _id: string
    name: string
    email: string
    role: string
    team?: {
        _id: string
        name: string
    }
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
            // Fetch editors in the same branch as the channel
            const response = await axios.get('/api/users?role=editor')

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

            // Process additions
            console.log('➕ Adding editors:', toAdd)
            for (const editorId of toAdd) {
                const response = await axios.post(
                    `/api/channels/${channel._id}/assign`,
                    { userId: editorId, role: 'editor' }
                )
                console.log('✅ Added editor response:', response.data)
            }

            // Process removals
            console.log('➖ Removing editors:', toRemove)
            for (const editorId of toRemove) {
                await axios.delete(
                    `/api/channels/${channel._id}/members/${editorId}`
                )
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
        } catch (error) {
            console.error('Error updating assignments:', error)
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật phân công",
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
                        <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {channel.subscriberCount.toLocaleString()} subscribers
                            </Badge>
                            {channel.team && (
                                <Badge variant="outline" className="text-xs">
                                    {channel.team.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current Assignments */}
                {channel.assignedTo && channel.assignedTo.length > 0 && (
                    <div>
                        <Label className="text-sm font-medium mb-2">Đang được phân công cho:</Label>
                        <div className="space-y-2">
                            {channel.assignedTo.map((assignment) => (
                                <div key={assignment.user._id} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {assignment.user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{assignment.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{assignment.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3 inline mr-1" />
                                        {new Date(assignment.assignedAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4" />
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm editor theo tên hoặc email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Select value={filterTeam} onValueChange={setFilterTeam}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Lọc theo chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                            {branches.map(branch => (
                                <SelectItem key={branch} value={branch || 'no-branch'}>
                                    {branch || 'Chưa có chi nhánh'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Editor List */}
                <ScrollArea className="h-64 pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-muted-foreground">Đang tải...</p>
                        </div>
                    ) : filteredEditors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Users className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">Không tìm thấy editor nào</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredEditors.map((editor) => {
                                const isAssigned = selectedEditors.includes(editor._id)

                                return (
                                    <div
                                        key={editor._id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isAssigned ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
                                            }`}
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
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAssignment}
                        disabled={saving}
                    >
                        {saving ? 'Đang lưu...' : 'Lưu phân công'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
