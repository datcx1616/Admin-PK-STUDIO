// src/pages/teams_chi_nhanh/components/TeamHeader.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, Download, Printer, Youtube, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/pages/brand_chi_nhanh/components/DateRangePicker";

interface TeamHeaderProps {
    teamName: string;
    totalChannels: number;
    channels: Array<{ id: string; name: string }>;
    onRefresh: () => void;
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
    onExport?: () => void;
    onPrint?: () => void;
<<<<<<< HEAD
    /** Ẩn DateRangePicker nếu được render ở header area */
    showDatePicker?: boolean;
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
}

export function TeamHeader({
    teamName,
    totalChannels,
    channels,
    onRefresh,
    isLoading,
    startDate,
    endDate,
    onDateChange,
    onExport,
    onPrint,
<<<<<<< HEAD
    showDatePicker = true,
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
}: TeamHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 border border-gray-200/60 shadow-sm">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full translate-y-24 -translate-x-24" />

            <div className="relative p-5 space-y-4">
                {/* First Row: Team Info + Date Range */}
                <div className="flex items-center justify-between gap-6">
                    {/* Left: Team Info */}
                    <div className="flex items-center gap-4">
                        {/* Icon with gradient background */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                            <div className="relative p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-900">{teamName}</h1>
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 text-xs px-2 py-0.5">
                                    Team
                                </Badge>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Youtube className="h-3.5 w-3.5 text-red-500" />
                                    <span className="font-medium text-gray-700">{totalChannels}</span>
                                    <span>kênh</span>
                                </div>
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
                    {/* Right: Date Range Selector - Ẩn nếu showDatePicker = false */}
                    {showDatePicker && (
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={onDateChange}
                        />
                    )}
=======
                    {/* Right: Date Range Selector */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={onDateChange}
                    />
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
                </div>

                {/* Second Row: Channels List + Actions */}
                <div className="flex items-center justify-between gap-6 pt-3 border-t border-gray-200/60">
                    {/* Left: Channel names */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <span className="text-gray-300">|</span>
                        {channels.length > 0 ? (
                            <div className="flex items-center gap-1.5 text-xs">
                                {channels.slice(0, 2).map((channel, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-white/60 text-gray-700 border-gray-200 text-xs py-0 px-2"
                                    >
                                        {channel.name}
                                    </Badge>
                                ))}
                                {channels.length > 2 && (
                                    <Badge
                                        variant="outline"
                                        className="bg-gray-100/80 text-gray-500 border-gray-200 text-xs py-0 px-2"
                                    >
                                        +{channels.length - 2}
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">Chưa có kênh</span>
                        )}
                    </div>

                    {/* Right: Action buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 gap-1.5"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                            Làm mới
                        </Button>
                        {onExport && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 gap-1.5"
                                onClick={onExport}
                            >
                                <Download className="h-3.5 w-3.5" />
                                CSV
                            </Button>
                        )}
                        {onPrint && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 gap-1.5"
                                onClick={onPrint}
                            >
                                <Printer className="h-3.5 w-3.5" />
                                In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
