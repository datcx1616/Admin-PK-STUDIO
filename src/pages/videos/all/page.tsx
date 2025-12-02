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
import { Eye, MoreHorizontal, Filter } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

// Mock data for all videos
const allVideos = [
    {
        id: "VID001",
        title: "Hướng dẫn sử dụng React Hooks",
        author: "Nguyễn Văn A",
        views: 1205,
        status: "public",
        createdAt: "2023-10-25",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhY3R8ZW58MHx8MHx8fDA%3D",
    },
    {
        id: "VID005",
        title: "Làm quen với Next.js 14",
        author: "Trần Thị B",
        views: 5600,
        status: "public",
        createdAt: "2023-11-10",
        thumbnail: "https://images.unsplash.com/photo-1649180556628-9ba704115795?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmV4dGpzfGVufDB8fDB8fHww",
    },
    {
        id: "VID002",
        title: "Review sản phẩm công nghệ mới",
        author: "Nguyễn Văn A",
        views: 850,
        status: "private",
        createdAt: "2023-10-28",
        thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: "VID006",
        title: "Thủ thuật Photoshop cơ bản",
        author: "Lê Văn C",
        views: 2100,
        status: "public",
        createdAt: "2023-11-12",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: "VID003",
        title: "Vlog du lịch Đà Lạt",
        author: "Nguyễn Văn A",
        views: 3400,
        status: "public",
        createdAt: "2023-11-01",
        thumbnail: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsfGVufDB8fDB8fHww",
    },
]

export default function AllVideosPage() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tất Cả Videos</h1>
                    <p className="text-muted-foreground">
                        Quản lý toàn bộ video trên hệ thống.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input placeholder="Tìm kiếm video..." className="w-[250px]" />
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableCaption>Danh sách tất cả video.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Thumbnail</TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Lượt xem</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allVideos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell>
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-16 h-9 object-cover rounded-md"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{video.title}</TableCell>
                                <TableCell>{video.author}</TableCell>
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
                                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
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
