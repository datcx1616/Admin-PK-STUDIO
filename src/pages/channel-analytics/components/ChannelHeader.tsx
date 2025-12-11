// src/pages/channel-analytics/components/ChannelHeader.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Youtube, RefreshCw, Download, Printer, Calendar, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DateRangePicker } from "@/pages/brand_chi_nhanh/components/DateRangePicker";

interface ChannelHeaderProps {
    channel: {
        _id: string;
        name: string;
        thumbnailUrl?: string;
        customUrl?: string;
        isConnected?: boolean;
    };
    startDate: Date;
    endDate: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
    onRefresh: () => void;
    isLoading: boolean;
    quotaUsed?: number;
    processingTimeMs?: number;
    /** Ẩn DateRangePicker nếu được render ở header area */
    showDatePicker?: boolean;
}

export function ChannelHeader({
    channel,
    startDate,
    endDate,
    onDateChange,
    onRefresh,
    isLoading,
    quotaUsed,
    processingTimeMs,
    showDatePicker = true,
}: ChannelHeaderProps) {
    const handleExportCSV = () => {
        toast.info('Chức năng xuất CSV đang được phát triển');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 border border-gray-200/60 shadow-sm">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full translate-y-24 -translate-x-24" />

            <div className="relative p-5 space-y-4">
                {/* First Row: Channel Info + Date Range */}
                <div className="flex items-center justify-between gap-6">
                    {/* Left: Channel Info */}
                    <div className="flex items-center gap-4">
                        {/* Avatar with glow effect */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                            <Avatar className="relative h-14 w-14 rounded-xl border-2 border-white shadow-lg">
                                <AvatarImage src={channel?.thumbnailUrl} alt={channel?.name} />
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl">
                                    <Youtube className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-900">{channel?.name}</h1>
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                {channel?.customUrl && (
                                    <Badge
                                        variant="outline"
                                        className="bg-white/60 text-gray-600 border-gray-200 text-xs px-2 py-0"
                                    >
                                        {channel.customUrl}
                                    </Badge>
                                )}
                                <Badge
                                    className={cn(
                                        "text-xs px-2 py-0.5 border-0",
                                        channel?.isConnected
                                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    )}
                                >
                                    {channel?.isConnected ? "Connected" : "Disconnected"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right: Date Range Selector - Ẩn nếu showDatePicker = false */}
                    {showDatePicker && (
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={onDateChange}
                        />
                    )}
                </div>

                {/* Second Row: Metadata + Actions */}
                <div className="flex items-center justify-between gap-6 pt-3 border-t border-gray-200/60">
                    {/* Left: Date & Metadata */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        {(quotaUsed !== undefined || processingTimeMs !== undefined) && (
                            <>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1.5">
                                    {quotaUsed !== undefined && (
                                        <Badge variant="outline" className="bg-white/60 text-gray-500 border-gray-200 text-xs py-0 px-2">
                                            Quota: {quotaUsed}
                                        </Badge>
                                    )}
                                    {processingTimeMs !== undefined && (
                                        <Badge variant="outline" className="bg-white/60 text-gray-500 border-gray-200 text-xs py-0 px-2">
                                            {processingTimeMs}ms
                                        </Badge>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: Action buttons */}
                    <div className="flex items-center gap-2">
                        {channel?.customUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 gap-1.5"
                                onClick={() => window.open(`https://youtube.com/${channel.customUrl}`, '_blank')}
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                YouTube
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 gap-1.5"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                            Làm mới
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 gap-1.5"
                            onClick={handleExportCSV}
                        >
                            <Download className="h-3.5 w-3.5" />
                            CSV
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 gap-1.5"
                            onClick={handlePrint}
                        >
                            <Printer className="h-3.5 w-3.5" />
                            In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
