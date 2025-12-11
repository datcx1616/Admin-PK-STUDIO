

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, Youtube, Calendar, Sparkles } from "lucide-react";

interface BranchHeaderProps {
    branchName: string;
    branchCode: string;
    totalChannels: number;
    channelNames: string[];
    startDate: Date;
    endDate: Date;
}

export function BranchHeader({
    branchName,
    branchCode,
    totalChannels,
    channelNames,
    startDate,
    endDate,
}: BranchHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 border border-gray-200/60 shadow-sm">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full translate-y-24 -translate-x-24" />

            <div className="relative p-5">
                <div className="flex items-center justify-between gap-6">
                    {/* Left: Branch Info */}
                    <div className="flex items-center gap-4">
                        {/* Icon with gradient background */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity" />
                            <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-900">{branchName}</h1>
                                <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs px-2 py-0.5">
                                    {branchCode}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Youtube className="h-3.5 w-3.5 text-red-500" />
                                    <span className="font-medium text-gray-700">{totalChannels}</span>
                                    <span>kênh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Date range info + Channel names */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        {channelNames.length > 0 && (
                            <>
                                <span className="text-gray-300">|</span>
                                <div className="flex items-center gap-1.5 text-xs">
                                    {channelNames.slice(0, 2).map((name, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="bg-white/60 text-gray-700 border-gray-200 text-xs py-0 px-2"
                                        >
                                            {name}
                                        </Badge>
                                    ))}
                                    {channelNames.length > 2 && (
                                        <Badge
                                            variant="outline"
                                            className="bg-gray-100/80 text-gray-500 border-gray-200 text-xs py-0 px-2"
                                        >
                                            +{channelNames.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}