"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react"

import {
    Youtube,
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

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Thống Kê",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Quản Lý Nhóm",
            url: "/tasks",
            icon: IconListDetails,
        },
        {
            title: "Quản Lý Kênh",
            url: "/channels",
            icon: IconChartBar,
        },
        {
            title: "Phân Tích",
            url: "/analytics",
            icon: IconFolder,
        },
        {
            title: "Phân Quyền",
            url: "/roles",
            icon: IconUsers,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
    documents: [
        {
            name: "Thư viện dữ liệu",
            url: "#",
            icon: IconDatabase,
        },
        {
            name: "Báo cáo",
            url: "#",
            icon: IconReport,
        },
        {
            name: "Trợ lý",
            url: "#",
            icon: IconFileWord,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const navigate = useNavigate()
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
                                onClick={() => navigate('/dashboard')} // ✅ Thêm onClick
                            >
                                <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-gray-900 font-bold text-sm">YT Manager</span>
                                    <span className="text-gray-500 text-sm">Thống Kê</span>
                                </div>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}