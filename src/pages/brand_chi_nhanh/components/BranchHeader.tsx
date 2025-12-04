import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar } from "lucide-react"
import { type BranchDetail } from "@/lib/branches-api"

interface BranchHeaderProps {
    branch: BranchDetail
    selectedDays: number
    onDaysChange: (days: number) => void
    onRefresh: () => void
    isLoading: boolean
}

const dayOptions = [
    { label: "7 ngày", value: 7 },
    { label: "30 ngày", value: 30 },
    { label: "90 ngày", value: 90 },
    { label: "180 ngày", value: 180 },
]

export function BranchHeader({
    branch,
    selectedDays,
    onDaysChange,
    onRefresh,
    isLoading,
}: BranchHeaderProps) {
    return (
        <div className="space-y-4 mb-6">
            {/* Branch Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{branch.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Mã chi nhánh: <Badge variant="outline" className="ml-1">{branch.code || "N/A"}</Badge>
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onRefresh}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                >
                    {isLoading ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">Thời gian:</span>
                <div className="flex gap-2 flex-wrap">
                    {dayOptions.map((option) => (
                        <Button
                            key={option.value}
                            onClick={() => onDaysChange(option.value)}
                            variant={selectedDays === option.value ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
