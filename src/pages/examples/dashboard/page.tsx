import React, { useEffect, useState } from "react"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ChartAreaInteractive } from "@/pages/examples/dashboard/components/chart-area-interactive"
import { DataTable } from "@/pages/examples/dashboard/components/data-table"
import { SectionCards } from "@/pages/examples/dashboard/components/section-cards"
import { SiteHeader } from "@/pages/examples/dashboard/components/site-header"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export default function Page() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await apiClient.getDashboardOverview();
                setData(dashboardData);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

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
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards stats={data?.stats} />
                                <div className="px-4 lg:px-6">
                                    <ChartAreaInteractive />
                                </div>
                                <DataTable data={mapDataToTable(data)} />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

function mapDataToTable(data: any): any[] {
    if (!data) return [];

    const items = data.branches || data.teams || data.channels || [];

    return items.map((item: any, index: number) => {
        const stats = item.stats || {};
        return {
            id: index + 1,
            header: item.name || "Unknown",
            type: data.branches ? "Branch" : data.teams ? "Team" : "Channel",
            status: item.isActive ? "Done" : "In Progress",
            target: (stats.channels || item.subscriberCount || 0).toString(),
            limit: (stats.teams || item.viewCount || 0).toString(),
            reviewer: item.director?.name || item.leader?.name || "Unassigned",
        };
    });
}