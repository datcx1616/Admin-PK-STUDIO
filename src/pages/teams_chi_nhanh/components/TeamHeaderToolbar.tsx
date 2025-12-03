import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar, Download, Printer, RefreshCw, Users, Dot, Building2 } from "lucide-react"

interface Leader {
    name: string
}

interface Branch {
    name: string
}

interface TeamHeaderToolbarProps {
    teamName: string
    branch?: Branch
    leader?: Leader
    dateRange: string
    onDateRangeChange: (value: string) => void
    onRefresh: () => void
    onExportCSV: () => void
    onPrint: () => void
}

export function TeamHeaderToolbar({
    teamName,
    branch,
    leader,
    dateRange,
    onDateRangeChange,
    onRefresh,
    onExportCSV,
    onPrint
}: TeamHeaderToolbarProps) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">{teamName}</h1>
                    <Badge variant="secondary" className="ml-1 gap-1">
                        <Dot className="h-4 w-4" />
                        Đội
                    </Badge>
                    {branch && (
                        <Badge variant="outline" className="gap-1.5">
                            <Building2 className="h-3 w-3" />
                            {branch.name}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Khoảng thời gian:</span>
                    <ToggleGroup
                        type="single"
                        value={dateRange}
                        onValueChange={(v) => v && onDateRangeChange(v)}
                        variant="outline"
                        size="sm"
                        className="border bg-background shadow-xs"
                        aria-label="Chọn khoảng thời gian"
                    >
                        <ToggleGroupItem value="7" className="px-4 font-semibold">7 ngày</ToggleGroupItem>
                        <ToggleGroupItem value="30" className="px-4 font-semibold">30 ngày</ToggleGroupItem>
                        <ToggleGroupItem value="90" className="px-4 font-semibold">90 ngày</ToggleGroupItem>
                        <ToggleGroupItem value="180" className="px-4 font-semibold">180 ngày</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <ButtonGroup className="gap-2">
                    <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Làm mới
                    </Button>
                    <Button variant="outline" size="sm" onClick={onExportCSV} className="gap-2">
                        <Download className="h-4 w-4" />
                        Xuất CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={onPrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        In
                    </Button>
                </ButtonGroup>
                {leader && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Trưởng nhóm:</span>
                        <span className="font-medium">{leader.name}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
