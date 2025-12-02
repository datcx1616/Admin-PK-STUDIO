
import { Button } from "@/components/ui/button"
import {
    IconVideoPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export function SiteHeader() {
    const navigate = useNavigate();
    return (
        <header className="bg-background/90 pb-3 sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <h1 className="text-base font-medium">Kênh Của Tôi</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button onClick={() => navigate("/videos/create")} size="sm" className="hidden h-7 sm:flex bg-red-600">
                        <IconVideoPlus />
                        <span>Tạo Video Mới</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}