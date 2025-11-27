import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import {
    IconPlus,
    IconSearch,
    IconRefresh,
    IconDots,
    IconEdit,
    IconSend,
    IconTrash,
    IconEye,
    IconClock,
    IconCheck,
    IconX,
    IconMovie,
    IconSortDescending
} from "@tabler/icons-react"
// import { formatDistanceToNow } from "date-fns"
// import { vi } from "date-fns/locale"

interface Video {
    _id: string
    title: string
    description?: string
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'UPLOADING'
    thumbnail?: string
    duration?: number
    fileSize?: number
    channel?: {
        _id: string
        snippet?: {
            title: string
            thumbnails?: {
                default?: {
                    url: string
                }
            }
        }
    }
    rejectionReason?: string
    createdAt: string
    updatedAt: string
    youtubeVideoId?: string
}

const statusConfig = {
    DRAFT: {
        label: 'Nháp',
        color: 'bg-gray-100 text-gray-700',
        icon: IconEdit
    },
    PENDING: {
        label: 'Chờ duyệt',
        color: 'bg-yellow-100 text-yellow-700',
        icon: IconClock
    },
    APPROVED: {
        label: 'Đã duyệt',
        color: 'bg-green-100 text-green-700',
        icon: IconCheck
    },
    REJECTED: {
        label: 'Từ chối',
        color: 'bg-red-100 text-red-700',
        icon: IconX
    },
    UPLOADING: {
        label: 'Đang tải lên',
        color: 'bg-blue-100 text-blue-700',
        icon: IconClock
    },
    PUBLISHED: {
        label: 'Đã xuất bản',
        color: 'bg-blue-100 text-blue-700',
        icon: IconCheck
    }
}

export default function MyVideosPage() {
    const navigate = useNavigate()
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('createdAt-desc')

    useEffect(() => {
        fetchVideos()
    }, [statusFilter, sortBy])

    const fetchVideos = async () => {
        setLoading(true)
        try {
            const params = {
                status: statusFilter === 'all' ? undefined : statusFilter,
                search: searchQuery || undefined,
                sortBy: sortBy.split('-')[0],
                order: sortBy.split('-')[1]
            }

            const response = await apiClient.getMyVideos(params)
            setVideos(response.videos || [])
        } catch (error) {
            console.error("Failed to fetch videos", error)
            toast.error("Không thể tải danh sách video")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitForReview = async (videoId: string) => {
        try {
            await apiClient.submitVideoForReview(videoId)
            toast.success("Video đã được gửi để duyệt")
            fetchVideos()
        } catch (error) {
            toast.error("Không thể gửi video để duyệt")
        }
    }

    const handleDeleteVideo = async (videoId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) return

        try {
            await apiClient.deleteVideo(videoId)
            toast.success("Video đã được xóa")
            fetchVideos()
        } catch (error) {
            toast.error("Không thể xóa video")
        }
    }

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = Math.floor(seconds % 60)

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '0 MB'
        return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    }

    const getStatusCounts = () => {
        const counts = {
            all: videos.length,
            DRAFT: 0,
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            PUBLISHED: 0
        }

        videos.forEach(video => {
            if (video.status in counts) {
                counts[video.status as keyof typeof counts]++
            }
        })

        return counts
    }

    const statusCounts = getStatusCounts()

    const filteredVideos = videos.filter(video => {
        if (searchQuery) {
            return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description?.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Video của tôi</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý và theo dõi trạng thái video của bạn
                    </p>
                </div>
                <Button onClick={() => navigate("/videos/create")}>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tải video mới
                </Button>
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="all">
                        Tất cả ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="DRAFT">
                        Nháp ({statusCounts.DRAFT})
                    </TabsTrigger>
                    <TabsTrigger value="PENDING">
                        Chờ duyệt ({statusCounts.PENDING})
                    </TabsTrigger>
                    <TabsTrigger value="APPROVED">
                        Đã duyệt ({statusCounts.APPROVED})
                    </TabsTrigger>
                    <TabsTrigger value="PUBLISHED">
                        Đã xuất bản ({statusCounts.PUBLISHED})
                    </TabsTrigger>
                    <TabsTrigger value="REJECTED">
                        Từ chối ({statusCounts.REJECTED})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm video..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchVideos()}
                        className="pl-9"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <IconSortDescending className="mr-2 h-4 w-4" />
                            Sắp xếp
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy('createdAt-desc')}>
                            Mới nhất
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('createdAt-asc')}>
                            Cũ nhất
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('title-asc')}>
                            Tiêu đề A-Z
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('title-desc')}>
                            Tiêu đề Z-A
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    onClick={fetchVideos}
                    disabled={loading}
                >
                    <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredVideos.length === 0 ? (
                <Card className="py-12">
                    <CardContent className="text-center">
                        <IconMovie className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? 'Không tìm thấy video nào' : 'Bạn chưa có video nào'}
                        </p>
                        <Button onClick={() => navigate("/videos/create")}>
                            <IconPlus className="mr-2 h-4 w-4" />
                            Tải video đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                        <Card key={video._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-video bg-muted">
                                {video.thumbnail ? (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <IconMovie className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}

                                {video.duration && (
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                                        {formatDuration(video.duration)}
                                    </span>
                                )}

                                <div className="absolute top-2 left-2">
                                    <Badge className={statusConfig[video.status].color}>
                                        {statusConfig[video.status].label}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base line-clamp-2 flex-1">
                                        {video.title}
                                    </CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <IconDots className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => navigate(`/videos/${video._id}`)}
                                            >
                                                <IconEye className="mr-2 h-4 w-4" />
                                                Xem chi tiết
                                            </DropdownMenuItem>

                                            {(video.status === 'DRAFT' || video.status === 'REJECTED') && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/videos/${video._id}/edit`)}
                                                    >
                                                        <IconEdit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleSubmitForReview(video._id)}
                                                    >
                                                        <IconSend className="mr-2 h-4 w-4" />
                                                        Gửi duyệt
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                            {video.status === 'DRAFT' && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteVideo(video._id)}
                                                        className="text-red-600"
                                                    >
                                                        <IconTrash className="mr-2 h-4 w-4" />
                                                        Xóa video
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                            {video.youtubeVideoId && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={`https://youtube.com/watch?v=${video.youtubeVideoId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <IconEye className="mr-2 h-4 w-4" />
                                                            Xem trên YouTube
                                                        </a>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-3">
                                {video.channel && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {video.channel.snippet?.title}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>
                                        {/* {formatDistanceToNow(new Date(video.createdAt), {
                                            addSuffix: true,
                                            locale: vi
                                        })} */}
                                    </span>
                                    {video.fileSize && (
                                        <span>{formatFileSize(video.fileSize)}</span>
                                    )}
                                </div>
                                {video.status === 'REJECTED' && video.rejectionReason && (
                                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                                        <strong className="text-red-700 dark:text-red-400">Lý do từ chối:</strong>
                                        <p className="text-red-600 dark:text-red-300 mt-0.5">
                                            {video.rejectionReason}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
