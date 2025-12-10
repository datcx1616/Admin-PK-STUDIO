import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Share2, GitBranch, Scissors, FileText, Clock, MessageSquare, Globe, Copy, Layers, Pencil, Trash2 } from "lucide-react";

export function DropdownMenuAdvanced() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative rounded w-8 h-7 p-0 flex items-center justify-center pb-3">
                    <span className="text-2xl">...</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Kết nối Git
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Scissors className="w-4 h-4 mr-2" />
                    Quy tắc gộp nhánh
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Xuất PDF <span className="ml-auto text-xs text-pink-500 font-semibold">Nâng cấp</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Clock className="w-4 h-4 mr-2" />
                    Lịch sử phiên bản
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Bình luận
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Globe className="w-4 h-4 mr-2" />
                    Ngôn ngữ
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Layers className="w-4 h-4 mr-2" />
                    Di chuyển không gian...
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Layers className="w-4 h-4 mr-2" />
                    Nhân bản
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Pencil className="w-4 h-4 mr-2" />
                    Đổi tên
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
