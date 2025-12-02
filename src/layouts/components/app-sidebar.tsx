"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    IconChartBar,
    IconDashboard,
    IconListDetails,
    IconUsers,
    IconMovie,
    IconVideoPlus,
} from "@tabler/icons-react"

import {
    Youtube,
    Users,
    Search,
    Bell,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavBranchHierarchy } from "@/layouts/components/NavBranchHierarchy"
import { NavMain } from "@/layouts/components/nav-main"
// import { NavSecondary } from "@/layouts/components/nav-secondary"
import { NavUser } from "@/layouts/components/nav-user"
import { Button } from "@/components/ui/button"

// Helper to get user from storage
const getUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

const getNavItems = (role: string) => {
    const items = [];

    // Dashboard Overview
    if (role !== 'editor') {
        items.push({
            title: "Tổng Quan",
            url: "/dashboard/overview",
            icon: IconDashboard,
        });
    }

    if (['admin', 'director', 'branch_director'].includes(role)) {
        items.push({
            title: "Quản Lý Chi Nhánh",
            url: "/brand",
            icon: IconListDetails,
        });
    } else if (role === 'manager') {
        items.push({
            title: "Chi Nhánh Của Tôi",
            url: "/brand",
            icon: IconListDetails,
        });
    }

    // Channel management for non-editors
    if (['admin', 'director', 'branch_director', 'manager'].includes(role)) {
        items.push({
            title: "Quản Lý Kênh",
            url: "/channels",
            icon: IconChartBar,
        });
    }

    // Teams management for non-editors
    if (role !== 'editor') {
        items.push({
            title: "Quản Lý Nhóm",
            url: "/teams",
            icon: Users,
        });
    }

    // Editor specific items
    if (role === 'editor') {
        items.push({
            title: "Kênh Của Tôi",
            url: "/channels/my",
            icon: IconMovie,
        });
        items.push({
            title: "Tạo Video Mới",
            url: "/videos/create",
            icon: IconVideoPlus,
        });
    }

    // Analytics for everyone
    items.push({
        title: "Phân Tích",
        url: "/analytics",
        icon: IconChartBar,
    });

    if (['admin', 'director'].includes(role)) {
        items.push({
            title: "Phân Quyền",
            url: "/roles",
            icon: IconUsers,
        });
    }

    return items;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>(getUser());
    const [navMain, setNavMain] = React.useState<any[]>([]);

    React.useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
        if (currentUser && currentUser.role) {
            setNavMain(getNavItems(currentUser.role));
        } else {
            // Default fallback
            setNavMain(getNavItems('guest'));
        }
    }, []);

    // const navSecondary = [
    //     { title: "Cài đặt", url: "#", icon: IconSettings },
    //     { title: "Trợ giúp", url: "#", icon: IconHelp },
    //     { title: "Tìm kiếm", url: "#", icon: IconSearch },
    // ];

    const userData = {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        avatar: "/avatars/shadcn.jpg", // Placeholder
    };

    const homeRoute = user?.role === 'editor' ? '/channels/my' : '/dashboard';

    return (
        <Sidebar collapsible="none" className="h-full flex flex-col" style={{ backgroundColor: '#F7F7F7' }} {...props}>
            <SidebarHeader className="border-b-0 p-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="bg-white hover:bg-gray-50"
                        >
                            <Button
                                className="w-full gap-3 h-auto bg-transparent hover:bg-transparent justify-start p-0"
                                onClick={() => navigate(homeRoute)}
                            >
                                <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-gray-900 font-bold text-sm">YT Manager</span>
                                    <span className="text-gray-500 text-sm">
                                        {user?.role === 'editor' ? 'Kênh của tôi' : 'Thống Kê'}
                                    </span>
                                </div>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Home section with icons */}
                <div className="flex items-center justify-between px-2 py-2" style={{ backgroundColor: '#F7F7F7' }}>
                    <span className="text-sm font-medium text-gray-700">Home</span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent"
                        >
                            <Search className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent"
                        >
                            <Bell className="h-4 w-4 text-gray-600" />
                        </Button>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <NavMain items={navMain} />
                {/* THAY ĐỔI: Thay NavDocuments bằng NavBranchHierarchy */}
                <NavBranchHierarchy />
                {/* <NavSecondary items={navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter className="p-0">
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    )
}
