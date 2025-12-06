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

import { useNavigate, } from "react-router-dom";

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

    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        navigate("/login");
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
                                className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-200 data-[state=open]:text-gray-900 rounded-md h-8 px-2 gap-2 w-auto inline-flex group"
                            >
                                <IconUser className="h-4 w-4 text-gray-700 mr-1" />
                                <span className="text-sm text-gray-800">{displayName}</span>
                                <IconChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
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
                                <DropdownMenuItem>
                                    <IconPalette />
                                    Chủ đề
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconSwitchHorizontal />
                                    Chuyển tổ chức
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
            <div className="flex items-center gap-1">
                <button className="h-8 w-8 flex items-center justify-center rounded-md bg-transparent hover:bg-gray-100 text-gray-700" aria-label="Search">
                    <IconSearch className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-md bg-transparent hover:bg-gray-100 text-gray-700" aria-label="Notifications">
                    <IconBell className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}