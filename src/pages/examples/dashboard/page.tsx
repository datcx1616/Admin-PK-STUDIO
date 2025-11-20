import React, { useEffect, useState } from "react"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/pages/examples/dashboard/components/site-header"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { AdminView } from "@/pages/examples/dashboard/views/AdminView"
import { BranchView } from "@/pages/examples/dashboard/views/BranchView"
import { ManagerView } from "@/pages/examples/dashboard/views/ManagerView"
import { EditorView } from "@/pages/examples/dashboard/views/EditorView"

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

    const role = data?.user?.role;
    console.log("Dashboard Page - Role form API:", role);
    console.log("Dashboard Page - Data:", data);

    const renderView = () => {
        switch (role) {
            case 'admin':
            case 'director':
                return <AdminView data={data} />;
            case 'branch_director':
                return <BranchView data={data} />;
            case 'manager':
                return <ManagerView data={data} />;
            case 'editor':
                return <EditorView data={data} />;
            default:
                return (
                    <div className="p-4">
                        <h1 className="text-xl font-bold text-red-600">Role Error</h1>
                        <p>Detected role: {role || "None"}</p>
                        <p>Please contact administrator.</p>
                    </div>
                );
        }
    };

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
                            {renderView()}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}