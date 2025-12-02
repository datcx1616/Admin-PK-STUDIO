// src/pages/BranchDetailPage.tsx - UPDATED WITH RIGHT SIDEBAR
import * as React from "react"
import { useParams } from "react-router-dom"
import { useBranch } from "@/hooks/useBranches"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { RightSidebar, type TableOfContentsItem } from "@/pages/components/RightSidebar"
import { Building2, Users, Youtube, TrendingUp, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/layouts/components/app-sidebar"

export default function BranchDetailPage() {
    const { branchId } = useParams<{ branchId: string }>()
    const { branch, loading, error } = useBranch(branchId!)

    // Define table of contents
    const tableOfContents: TableOfContentsItem[] = [
        { id: "overview", title: "Overview", level: 1 },
        { id: "statistics", title: "Statistics", level: 2 },
        { id: "location", title: "Location", level: 2 },
        { id: "teams", title: "Teams", level: 1 },
        { id: "team-list", title: "Team List", level: 2 },
        { id: "channels", title: "Channels", level: 1 },
        { id: "channel-list", title: "Channel List", level: 2 },
        { id: "performance", title: "Performance", level: 1 },
        { id: "metrics", title: "Key Metrics", level: 2 },
    ]

    if (loading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col h-screen overflow-hidden">
                    <ContentHeader
                        breadcrumbs={[
                            { label: "Home", href: "/dashboard" },
                            { label: "Branches", href: "/branches" },
                            { label: "Loading...", icon: <Building2 className="h-4 w-4" /> },
                        ]}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <RightSidebar items={tableOfContents} side="left" mode="inline" />
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-5xl mx-auto p-6">
                                <Skeleton className="h-12 w-64 mb-4" />
                                <Skeleton className="h-6 w-48 mb-8" />
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-32" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (error || !branch) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col h-screen overflow-hidden">
                    <ContentHeader
                        breadcrumbs={[
                            { label: "Home", href: "/dashboard" },
                            { label: "Branches", href: "/branches" },
                            { label: "Error", icon: <Building2 className="h-4 w-4" /> },
                        ]}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <RightSidebar items={tableOfContents} side="left" mode="inline" />
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-5xl mx-auto p-6">
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error || "Branch not found"}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", href: "/dashboard" },
                        { label: "Branches", href: "/branches" },
                        { label: branch.name, icon: <Building2 className="h-4 w-4" /> },
                    ]}
                />
                {/* Layout: TOC column between app sidebar and content */}
                <div className="flex flex-1 overflow-hidden">
                    <RightSidebar items={tableOfContents} side="left" mode="inline" />
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-6">
                            <section id="overview" className="mb-12 scroll-mt-20">
                                <h1 className="text-4xl font-bold mb-2">{branch.name}</h1>
                                <p className="text-muted-foreground mb-8">{branch.description}</p>
                                <div id="statistics" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 scroll-mt-20">
                                    <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Teams</h3>
                                            <Users className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <p className="text-3xl font-bold">{branch.teamsCount || 0}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Total teams in branch</p>
                                    </div>
                                    <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Channels</h3>
                                            <Youtube className="h-5 w-5 text-red-500" />
                                        </div>
                                        <p className="text-3xl font-bold">{branch.channelsCount || 0}</p>
                                        <p className="text-xs text-muted-foreground mt-1">YouTube channels</p>
                                    </div>
                                    <div id="location" className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow scroll-mt-20">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                                            <MapPin className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="text-2xl font-bold">{branch.location || "N/A"}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Branch location</p>
                                    </div>
                                </div>
                            </section>
                            <section id="teams" className="mb-12 scroll-mt-20">
                                <h1 className="text-3xl font-bold mb-6">Teams</h1>
                                <div id="team-list" className="scroll-mt-20">
                                    <h2 className="text-xl font-semibold mb-4">Team List</h2>
                                    {branch.teams && branch.teams.length > 0 ? (
                                        <div className="space-y-4">
                                            {branch.teams.map((team) => (
                                                <div key={team._id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{team.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{team.description}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-muted-foreground">Members</p>
                                                            <p className="text-2xl font-bold">{team.membersCount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                            <p className="text-muted-foreground">No teams found in this branch</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                            <section id="channels" className="mb-12 scroll-mt-20">
                                <h1 className="text-3xl font-bold mb-6">Channels</h1>
                                <div id="channel-list" className="scroll-mt-20">
                                    <h2 className="text-xl font-semibold mb-4">Channel List</h2>
                                    {branch.channels && branch.channels.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {branch.channels.map((channel) => (
                                                <div key={channel._id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-3">
                                                        <Youtube className="h-8 w-8 text-red-500 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold truncate">{channel.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{channel.subscriberCount?.toLocaleString() || 0} subscribers</p>
                                                            {/* Team relation not in channel type; omit display */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                                            <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                            <p className="text-muted-foreground">No channels found in this branch</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                            <section id="performance" className="mb-12 scroll-mt-20">
                                <h1 className="text-3xl font-bold mb-6">Performance</h1>
                                <div id="metrics" className="scroll-mt-20">
                                    <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total Views", value: "0", icon: TrendingUp },
                                            { label: "Watch Time", value: "0h", icon: TrendingUp },
                                            { label: "Subscribers", value: "0", icon: Users },
                                            { label: "Revenue", value: "$0", icon: TrendingUp },
                                        ].map((metric) => (
                                            <div key={metric.label} className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                                                </div>
                                                <p className="text-2xl font-bold">{metric.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
