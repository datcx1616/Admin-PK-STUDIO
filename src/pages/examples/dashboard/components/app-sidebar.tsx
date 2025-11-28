"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
    IconMovie,
    IconVideoPlus,
} from "@tabler/icons-react"

import {
    Youtube,
    Users,
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
import { NavDocuments } from "@/pages/examples/dashboard/components/nav-documents"
import { NavMain } from "@/pages/examples/dashboard/components/nav-main"
import { NavSecondary } from "@/pages/examples/dashboard/components/nav-secondary"
import { NavUser } from "@/pages/examples/dashboard/components/nav-user"
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

    // Dashboard link for everyone except Editor
    // if (role !== 'editor') {
    //     items.push({
    //         title: "Thống Kê",
    //         url: "/dashboard",
    //         icon: IconDashboard,
    //     });
    // }

    // 👇 THÊM MỚI: Dashboard Overview
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
            url: "/tasks",
            icon: IconListDetails,
        });
    } else if (role === 'manager') {
        items.push({
            title: "Chi Nhánh Của Tôi",
            url: "/tasks",
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
        icon: IconFolder,
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

    const navSecondary = [
        { title: "Cài đặt", url: "#", icon: IconSettings },
        { title: "Trợ giúp", url: "#", icon: IconHelp },
        { title: "Tìm kiếm", url: "#", icon: IconSearch },
    ];

    const documents = [
        { name: "Thư viện dữ liệu", url: "#", icon: IconDatabase },
        { name: "Báo cáo", url: "#", icon: IconReport },
        { name: "Trợ lý", url: "#", icon: IconFileWord },
    ];

    const userData = {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        avatar: "/avatars/shadcn.jpg", // Placeholder
    };

    const homeRoute = user?.role === 'editor' ? '/channels/my' : '/dashboard';

    return (
        <Sidebar collapsible="none" className="h-screen border-r flex flex-col" {...props}>
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="bg-white hover:bg-gray-50"
                        >
                            <Button
                                className="w-full gap-3 h-auto bg-transparent hover:bg-transparent justify-start px-4 py-3"
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
            </SidebarHeader>
            <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <NavMain items={navMain} />
                <NavDocuments items={documents} />
                <NavSecondary items={navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    )
}