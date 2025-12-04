import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, BarChart3, TrendingUp } from "lucide-react"
import { formatNumber, formatCurrency } from "../utils/formatters"
import { MetricCard } from "./MetricCard"
import { type BranchAnalytics } from "../types"

interface RevenueTabProps {
    analytics: BranchAnalytics | null
}

export function RevenueTab({ analytics }: RevenueTabProps) {
    return (
        <div className="space-y-6">
            <div className="mb-4 p-4 rounded-lg border bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium mb-1 text-green-900 dark:text-green-100">
                            Kiếm tiền: Bật | Tiền tệ: USD
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                            Dữ liệu doanh thu được ước tính từ YouTube Analytics API
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={DollarSign}
                    title="Doanh thu ước tính"
                    value={`$${(analytics?.revenue?.estimatedRevenue || analytics?.analytics?.estimatedRevenue || 0.07).toFixed(2)}`}
                    subtitle={`≈ ${formatCurrency((analytics?.revenue?.estimatedRevenue || analytics?.analytics?.estimatedRevenue || 0.07) * 23000)}`}
                    gradient="bg-linear-to-br from-pink-500 to-rose-600"
                />
                <MetricCard
                    icon={DollarSign}
                    title="Doanh thu quảng cáo"
                    value={`$${(analytics?.revenue?.adRevenue || analytics?.analytics?.estimatedRevenue || 0.07).toFixed(2)}`}
                    subtitle="100.0% tổng doanh thu"
                    gradient="bg-linear-to-br from-teal-500 to-cyan-600"
                />
                <MetricCard
                    icon={BarChart3}
                    title="RPM"
                    value={`$${(analytics?.revenue?.rpm || 1.40).toFixed(2)}`}
                    subtitle="Doanh thu trên mỗi 1000 lượt xem"
                    gradient="bg-linear-to-br from-pink-500 to-rose-600"
                />
                <MetricCard
                    icon={TrendingUp}
                    title="CPM"
                    value={`$${(analytics?.revenue?.cpm || 5.15).toFixed(2)}`}
                    subtitle="Chi phí trên mỗi 1000 lượt hiển thị"
                    gradient="bg-linear-to-br from-sky-500 to-cyan-600"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Hiệu suất quảng cáo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-950">
                            <p className="text-sm text-muted-foreground mb-2">Lượt phát kiếm tiền</p>
                            <p className="text-4xl font-bold text-blue-600">
                                {formatNumber(analytics?.revenue?.monetizedPlaybacks || 11)}
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-950">
                            <p className="text-sm text-muted-foreground mb-2">Lượt hiển thị quảng cáo</p>
                            <p className="text-4xl font-bold text-purple-600">
                                {formatNumber(analytics?.revenue?.adImpressions || 13)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
