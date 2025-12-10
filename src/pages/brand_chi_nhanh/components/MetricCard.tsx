// src/pages/branch-analytics/components/MetricCard.tsx

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface MetricCardProps {
    icon: LucideIcon;
    title: string;
    value: string;
    subtitle?: string;
    gradient: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    gradient,
    trend
}: MetricCardProps) {
    return (
        <Card className={cn("relative overflow-hidden border-0 shadow-lg", gradient)}>
            <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                    <Icon className="h-6 w-6 opacity-80" />
                    {trend && (
                        <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            trend.isPositive ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium opacity-90">{title}</p>
                <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
                {subtitle && (
                    <p className="text-xs opacity-75 mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}