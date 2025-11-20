import React from "react";
import { SectionCards } from "@/pages/examples/dashboard/components/section-cards";
import { ChartAreaInteractive } from "@/pages/examples/dashboard/components/chart-area-interactive";
import { DataTable } from "@/pages/examples/dashboard/components/data-table";

interface ManagerViewProps {
    data: any;
}

export function ManagerView({ data }: ManagerViewProps) {
    const tableData = mapDataToTable(data);

    // Compute stats for Manager
    const stats = {
        totalBranches: 1,
        totalTeams: 1,
        totalChannels: data?.channels?.length || 0,
        totalUsers: data?.team?.members?.length || 0,
        totalViews: (data?.channels || []).reduce((acc: number, curr: any) => acc + (curr.viewCount || 0), 0)
    };

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={stats} />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={tableData} />
        </div>
    );
}

function mapDataToTable(data: any): any[] {
    const items = data?.channels || [];

    return items.map((item: any, index: number) => {
        return {
            id: index + 1,
            header: item.name || "Unknown",
            type: "Channel",
            status: item.isActive !== false ? "Active" : "Inactive",
            target: (item.subscriberCount || 0).toString(),
            limit: (item.viewCount || 0).toString(),
            reviewer: "Unassigned",
        };
    });
}
