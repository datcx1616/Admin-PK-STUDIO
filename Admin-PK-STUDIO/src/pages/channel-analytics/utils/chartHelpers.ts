// src/pages/channel-analytics/utils/chartHelpers.ts

export const CHART_COLORS = {
    primary: 'hsl(var(--primary))',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    indigo: '#6366f1',
    teal: '#14b8a6',
    orange: '#f97316',
};

export const getChartColor = (index: number): string => {
    const colors = Object.values(CHART_COLORS);
    return colors[index % colors.length];
};

export const prepareTimeSeriesData = (data: any[], dateKey: string, valueKeys: string[]) => {
    return data.map(item => {
        const result: any = {
            date: new Date(item[dateKey]).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
        };
        valueKeys.forEach(key => {
            result[key] = item[key] || 0;
        });
        return result;
    });
};

export const calculateTrend = (current: number, previous: number): { value: string; isPositive: boolean } => {
    if (!previous || previous === 0) {
        return { value: "+0%", isPositive: true };
    }
    
    const change = ((current - previous) / previous) * 100;
    const isPositive = change >= 0;
    const sign = isPositive ? "+" : "";
    
    return {
        value: `${sign}${change.toFixed(1)}%`,
        isPositive
    };
};