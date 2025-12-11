import { SiteHeader } from "@/pages/channel/components/site-header"
import { YouTubeChannelsList } from "@/pages/channel/components/youtube-channels-list"
import { useState } from "react"

export default function ChannelManagement() {
    const [refetchTrigger, setRefetchTrigger] = useState(0)

    const handleRefresh = () => {
        setRefetchTrigger(prev => prev + 1)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader onRefresh={handleRefresh} />
            <div className="px-6 py-6">
                <div className="w-full">
                    <YouTubeChannelsList key={refetchTrigger} />
                </div>
            </div>
        </div>
    )
}