import * as React from "react"

const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
        <path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
import { DropdownMenuAdvanced } from "@/components/ui/dropdown-menu-advanced"
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
        <div
            className={cn(
                "sticky top-0 z-10",
                // Bo tròn góc phải để thẳng hàng với layout bên trái
                // Không dịch trái/phải để tránh lệch với cột TOC và sidebar
                "px-6 py-2.5",
                // Bỏ viền trái để nhìn liền mạch với khu vực bên trái
                "border-l-0",
                className
            )}
            style={{
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <nav className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && (
                                    <span className="h-4 w-4 text-muted-foreground select-none"><ChevronIcon /></span>
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
                        <DropdownMenuAdvanced />
                    )}
                </div>
            </div>
        </div>
    )
}

export type { TableOfContentsItem }
