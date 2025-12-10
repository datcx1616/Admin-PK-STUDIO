"use client"
import { type Icon } from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <SidebarGroup className="px-0">
            <SidebarGroupContent className="px-0">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                onClick={() => navigate(item.url)}
                                className={[
                                    "cursor-pointer",
                                    location.pathname === item.url ? "bg-[#DEDFE3]" : "hover:bg-[#EAEBEE]",
                                ].join(" ")}
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}