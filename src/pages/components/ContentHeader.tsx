import * as React from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents, type TableOfContentsItem } from "@/pages/components/TableOfContents"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
    icon?: React.ReactNode
}

interface ContentHeaderProps {
    breadcrumbs: BreadcrumbItem[]
    actions?: React.ReactNode
    className?: string
    tableOfContents?: TableOfContentsItem[]
}

export function ContentHeader({ breadcrumbs, actions, className, tableOfContents }: ContentHeaderProps) {
    return (
        <div className={cn(
            "sticky top-0 z-10 bg-background border-b",
            "px-6 py-3",
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <nav className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}

                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 font-medium text-foreground">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {tableOfContents && tableOfContents.length > 0 && (
                        <TableOfContents items={tableOfContents} />
                    )}
                    {actions || (
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export type { TableOfContentsItem }
