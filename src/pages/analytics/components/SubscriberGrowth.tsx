import { Users, UserPlus, UserMinus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { AnalyticsResponse } from "./types"
import { formatNumber } from "./utils"

interface SubscriberGrowthProps {
    analytics: AnalyticsResponse
}

export function SubscriberGrowth({ analytics }: SubscriberGrowthProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Chi tiết tăng trưởng Subscribers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <UserPlus className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">Gained</span>
                            </div>
                            <div className="text-3xl font-bold text-green-900">
                                +{formatNumber(analytics?.basic?.totals.totalSubscribersGained || 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <UserMinus className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-700 font-medium">Lost</span>
                            </div>
                            <div className="text-3xl font-bold text-red-900">
                                -{formatNumber(analytics?.basic?.totals.totalSubscribersLost || 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-700 font-medium">Net Change</span>
                            </div>
                            <div className={`text-3xl font-bold ${(analytics?.basic?.totals.totalSubscribersNet || 0) >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                                {(analytics?.basic?.totals.totalSubscribersNet || 0) >= 0 ? '+' : ''}
                                {formatNumber(analytics?.basic?.totals.totalSubscribersNet || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
