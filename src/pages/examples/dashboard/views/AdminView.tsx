
import { SectionCards } from "@/pages/examples/dashboard/components/section-cards";
import { ChartAreaInteractive } from "@/pages/examples/dashboard/components/chart-area-interactive";
import { DataTable } from "@/pages/examples/dashboard/components/data-table";

interface AdminViewProps {
    data: any;
}

export function AdminView({ data }: AdminViewProps) {
    const tableData = mapDataToTable(data);

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={data?.stats} />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={tableData} />
        </div>
    );
}

function mapDataToTable(data: any): any[] {
    if (!data || !data.branches) return [];

    return data.branches.map((item: any, index: number) => {
        const stats = item.stats || {};
        return {
            id: index + 1,
            header: item.name || "Unknown",
            type: "Branch",
            status: item.isActive !== false ? "Active" : "Inactive",
            target: (stats.channels || 0).toString(),
            limit: (stats.teams || 0).toString(),
            reviewer: item.director?.name || "Unassigned",
        };
    });
}
