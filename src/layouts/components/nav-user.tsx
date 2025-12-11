"use client"

import {
    IconDotsVertical,
    IconLogout,
    IconBell,
    IconSearch,
    IconSettings,
    IconUserPlus,
    IconPalette,
    IconSwitchHorizontal,
    IconUser,
    IconChevronDown,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    // useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    // const { isMobile } = useSidebar()

    const handleLogout = () => {
        // 1. Xóa tất cả auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        // 2. Xóa thêm redirect path (nếu có)
        sessionStorage.removeItem('redirectAfterLogin');

        // 3. Force reload và redirect về login
        // Dùng window.location.href thay vì navigate để FORCE RELOAD toàn bộ app
        window.location.href = '/login';
    };

    const displayName = (user?.name || "User").split(" ")[0];

    return (
        <div className="flex items-center justify-between px-2 py-1 bg-transparent">
            <SidebarMenu className="flex-1">
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="sm"
<<<<<<< HEAD
                                className="bg-transparent hover:bg-[#EAEBEE] data-[state=open]:bg-[#DEDFE3] data-[state=open]:text-gray-900 rounded-md h-8 px-2 gap-2 w-auto inline-flex group"
=======
                                className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-200 data-[state=open]:text-gray-900 rounded-md h-8 px-2 gap-2 w-auto inline-flex group"
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                            >
                                <IconUser className="h-4 w-4 text-gray-700 mr-1" />
                                <span className="text-sm text-gray-800">{displayName}</span>
                                <IconChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
<<<<<<< HEAD

=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                        <DropdownMenuContent
                            className="min-w-56 rounded-lg"
                            align="start"
                            sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <IconSettings />
                                    Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconUserPlus />
                                    Mời đội của bạn
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <IconBell />
                                    Thông báo
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <IconLogout />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                    <button className="p-1 hover:bg-[#EAEBEE] data-[state=open]:bg-[#DEDFE3] rounded-md transition-colors">
=======
                    <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                        <IconDotsVertical className="h-4 w-4 text-gray-600" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <IconSearch className="mr-2 h-4 w-4" />
                        <span>Tìm kiếm</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconPalette className="mr-2 h-4 w-4" />
                        <span>Giao diện</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconSwitchHorizontal className="mr-2 h-4 w-4" />
                        <span>Chuyển đổi</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
