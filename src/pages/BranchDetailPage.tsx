import * as React from "react"
import { useParams } from "react-router-dom"
import { ContentHeader, type TableOfContentsItem } from "@/pages/components/ContentHeader"
import { Home, Building2, Users, Youtube } from "lucide-react"
import { branchesAPI } from "@/lib/branches-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/pages/examples/layout/components/app-sidebar"

export default function BranchDetailPage() {
    const { branchId } = useParams()
    const [branch, setBranch] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    // Define table of contents
    const tableOfContents: TableOfContentsItem[] = [
        { id: "overview", title: "Overview", level: 1 },
        { id: "stats", title: "Statistics", level: 1 },
        { id: "teams", title: "Teams", level: 1 },
        { id: "channels", title: "Channels", level: 1 },
    ]

    React.useEffect(() => {
        const fetchBranch = async () => {
            if (!branchId) return

            try {
                setLoading(true)
                const data = await branchesAPI.getById(branchId)
                setBranch(data)
            } catch (error) {
                console.error('Error fetching branch:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBranch()
    }, [branchId])

    if (loading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-muted-foreground">Loading...</div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (!branch) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-muted-foreground">Branch not found</div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                {/* Header with breadcrumb and TOC */}
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
                        { label: "Branches", href: "/brand" },
                        { label: branch.name, icon: <Building2 className="h-4 w-4" /> },
                    ]}
                    tableOfContents={tableOfContents}
                />

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto p-6 space-y-6">
                        {/* Title - Overview section */}
                        <div id="overview">
                            <h1 className="text-3xl font-bold mb-2">{branch.name}</h1>
                            {branch.description && (
                                <p className="text-muted-foreground">{branch.description}</p>
                            )}
                        </div>

                        {/* Stats section */}
                        <div id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Teams</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{branch.teamsCount || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total teams in branch
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Channels</CardTitle>
                                    <Youtube className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{branch.channelsCount || 0}</div>
                                    <p className="text-xs text-muted-foreground">
                                        YouTube channels
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Location</CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{branch.location || 'N/A'}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Branch location
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Teams List section */}
                        {branch.teams && branch.teams.length > 0 && (
                            <Card id="teams">
                                <CardHeader>
                                    <CardTitle>Teams in {branch.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {branch.teams.map((team: any) => (
                                            <div
                                                key={team._id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">{team.name}</div>
                                                        {team.description && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {team.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {team.membersCount || 0} members
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Channels List section */}
                        {branch.channels && branch.channels.length > 0 && (
                            <Card id="channels">
                                <CardHeader>
                                    <CardTitle>Channels in {branch.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {branch.channels.map((channel: any) => (
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
                                                {channel.team && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {channel.team.name}
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
            </SidebarInset>
        </SidebarProvider>
    )
}
