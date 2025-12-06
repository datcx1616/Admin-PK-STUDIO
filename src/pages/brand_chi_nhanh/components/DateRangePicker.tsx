// src/pages/branch-analytics/components/DateRangePicker.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker({ startDate, endDate, onDateChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [tempStartDate, setTempStartDate] = React.useState<Date>(startDate);
    const [tempEndDate, setTempEndDate] = React.useState<Date>(endDate);
    const [selectingStart, setSelectingStart] = React.useState(true);

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        if (selectingStart) {
            setTempStartDate(date);
            setSelectingStart(false);
        } else {
            // Ensure end date is after start date
            if (date < tempStartDate) {
                setTempEndDate(tempStartDate);
                setTempStartDate(date);
            } else {
                setTempEndDate(date);
            }
            setSelectingStart(true);
        }
    };

    const handleApply = () => {
        onDateChange(tempStartDate, tempEndDate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setSelectingStart(true);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "gap-2 justify-start text-left font-normal",
                        "hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">
                        {format(startDate, "dd/MM/yyyy", { locale: vi })} - {format(endDate, "dd/MM/yyyy", { locale: vi })}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Chọn khoảng thời gian</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={cn(
                                "px-2 py-1 rounded",
                                selectingStart ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                Từ ngày: {format(tempStartDate, "dd/MM/yyyy", { locale: vi })}
                            </span>
                            <span>→</span>
                            <span className={cn(
                                "px-2 py-1 rounded",
                                !selectingStart ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                Đến ngày: {format(tempEndDate, "dd/MM/yyyy", { locale: vi })}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {selectingStart ? "Chọn ngày bắt đầu" : "Chọn ngày kết thúc"}
                        </p>
                    </div>

                    {/* Calendar */}
                    <Calendar
                        mode="single"
                        selected={selectingStart ? tempStartDate : tempEndDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                        initialFocus
                        locale={vi}
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleApply}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}