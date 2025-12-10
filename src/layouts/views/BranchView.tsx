
import { SectionCards } from "@/layouts/components/section-cards";
import { ChartAreaInteractive } from "@/layouts/components/chart-area-interactive";
import { DataTable } from "@/layouts/components/data-table";

interface BranchViewProps {
    data: any;
}

export function BranchView({ data }: BranchViewProps) {
    const tableData = mapDataToTable(data);
    // Use data.stats if available (normalized), otherwise fall back to data.branch?.stats
    const stats = data?.stats || data?.branch?.stats || {};

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
    const items = data?.branch?.teams || [];

    return items.map((item: any, index: number) => {
        return {
            id: index + 1,
            header: item.name || "Unknown",
            type: "Team",
            status: item.isActive !== false ? "Active" : "Inactive",
            target: (item.totalChannels || item.channels?.length || 0).toString(),
            limit: "0",
            reviewer: item.leader?.name || "Unassigned",
        };
    });
}
