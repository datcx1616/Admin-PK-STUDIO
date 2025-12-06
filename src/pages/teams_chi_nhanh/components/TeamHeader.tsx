import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Calendar,
    RefreshCw,
    Download,
    Printer,
    Youtube
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamHeaderProps {
    teamName: string;
    totalChannels: number;
    channels: Array<{ id: string; name: string }>;
    selectedDays: number;
    startDate: Date;
    endDate: Date;
    loading: boolean;
    onDaysChange: (days: number) => void;
    onCustomDateChange: (start: Date, end: Date) => void;
    onRefresh: () => void;
    onExport: () => void;
    onPrint: () => void;
}

const dayOptions = [
    { label: "7 ngày", value: 7 },
    { label: "30 ngày", value: 30 },
    { label: "90 ngày", value: 90 },
    { label: "180 ngày", value: 180 },
];

export function TeamHeader({
    teamName,
    totalChannels,
    channels,

    selectedDays,
    loading,
    onDaysChange,
    onRefresh,
    onExport,
    onPrint
}: TeamHeaderProps) {
    return (
        <Card className=" rounded-lg shadow-sm"
            style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
            }}>
            <CardHeader className="space-y-4">
                {/* Row 1: Team Info + Actions */}
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Team info */}
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">{teamName}</h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="gap-1.5">
                                    <Youtube className="h-3 w-3" />
                                    {totalChannels} kênh
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={loading}
                            className="gap-2 hover:bg-accent"
                        >
                            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                            <span className="hidden sm:inline">Làm mới</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onExport}
                            className="gap-2 hover:bg-accent"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">CSV</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPrint}
                            className="gap-2 hover:bg-accent"
                        >
                            <Printer className="h-4 w-4" />
                            <span className="hidden sm:inline">In</span>
                        </Button>
                    </div>
                </div>

                {/* Row 2: Channels + Date Controls */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t"
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                    }}>
                    {/* Left: Channel names */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Kênh:</span>
                        {channels.length <= 2 ? (
                            <span className="font-medium">
                                {channels.map(ch => ch.name).join(', ')}
                            </span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate max-w-[200px]">
                                    {channels[0].name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    +{channels.length - 1}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Right: Date controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            Khoảng thời gian:
                        </span>

                        {/* Preset buttons */}
                        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                            {dayOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={selectedDays === option.value ? "default" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "h-8 px-3 text-xs font-medium transition-all",
                                        selectedDays === option.value
                                            ? " text-primary-foreground shadow-sm"
                                            : "hover:bg-background"
                                    )}
                                    onClick={() => onDaysChange(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}