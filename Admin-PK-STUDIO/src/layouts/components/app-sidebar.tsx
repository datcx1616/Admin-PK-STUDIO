// src/layouts/components/app-sidebar.tsx - UNIFORM #F7F7F7 BACKGROUND
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
import { NavUser } from "@/layouts/components/nav-user"
import { Button } from "@/components/ui/button"

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

    if (['admin', 'director', 'branch_director', 'manager'].includes(role)) {
        items.push({
            title: "Quản Lý Kênh",
            url: "/channels",
            icon: IconChartBar,
        });
    }

    if (role !== 'editor') {
        items.push({
            title: "Quản Lý Nhóm",
            url: "/teams",
            icon: Users,
        });
    }

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
            setNavMain(getNavItems('guest'));
        }
    }, []);

    const userData = {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        avatar: "/avatars/shadcn.jpg",
    };

    const homeRoute = user?.role === 'editor' ? '/channels/my' : '/dashboard';

    return (
        <Sidebar
            collapsible="none"
            className="h-full flex flex-col"
            style={{ backgroundColor: '#F7F7F7' }}
            {...props}
        >
            {/* Header với user info - background #F7F7F7 */}
            <SidebarHeader className="border-b-0 p-0" style={{ backgroundColor: '#F7F7F7' }}>
                <NavUser user={userData} />
            </SidebarHeader>

            {/* Content với nav items - background #F7F7F7 */}
            <SidebarContent
                className="p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ backgroundColor: '#F7F7F7' }}
            >
                <NavMain
                    items={navMain}
                    itemClassName="hover:bg-[#EAEBEE]"
                />
                <NavBranchHierarchy />
            </SidebarContent>

            <SidebarFooter className="p-0" style={{ backgroundColor: '#F7F7F7' }}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="bg-[#F7F7F7] hover:bg-[#EAEBEE]"
                            style={{ backgroundColor: '#F7F7F7' }}
                        >
                            <Button
                                className="w-full gap-3 h-auto bg-transparent hover:bg-transparent justify-start p-0"
                                onClick={() => navigate(homeRoute)}
                            >
                                <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col items-start gap-0.5 w-full">
                                    <span className="text-gray-900 font-bold text-sm">YT Manager</span>
                                    <div className="flex items-center w-full">
                                        <span className="text-gray-500 text-sm">
                                            {user?.role === 'editor' ? 'Kênh của tôi' : 'Thống Kê'}
                                        </span>
                                        <div className="flex-1" />
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-500 text-lg bg-[#F7F7F7]">
                                                ?
                                            </span>
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-lg bg-[#F7F7F7]">
                                                <span role='img' aria-label='smile'>😊</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
