// src/pages/branch-analytics/components/DateRangePicker.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ChevronRight, Clock, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
}

// Preset options
const presets = [
    {
        label: "Hôm nay",
        getValue: () => ({ from: new Date(), to: new Date() }),
    },
    {
        label: "Hôm qua",
        getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }),
    },
    {
        label: "7 ngày qua",
        getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    },
    {
        label: "30 ngày qua",
        getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    },
    {
        label: "90 ngày qua",
        getValue: () => ({ from: subDays(new Date(), 89), to: new Date() }),
    },
    {
        label: "Tháng này",
        getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }),
    },
    {
        label: "Tháng trước",
        getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }),
    },
    {
        label: "Năm nay",
        getValue: () => ({ from: startOfYear(new Date()), to: new Date() }),
    },
];

export function DateRangePicker({ startDate, endDate, onDateChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: startDate,
        to: endDate,
    });
    const [activePreset, setActivePreset] = React.useState<string | null>(null);

    // Sync with props
    React.useEffect(() => {
        setDateRange({ from: startDate, to: endDate });
    }, [startDate, endDate]);

    const handlePresetClick = (preset: typeof presets[0]) => {
        const range = preset.getValue();
        setDateRange(range);
        setActivePreset(preset.label);
    };

    const handleApply = () => {
        if (dateRange?.from && dateRange?.to) {
            onDateChange(dateRange.from, dateRange.to);
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setDateRange({ from: startDate, to: endDate });
        setActivePreset(null);
        setIsOpen(false);
    };

    // Calculate days difference
    const daysDiff = dateRange?.from && dateRange?.to
        ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className={cn(
                        "group relative overflow-hidden h-9 gap-2 justify-start text-left font-normal",
                        "bg-white/80 backdrop-blur-sm border-gray-200/60 hover:border-blue-300",
                        "hover:bg-[#F7F7F7]",
                        "transition-all duration-300"
                    )}
                >
                    <CalendarIcon className="h-3.5 w-3.5 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xs font-medium text-gray-700">
                        {format(endDate, "dd MMM", { locale: vi })}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-400 ml-auto transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 border-gray-200/60 shadow-xl rounded-xl overflow-hidden"
                align="end"
                sideOffset={8}
            >
                <div className="flex">
                    {/* Left: Presets */}
                    <div className="w-44 bg-gradient-to-b from-slate-50 to-gray-50 border-r border-gray-200/60 p-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-semibold text-gray-700">Chọn nhanh</span>
                        </div>
                        <div className="space-y-1">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-200",
                                        activePreset === preset.label
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                                    )}
                                >
                                    <span>{preset.label}</span>
                                    {activePreset === preset.label && (
                                        <Check className="h-3 w-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Calendar */}
                    <div className="p-4">
                        {/* Header showing selected range */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">Khoảng thời gian đã chọn</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md shadow-sm">
                                        {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy", { locale: vi }) : "---"}
                                    </span>
                                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md shadow-sm">
                                        {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy", { locale: vi }) : "---"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg">
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-700">{daysDiff} ngày</span>
                            </div>
                        </div>

                        {/* Dual Calendar */}
                        <div className="flex gap-4">
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                                locale={vi}
                                classNames={{
                                    months: "flex gap-4",
                                    month: "space-y-3",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-semibold text-gray-800",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: cn(
                                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                        "hover:bg-blue-50 rounded-md transition-colors"
                                    ),
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex",
                                    head_cell: "text-gray-500 rounded-md w-8 font-medium text-[0.7rem]",
                                    row: "flex w-full mt-1",
                                    cell: cn(
                                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                        "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                                    ),
                                    day: cn(
                                        "h-8 w-8 p-0 font-normal text-xs",
                                        "hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors",
                                        "aria-selected:opacity-100"
                                    ),
                                    day_range_start: "day-range-start bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-l-md hover:from-blue-600 hover:to-blue-700",
                                    day_range_end: "day-range-end bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-r-md hover:from-indigo-600 hover:to-purple-600",
                                    day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                                    day_today: "bg-amber-100 text-amber-900 font-semibold",
                                    day_outside: "text-gray-300 opacity-50",
                                    day_disabled: "text-gray-300 opacity-50",
                                    day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-700 rounded-none",
                                    day_hidden: "invisible",
                                }}
                            />
                        </div>

                        <Separator className="my-4" />

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Nhấp để chọn ngày bắt đầu và kết thúc
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancel}
                                    className="h-8 px-3 text-xs text-gray-600 hover:text-gray-900"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleApply}
                                    disabled={!dateRange?.from || !dateRange?.to}
                                    className="h-8 px-4 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm"
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}