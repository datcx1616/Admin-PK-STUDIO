import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Youtube } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type AnalyticsMode = 'single' | 'aggregate' | 'compare' | 'branch' | 'team'

interface Channel {
    _id: string
    name: string
    youtubeChannelId?: string
    thumbnailUrl?: string
    subscriberCount: number
    viewCount: number
    videoCount: number
    isConnected: boolean
    refreshToken?: boolean
    team?: {
        _id: string
        name: string
    }
}

interface Branch {
    _id: string
    name: string
    code: string
    teamsCount?: number
}

interface Team {
    _id: string
    name: string
    branch?: {
        _id: string
        name: string
    }
}

interface ChannelSelectorProps {
    mode: AnalyticsMode
    channels: Channel[]
    branches: Branch[]
    teams: Team[]
    selectedChannels: string[]
    onSelectChannel: (channelId: string) => void
    onViewAnalytics: (channelId: string, channelName: string) => void
    onViewBranch: (branchId: string, branchName: string) => void
    onViewTeam: (teamId: string, teamName: string) => void
    onViewAggregate: () => void
    onViewCompare: () => void
    maxChannels?: number
}

export function ChannelSelector({
    mode,
    channels,
    branches,
    teams,
    selectedChannels,
    onSelectChannel,
    onViewAnalytics,
    onViewBranch,
    onViewTeam,
    onViewAggregate,
    onViewCompare,
    maxChannels = 5
}: ChannelSelectorProps) {

    const connectedChannels = channels.filter(c => c.isConnected || c.refreshToken)

    // Single mode - view individual channels
    if (mode === 'single') {
        const channelsWithTeam = connectedChannels.filter(c => c.team)
        const channelsWithoutTeam = connectedChannels.filter(c => !c.team)

        return (
            <div className="space-y-6">
                {channelsWithTeam.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kênh đã có nhóm</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {channelsWithTeam.map((channel) => (
                                <ChannelCard
                                    key={channel._id}
                                    channel={channel}
                                    onClick={() => onViewAnalytics(channel._id, channel.name)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {channelsWithoutTeam.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kênh chưa có nhóm</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {channelsWithoutTeam.map((channel) => (
                                <ChannelCard
                                    key={channel._id}
                                    channel={channel}
                                    onClick={() => onViewAnalytics(channel._id, channel.name)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {connectedChannels.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Youtube className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Không có kênh nào được kết nối</h3>
                            <p className="text-sm text-muted-foreground">Vui lòng kết nối kênh YouTube để xem analytics</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    // Aggregate/Compare mode - select multiple channels
    if (mode === 'aggregate' || mode === 'compare') {
        const minRequired = mode === 'compare' ? 2 : 1
        const actionLabel = mode === 'compare' ? 'So Sánh' : 'Xem Tổng Hợp'
        const isDisabled = selectedChannels.length < minRequired

        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Đã chọn: {selectedChannels.length} kênh</CardTitle>
                                {mode === 'compare' && (
                                    <CardDescription>Tối đa 5 kênh</CardDescription>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => selectedChannels.forEach(id => onSelectChannel(id))}
                                >
                                    Bỏ chọn tất cả
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={isDisabled}
                                    onClick={mode === 'compare' ? onViewCompare : onViewAggregate}
                                >
                                    {mode === 'compare' ? '⚖️' : '📊'} {actionLabel}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connectedChannels.map((channel) => {
                        const isSelected = selectedChannels.includes(channel._id)
                        const canSelect = isSelected || selectedChannels.length < maxChannels

                        return (
                            <ChannelSelectCard
                                key={channel._id}
                                channel={channel}
                                isSelected={isSelected}
                                canSelect={canSelect}
                                onToggle={() => canSelect && onSelectChannel(channel._id)}
                                maxReached={!canSelect}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }

    // Branch mode
    if (mode === 'branch') {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>🏢 Chi Nhánh</CardTitle>
                        <CardDescription>Chọn chi nhánh để xem tổng analytics của tất cả kênh</CardDescription>
                    </CardHeader>
                </Card>

                {branches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {branches.map((branch) => (
                            <Card
                                key={branch._id}
                                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                                onClick={() => onViewBranch(branch._id, branch.name)}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl">
                                            🏢
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{branch.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Mã: {branch.code} | {branch.teamsCount || 0} team(s)
                                            </p>
                                        </div>
                                        <div className="text-primary text-2xl">→</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-6xl mb-4">🏢</div>
                            <h3 className="text-lg font-semibold mb-2">Không có chi nhánh nào</h3>
                            <p className="text-sm text-muted-foreground">Vui lòng tạo chi nhánh trước</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    // Team mode
    if (mode === 'team') {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>👥 Nhóm </CardTitle>
                        <CardDescription>Chọn nhóm để xem tổng analytics của tất cả kênh</CardDescription>
                    </CardHeader>
                </Card>

                {teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teams.map((team) => (
                            <Card
                                key={team._id}
                                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                                onClick={() => onViewTeam(team._id, team.name)}
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl">
                                            👥
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{team.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Chi nhánh: {team.branch?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-primary text-2xl">→</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-semibold mb-2">Chưa có team nào</h3>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    return null
}

// Channel Card for single mode
function ChannelCard({ channel, onClick }: { channel: Channel; onClick: () => void }) {
    const hasOAuth = channel.isConnected || channel.refreshToken

    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-all ${hasOAuth ? 'hover:border-primary' : 'opacity-60 cursor-not-allowed'
                }`}
            onClick={hasOAuth ? onClick : undefined}
        >
            <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                        <AvatarFallback>📺</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{channel.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{channel.team?.name || 'N/A'}</span>
                            {hasOAuth ? (
                                <Badge variant="outline" className="text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" /> OAuth
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    <XCircle className="h-3 w-3 mr-1" /> No OAuth
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                        <div className="font-semibold">{channel.subscriberCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">subscribers</div>
                    </div>
                    <div>
                        <div className="font-semibold">{channel.videoCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">videos</div>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full" disabled={!hasOAuth}>
                    {hasOAuth ? '📊 Xem Analytics Chi Tiết' : '🔒 Cần OAuth'}
                </Button>
            </CardContent>
        </Card>
    )
}

// Channel Select Card for aggregate/compare mode
function ChannelSelectCard({
    channel,
    isSelected,
    canSelect,
    onToggle,
    maxReached
}: {
    channel: Channel
    isSelected: boolean
    canSelect: boolean
    onToggle: () => void
    maxReached: boolean
}) {
    return (
        <Card
            className={`cursor-pointer transition-all ${isSelected ? 'border-2 border-primary bg-primary/5' : 'hover:border-primary/50'
                } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onToggle}
        >
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <Checkbox checked={isSelected} disabled={!canSelect && !isSelected} />
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={channel.thumbnailUrl} alt={channel.name} />
                        <AvatarFallback>📺</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{channel.name}</h4>
                        <p className="text-sm text-muted-foreground">{channel.team?.name || 'Chưa gán team'}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-primary">{channel.subscriberCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">subscribers</div>
                    </div>
                </div>
                {maxReached && !isSelected && (
                    <p className="text-xs text-destructive mt-2">Đã đạt giới hạn chọn</p>
                )}
            </CardContent>
        </Card>
    )
}
