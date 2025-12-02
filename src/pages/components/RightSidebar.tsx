import * as React from "react"
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface TableOfContentsItem {
    id: string
    title: string
    level: number // 1, 2, 3 for h1, h2, h3
}

interface RightSidebarProps {
    items: TableOfContentsItem[]
    className?: string
    side?: "left" | "right"
    mode?: "fixed" | "inline"
}

export function RightSidebar({ items, className, side = "right", mode = "fixed" }: RightSidebarProps) {
    const [isOpen, setIsOpen] = React.useState(true)
    const [activeId, setActiveId] = React.useState<string>("")

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "0px 0px -80% 0px" }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [items])

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <>
            {/* Toggle Button - Fixed position when sidebar is closed */}
            {mode === "fixed" && !isOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "fixed top-20 z-50 h-8 w-8 rounded-full shadow-md bg-background border",
                        side === "right" ? "right-4" : "left-4"
                    )}
                >
                    <Menu className="h-4 w-4" />
                </Button>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    mode === "fixed"
                        ? cn(
                            "fixed top-0 h-full bg-background transition-all duration-300 ease-in-out z-40",
                            side === "right" ? "right-0 border-l" : "left-0 border-r",
                            isOpen ? "w-64" : "w-0"
                        )
                        : cn(
                            "sticky top-0 h-[calc(100vh-0px)] transition-all duration-300 ease-in-out overflow-hidden",
                            isOpen ? "bg-background w-64" : "bg-transparent w-8",
                            // hide side border when collapsed to avoid visible line
                            isOpen
                                ? side === "right" ? "border-l bg-background" : "border-r bg-background"
                                : "border-transparent"
                        ),
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    {isOpen ? (
                        <div className="flex items-center justify-between px-4 py-3 border-b-0 bg-transparent">
                            <h3 className="text-gray-900 font-bold text-sm">Danh sách kênh</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-7 w-7 text-gray-500 hover:text-gray-700"
                            >
                                {side === "right" ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        // Inline closed state: center the opener to avoid clipping
                        <div className="flex items-center justify-center h-12">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(true)}
                                className="h-7 w-7 rounded-full bg-background border shadow text-gray-700"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Content */}
                    <ScrollArea className={cn("flex-1", !isOpen && "hidden")}>
                        <nav className="p-4 space-y-1">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToHeading(item.id)}
                                    className={cn(
                                        "w-full text-left text-sm transition-colors py-2 px-3 rounded-md flex items-start gap-2",
                                        item.level === 1 && "font-semibold text-gray-900",
                                        item.level === 2 && "pl-6",
                                        item.level === 3 && "pl-9 text-xs",
                                        activeId === item.id
                                            ? "text-gray-900 bg-accent font-medium"
                                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    )}
                                >
                                    {item.level > 1 && (
                                        <ChevronRight className="h-3 w-3 shrink-0 mt-0.5" />
                                    )}
                                    <span className="leading-tight">{item.title}</span>
                                </button>
                            ))}
                        </nav>
                    </ScrollArea>
                </div>
            </div>

            {/* Overlay when sidebar is open (optional, for mobile) */}
            {mode === "fixed" && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
