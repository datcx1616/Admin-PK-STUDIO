"use client"


import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for now
const videos = [
    {
        id: "VID001",
        title: "Hướng dẫn sử dụng React Hooks",
        views: 1205,
        status: "public",
        createdAt: "2023-10-25",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhY3R8ZW58MHx8MHx8fDA%3D",
    },
    {
        id: "VID002",
        title: "Review sản phẩm công nghệ mới",
        views: 850,
        status: "private",
        createdAt: "2023-10-28",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: "VID003",
        title: "Vlog du lịch Đà Lạt",
        views: 3400,
        status: "public",
        createdAt: "2023-11-01",
        thumbnail: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsfGVufDB8fDB8fHww",
    },
    {
        id: "VID004",
        title: "Học lập trình web cơ bản",
        views: 150,
        status: "unlisted",
        createdAt: "2023-11-05",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nfGVufDB8fDB8fHww",
    },
]

export default function MyVideosPage() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Video Của Tôi</h1>
                    <p className="text-muted-foreground">
                        Danh sách các video bạn đã tải lên.
                    </p>
                </div>
                <Button>Tải lên video mới</Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableCaption>Danh sách video của bạn.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Thumbnail</TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Lượt xem</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell>
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-16 h-9 object-cover rounded-md"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{video.title}</TableCell>
                                <TableCell>
                                    <Badge variant={video.status === 'public' ? 'default' : 'secondary'}>
                                        {video.status === 'public' ? 'Công khai' : video.status === 'private' ? 'Riêng tư' : 'Không công khai'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{video.views.toLocaleString()}</TableCell>
                                <TableCell>{video.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" /> Sửa video
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Xóa video
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
