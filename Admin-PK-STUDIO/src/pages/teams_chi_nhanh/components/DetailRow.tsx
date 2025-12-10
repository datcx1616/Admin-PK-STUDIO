import * as React from "react"
import { cn } from "@/lib/utils"
import { TableCell, TableRow } from "@/components/ui/table"

export function DetailRow({
    icon: Icon,
    label,
    value,
    highlight = false
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | number
    highlight?: boolean
}) {
    return (
        <TableRow className={cn(
            "hover:bg-muted/50",
            highlight && "bg-green-50 dark:bg-green-950"
        )}>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Icon className={cn(
                        "h-4 w-4",
                        highlight ? "text-green-600" : "text-muted-foreground"
                    )} />
                    {label}
                </div>
            </TableCell>
            <TableCell className={cn(
                "text-right",
                highlight && "font-semibold text-green-700 dark:text-green-400"
            )}>
                {value}
            </TableCell>
        </TableRow>
    )
}
