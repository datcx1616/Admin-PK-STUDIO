import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingSkeleton() {
    return (
        <div className="flex flex-col h-full">
            <div
                className="px-6 py-4 bg-background/50 backdrop-blur"
                style={{
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                }}
            >
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
                <div
                    className="w-[480px] bg-background"
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                    }}
                >
                    <div
                        className="p-4"
                        style={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="p-3 space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className="p-3 rounded-lg"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid rgba(0, 0, 0, 0.06)',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                                }}
                            >
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
                    <div className="max-w-7xl mx-auto p-6 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-72" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-24 mb-4" />
                                        <Skeleton className="h-8 w-20 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
