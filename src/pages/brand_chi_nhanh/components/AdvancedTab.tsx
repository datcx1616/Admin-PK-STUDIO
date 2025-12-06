import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, BarChart3, Youtube, TrendingUp, Eye, Video } from "lucide-react"
import { formatNumber } from "../utils/formatters"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { type BranchAnalytics } from "../types/branch-analytics.types"

interface AdvancedTabProps {
    analytics: BranchAnalytics | null
    isLoading: boolean
    onRefresh: () => void
}

export function AdvancedTab({ analytics, isLoading, onRefresh }: AdvancedTabProps) {
    return (
        <div className="space-y-6">
            {isLoading ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Đang tải analytics...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : analytics ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê tổng hợp</CardTitle>
                        <CardDescription>Hiệu suất tổng thể của chi nhánh</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Chỉ số</TableHead>
                                        <TableHead className="font-semibold text-right">Tổng</TableHead>
                                        <TableHead className="font-semibold text-right">Trung bình/kênh</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2">
                                            <Youtube className="h-4 w-4 text-muted-foreground" />
                                            Kênh
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {analytics?.summary?.totalChannels || 0}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            Người đăng ký
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatNumber(analytics?.summary?.totalSubscribers || 0)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {(analytics?.summary?.totalChannels || 0) > 0
                                                ? formatNumber(Math.round((analytics?.summary?.totalSubscribers || 0) / (analytics?.summary?.totalChannels || 1)))
                                                : '0'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                            Lượt xem
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatNumber(analytics?.summary?.totalViews || 0)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {(analytics?.summary?.totalChannels || 0) > 0
                                                ? formatNumber(Math.round((analytics?.summary?.totalViews || 0) / (analytics?.summary?.totalChannels || 1)))
                                                : '0'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="flex items-center gap-2">
                                            <Video className="h-4 w-4 text-muted-foreground" />
                                            Video
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {analytics?.summary?.totalVideos || 0}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {(analytics?.summary?.totalChannels || 0) > 0
                                                ? Math.round((analytics?.summary?.totalVideos || 0) / (analytics?.summary?.totalChannels || 1))
                                                : '0'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground mb-4">Không có dữ liệu phân tích</p>
                            <Button onClick={onRefresh} variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Tải dữ liệu
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
