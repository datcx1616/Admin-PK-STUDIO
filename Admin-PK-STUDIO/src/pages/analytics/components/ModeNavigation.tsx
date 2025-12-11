import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AnalyticsMode = 'single' | 'aggregate' | 'compare' | 'branch' | 'team'

interface ModeNavigationProps {
    activeMode: AnalyticsMode
    onModeChange: (mode: AnalyticsMode) => void
}

const modes = [
    { id: 'single' as AnalyticsMode, icon: '📺', label: 'Theo Kênh' },
    { id: 'aggregate' as AnalyticsMode, icon: '📊', label: 'Tổng Hợp' },
    { id: 'compare' as AnalyticsMode, icon: '⚖️', label: 'So Sánh' },
    { id: 'branch' as AnalyticsMode, icon: '🏢', label: 'Chi Nhánh' },
    { id: 'team' as AnalyticsMode, icon: '👥', label: 'Nhóm' },
]

export function ModeNavigation({ activeMode, onModeChange }: ModeNavigationProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6 pt-4">
            {modes.map((mode) => (
                <Button

                    key={mode.id}
                    variant={activeMode === mode.id ? 'outline' : 'outline'}
                    className={cn(
                        "font-semibold",
                        activeMode === mode.id && "shadow-lg"
                    )}
                    onClick={() => onModeChange(mode.id)}
                >
                    <span className="mr-2">{mode.icon}</span>
                    {mode.label}
                </Button>
            ))}
        </div>
    )
}
