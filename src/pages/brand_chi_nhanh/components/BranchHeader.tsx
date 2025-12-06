// src/pages/branch-analytics/components/BranchHeader.tsx

import * as React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, RefreshCw, Download, Printer, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DateRangePicker } from "./DateRangePicker";

interface BranchHeaderProps {
    branchName: string;
    branchCode: string;
    totalChannels: number;
    channelNames: string[];
    selectedDays: number;
    onDaysChange: (days: number) => void;
    onRefresh: () => void;
    isLoading: boolean;
    // ✅ NEW: Date range props
    startDate: Date;
    endDate: Date;
    onCustomDateChange: (startDate: Date, endDate: Date) => void;
}

const dayOptions = [
    { label: "7 ngày", value: 7 },
    { label: "30 ngày", value: 30 },
    { label: "90 ngày", value: 90 },
    { label: "180 ngày", value: 180 },
];

export function BranchHeader({
    branchName,
    branchCode,
    totalChannels,
    channelNames,
    selectedDays,
    onDaysChange,
    onRefresh,
    isLoading,
    startDate,
    endDate,
    onCustomDateChange,
}: BranchHeaderProps) {
    return (
        <Card
            className="rounded-lg"
            style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
            }}
        >
            <CardHeader className="space-y-3">
                {/* First Row: Icon + Branch name + Code + Date range selector */}
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{branchName}</h1>
                            <Badge variant="secondary" className="mt-1">
                                Mã: {branchCode}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-col items-start min-w-[340px]">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Thời gian:</span>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-center gap-1 border rounded-md p-1">
                                {dayOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={selectedDays === option.value ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-8 px-3 text-sm"
                                        onClick={() => onDaysChange(option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={onCustomDateChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Second Row: Channels info + Action buttons */}
                <div className="flex items-center justify-between gap-6 text-sm text-muted-foreground">
                    {/* Channels list */}
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{totalChannels} kênh:</span>
                        {channelNames.length > 0 ? (
                            <div className="flex items-center gap-1">
                                {channelNames.slice(0, 3).map((name, idx) => (
                                    <span key={idx} className="text-foreground font-medium">
                                        {name}
                                        {idx < Math.min(channelNames.length, 3) - 1 && ', '}
                                    </span>
                                ))}
                                {channelNames.length > 3 && (
                                    <span className="text-muted-foreground">
                                        +{channelNames.length - 3} khác
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">Không có kênh</span>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                            Làm mới
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => toast.info('Chức năng xuất CSV đang được phát triển')}
                        >
                            <Download className="h-4 w-4" />
                            Xuất CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4" />
                            In/PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}