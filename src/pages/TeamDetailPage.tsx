// src/pages/TeamDetailPage.tsx
import * as React from "react"
import { useParams } from "react-router-dom"
import { ContentHeader, type TableOfContentsItem } from "@/pages/components/ContentHeader"
import { Home, Users, Youtube, User } from "lucide-react"
import { teamsAPI } from "@/lib/teams-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RightSidebar } from "@/pages/components/RightSidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"


export default function TeamDetailPage() {
    const { teamId } = useParams()
    const [team, setTeam] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    // Define table of contents similar to BranchDetailPage
    const tableOfContents: TableOfContentsItem[] = [
        { id: "overview", title: "Overview", level: 1 },
        { id: "stats", title: "Statistics", level: 1 },
        { id: "members", title: "Members", level: 1 },
        { id: "channels", title: "Channels", level: 1 },
    ]

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
                    {/* Fake TOC column */}
                    <div className="hidden md:block w-48 shrink-0 border-r px-3 py-4 space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 flex-1" />
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-6 space-y-8">
                            {/* Stats grid skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} className="h-28">
                                        <CardContent className="pt-6 space-y-3">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-3 w-32" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Members section skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-40" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Channels section skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-5 w-44" />
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5 rounded" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-40" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-5 w-24 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!team) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Team not found</div>
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

            {/* Layout: TOC column between app sidebar and content */}
            <div className="flex flex-1 overflow-hidden">
                <ChannelSidebar />
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

                        {/* Overview section anchor */}
                        <div id="overview" className="hidden" />

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
                                                    <AvatarFallback>
                                                        {member.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {member.email}
                                                    </div>
                                                </div>
                                                <div className="text-sm px-3 py-1 rounded-full bg-secondary">
                                                    {member.role}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Channels List */}
                        {team.channels && team.channels.length > 0 && (
                            <Card id="channels">
                                <CardHeader>
                                    <CardTitle>Team Channels</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {team.channels.map((channel: any) => (
                                            <div
                                                key={channel._id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Youtube className="h-5 w-5 text-red-600" />
                                                    <div>
                                                        <div className="font-medium">{channel.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {channel.subscriberCount?.toLocaleString() || 0} subscribers
                                                        </div>
                                                    </div>
                                                </div>
                                                {channel.isConnected ? (
                                                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                                        Connected
                                                    </div>
                                                ) : (
                                                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                        Disconnected
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
