// src/pages/BranchDetailPage.tsx - UPDATED WITH CHANNEL SIDEBAR FROM API
import * as React from "react"
import { useParams } from "react-router-dom"
import { useBranch } from "@/hooks/useBranches"
import { ContentHeader } from "@/pages/components/ContentHeader"
import { ChannelSidebar } from "@/pages/components/ChannelSidebar"
import { Building2, Users, Youtube, TrendingUp, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BranchDetailPage() {
    const { branchId } = useParams<{ branchId: string }>()
    const { branch, loading, error } = useBranch(branchId!)

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
                        <div className="max-w-5xl mx-auto p-6 space-y-8">
                            {/* Overview Section Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-72" />
                                <Skeleton className="h-5 w-64" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-6 rounded-lg border bg-card">
                                            <Skeleton className="h-4 w-24 mb-4" />
                                            <Skeleton className="h-8 w-20 mb-2" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Teams Section Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-40" />
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-56" />
                                                    <Skeleton className="h-3 w-40" />
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <Skeleton className="h-3 w-16 ml-auto" />
                                                    <Skeleton className="h-6 w-12 ml-auto" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Channels Section Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-44" />
                                <Skeleton className="h-6 w-36" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="p-4 rounded-lg border bg-card">
                                            <div className="flex items-start gap-3">
                                                <Skeleton className="h-8 w-8 rounded" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-4 w-48" />
                                                    <Skeleton className="h-3 w-40" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Section Skeleton */}
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-6 w-40" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="p-4 rounded-lg border bg-card space-y-3">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-7 w-16" />
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

    if (error || !branch) {
        return (
            <div className="flex flex-col h-full overflow-hidden">
                <ContentHeader
                    breadcrumbs={[
                        { label: "Home", href: "/dashboard" },
                        { label: "Branches", href: "/branches" },
                        { label: "Error", icon: <Building2 className="h-4 w-4" /> },
                    ]}
                />
                <div className="flex flex-1 overflow-hidden">
                    <ChannelSidebar branchId={branchId} side="left" mode="inline" />
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
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ContentHeader
                breadcrumbs={[
                    { label: "Home", href: "/dashboard" },
                    { label: "Branches", href: "/branches" },
                    { label: branch.name, icon: <Building2 className="h-4 w-4" /> },
                ]}
            />
            {/* Layout: Channel Sidebar on left, Content on right */}
            <div className="flex flex-1 overflow-hidden">
                {/* Channel Sidebar - fetches channels from API based on branchId */}
                <ChannelSidebar branchId={branchId} side="left" mode="inline" />

                {/* Main Content */}
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
                                <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 text-blue-900">
                                    <div className="flex items-start gap-3">
                                        <Youtube className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium mb-1">Danh sách kênh trong sidebar</p>
                                            <p className="text-sm">
                                                Danh sách tất cả kênh của chi nhánh này được hiển thị ở sidebar bên trái.
                                                Click vào từng kênh để xem thông tin chi tiết bao gồm thống kê, analytics,
                                                team assignment và recent videos.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Optional: Still show channel count from branch data */}
                                {branch.channels && branch.channels.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {branch.channels.map((channel) => (
                                            <div key={channel._id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-3">
                                                    <Youtube className="h-8 w-8 text-red-500 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold truncate">{channel.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {channel.subscriberCount?.toLocaleString() || 0} subscribers
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
        </div>
    )
}
