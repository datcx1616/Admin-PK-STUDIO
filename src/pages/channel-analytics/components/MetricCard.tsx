// src/pages/channel-analytics/components/MetricCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";


interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    gradient?: string;
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, gradient }: MetricCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", gradient)}>
                <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
                <Icon className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent className="pt-4">
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
                {trend && (
                    <p className={cn(
                        "text-xs mt-2 font-medium",
                        trend.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                        {trend.value}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}