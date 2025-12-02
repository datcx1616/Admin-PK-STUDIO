// src/components/TableOfContents.tsx
import * as React from "react"
import { List, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
    id: string
    title: string
    level: number // 1, 2, 3 for h1, h2, h3
}

interface TableOfContentsProps {
    items: TableOfContentsItem[]
    className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
    const [open, setOpen] = React.useState(false)
    const [activeId, setActiveId] = React.useState<string>("")

    // Track which heading is currently in view
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
            setOpen(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", className)}
                    aria-label="Table of contents"
                >
                    <List className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80">
                <SheetHeader>
                    <SheetTitle>On this page</SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                    <nav className="space-y-1">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToHeading(item.id)}
                                className={cn(
                                    "w-full text-left text-sm transition-colors hover:text-foreground py-2 px-3 rounded-md flex items-center gap-2",
                                    item.level === 1 && "font-semibold",
                                    item.level === 2 && "pl-6",
                                    item.level === 3 && "pl-9 text-muted-foreground",
                                    activeId === item.id
                                        ? "text-foreground bg-accent font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.level > 1 && (
                                    <ChevronRight className="h-3 w-3 shrink-0" />
                                )}
                                <span className="truncate">{item.title}</span>
                            </button>
                        ))}
                    </nav>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
