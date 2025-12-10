import { Monitor } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { AnalyticsResponse } from "./types"
import { formatNumber, getDeviceIcon } from "./utils"

interface DeviceTypesProps {
    analytics: AnalyticsResponse
}

export function DeviceTypes({ analytics }: DeviceTypesProps) {
    if (!analytics.devices || analytics.devices.types.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-green-600" />
                    Device Types
                </CardTitle>
                <CardDescription>Top device: {analytics.devices?.topDevice}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {analytics.devices.types.map((device, index) => {
                        const Icon = getDeviceIcon(device.deviceType)
                        return (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <Icon className="h-4 w-4 text-gray-600" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {device.deviceType}
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                {formatNumber(device.views)} views • {formatNumber(device.watchTimeMinutes)} mins
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{device.percentage.toFixed(1)}%</span>
                                </div>
                                <Progress value={device.percentage} className="h-2" />
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
