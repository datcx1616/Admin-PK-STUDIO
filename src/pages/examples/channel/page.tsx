// src/pages/examples/channel/channel-management.tsx
import { List, Eye, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/pages/examples/channel/components/site-header"
import { YouTubeChannelsList } from "@/pages/examples/channel/components/youtube-channels-list"

export default function ChannelManagement() {
    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader />
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <YouTubeChannelsList />
                </div>
            </div>
        </div>
    )
}