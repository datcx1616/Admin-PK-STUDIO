// src/pages/HomePage.tsx
import * as React from "react"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { Home } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/layouts/components/app-sidebar"
// RightSidebar not used on Home page


export default function HomePage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                {/* Header with breadcrumb */}
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", icon: <Home className="h-4 w-4" /> },
                    ]}
                />

                {/* Title Box - White background with border */}
                <div className="bg-background border-b px-6 py-6">
                    <h1 className="text-2xl font-normal">Developer Platform</h1>
                </div>

                {/* Content Area - Empty for now */}
                <div className="flex-1 overflow-auto bg-background">
                    {/* Content will go here */}
                </div>
            </SidebarInset>
            {/* Home page has no headings; omit TOC sidebar */}
        </SidebarProvider>
    )
}
