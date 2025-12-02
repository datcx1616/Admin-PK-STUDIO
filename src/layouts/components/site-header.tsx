import { IconCirclePlusFilled } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 transition-[width,height] ease-linear rounded-t-2xl">
            <div className="flex w-full items-center gap-1 px-3 lg:gap-2 lg:px-4">
                <h1 className="text-sm font-medium">Thống kê</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="hidden h-7 sm:flex bg-red-600">
                        <IconCirclePlusFilled />
                        <span>Live</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}