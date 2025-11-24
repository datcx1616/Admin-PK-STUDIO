import { SiteHeader } from "@/pages/examples/channel/components/site-header"
import { YouTubeChannelsList } from "@/pages/examples/channel/components/youtube-channels-list"

export default function ChannelManagement() {
    return (
        <div className="min-h-screen bg-slate-50">
            <SiteHeader />
            <div className="px-6 py-6">
                <div className="w-full">
                    <YouTubeChannelsList />
                </div>
            </div>
        </div>
    )
}