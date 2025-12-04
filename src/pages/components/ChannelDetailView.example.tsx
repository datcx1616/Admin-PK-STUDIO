// Example: Cách sử dụng ChannelSidebar với ChannelDetailView
// File: src/pages/brand_chi_nhanh/BranchDetailPage.tsx (EXAMPLE)

import * as React from "react"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import { ChannelDetailView } from "@/pages/channel-analytics/ChannelDetailView"
import type { Channel } from "@/types/channel.types"

export default function BranchDetailPageExample() {
    const branchId = "your-branch-id"
    const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null)

    const handleChannelSelect = (channel: Channel) => {
        console.log('📌 Selected channel:', channel)
        setSelectedChannel(channel)
    }

    const handleBack = () => {
        setSelectedChannel(null)
    }

    return (
        <div className="flex h-full overflow-hidden">
            {/* Sidebar - Danh sách kênh */}
            <ChannelSidebar
                branchId={branchId}
                side="left"
                mode="inline"
                onChannelSelect={handleChannelSelect}
                showDialog={false}
            />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {selectedChannel ? (
                    // Hiển thị chi tiết kênh
                    <ChannelDetailView
                        channel={selectedChannel}
                        onBack={handleBack}
                    />
                ) : (
                    // Hiển thị nội dung mặc định khi chưa chọn kênh
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-muted-foreground">
                                Chọn một kênh để xem chi tiết
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Click vào kênh bên trái để hiển thị thông tin
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
