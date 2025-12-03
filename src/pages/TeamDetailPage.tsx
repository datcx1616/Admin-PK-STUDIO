// src/pages/TeamDetailPage.tsx - UPDATED WITH CHANNEL SIDEBAR FROM API
import * as React from "react"
import { useParams } from "react-router-dom"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import { Home, Users, Youtube, User } from "lucide-react"
import { teamsAPI } from "@/lib/teams-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeamDetailPage() {
    const { teamId } = useParams()
    const [team, setTeam] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchTeam = async () => {
            if (!teamId) return

            try {
                setLoading(true)
                const data = await teamsAPI.getById(teamId)
                setTeam(data)
            } catch (error) {
                console.error('Error fetching team:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTeam()
    }, [teamId])

    if (loading) {
        return (
            <div className="flex flex-col h-full">
                {/* Skeleton Breadcrumb */}
                <div className="border-b px-6 py-4 bg-background/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-16" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Channel Sidebar Skeleton */}
                    <div className="w-[480px] border-r bg-background">
                        <div className="p-4 border-b">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="p-3 space-y-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="p-3 rounded-lg border">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-6 space-y-6">
                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <Card key={i}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-4" />
                                        </CardHeader>
                                        <CardContent>
                                            <Skeleton className="h-8 w-16 mb-2" />
                                            <Skeleton className="h-3 w-24" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Members Skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!team) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Teams", href: "/teams" },
                        { label: "Error", icon: <Users className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar teamId={teamId} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="text-center text-muted-foreground">Team not found</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header with breadcrumb */}
            <ContentHeader
                breadcrumbs={[
                    { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                    { label: "Teams", href: "/teams" },
                    { label: team.name, icon: <Users className="h-4 w-4" /> },
                ]}
            />

            {/* Layout: Channel Sidebar on left, Content on right */}
            <div className="flex flex-1 overflow-hidden">
                {/* Channel Sidebar - fetches channels from API based on teamId */}
                <ChannelSidebar teamId={teamId} side="left" mode="inline" />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto p-6 space-y-6">
                        {/* Stats section */}
                        <div id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Members</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{team.members?.length || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Team members
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Channels</CardTitle>
                                    <Youtube className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{team.channels?.length || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        YouTube channels
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Leader</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold">
                                        {team.leader?.name || 'Not assigned'}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Team leader
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Team Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                                        <p className="text-sm">{team.description || 'No description'}</p>
                                    </div>
                                    {team.branch && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Branch</p>
                                            <p className="text-sm font-semibold">{team.branch.name}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members List */}
                        {team.members && team.members.length > 0 && (
                            <Card id="members">
                                <CardHeader>
                                    <CardTitle>Team Members</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {team.members.map((member: any) => (
                                            <div
                                                key={member._id}
                                                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                            >
                                                <Avatar>
                                                    <AvatarFallback className="bg-blue-100 text-blue-700">
                                                        {member.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {member.email}
                                                    </div>
                                                </div>
                                                <div className="text-xs px-3 py-1 rounded-full bg-secondary font-medium">
                                                    {member.role}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Channel Info Card */}
                        <Card id="channels">
                            <CardHeader>
                                <CardTitle>Team Channels</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="flex items-start gap-3">
                                        <Youtube className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-900 mb-1">
                                                Danh sách kênh trong sidebar
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                Danh sách tất cả {team.channels?.length || 0} kênh của team này được hiển thị ở sidebar bên trái.
                                                Click vào từng kênh để xem thông tin chi tiết bao gồm:
                                            </p>
                                            <ul className="text-sm text-blue-800 mt-2 ml-4 space-y-1">
                                                <li>• Thống kê subscribers, views, videos</li>
                                                <li>• Analytics và performance metrics</li>
                                                <li>• Danh sách editors được assign</li>
                                                <li>• Recent videos</li>
                                                <li>• Link trực tiếp đến YouTube</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick channel overview from team data */}
                                {team.channels && team.channels.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-muted-foreground mb-3">
                                            Quick Overview
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {team.channels.map((channel: any) => (
                                                <div
                                                    key={channel._id}
                                                    className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent transition-colors"
                                                >
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                                                        <Youtube className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{channel.name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>
                                                                {channel.subscriberCount?.toLocaleString() || 0} subscribers
                                                            </span>
                                                            {channel.isConnected ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                                                                    Connected
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                                                                    Offline
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Empty state if no channels */}
                        {(!team.channels || team.channels.length === 0) && (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="text-center">
                                        <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground mb-2">
                                            Chưa có kênh nào trong team này
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Thêm kênh YouTube vào team để bắt đầu quản lý
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
