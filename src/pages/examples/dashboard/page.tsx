import React from "react"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
// import { AppSidebar } from "@/pages/examples/dashboard/components/app-sidebar"
import { ChartAreaInteractive } from "@/pages/examples/dashboard/components/chart-area-interactive"
import { DataTable } from "@/pages/examples/dashboard/components/data-table"
import { SectionCards } from "@/pages/examples/dashboard/components/section-cards"
import { SiteHeader } from "@/pages/examples/dashboard/components/site-header"

import data from "./data.json"

export default function Page() {
    return (
        <>
            <div className="md:hidden">
                <img
                    src="/examples/dashboard-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <img
                    src="/examples/dashboard-dark.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>
            <SidebarProvider
                className="hidden md:flex"
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 64)",
                        "--header-height": "calc(var(--spacing) * 12 + 1px)",
                    } as React.CSSProperties
                }
            >
                {/* <AppSidebar variant="sidebar" /> */}
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards />
                                <div className="px-4 lg:px-6">
                                    <ChartAreaInteractive />
                                </div>
                                <DataTable data={data} />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}