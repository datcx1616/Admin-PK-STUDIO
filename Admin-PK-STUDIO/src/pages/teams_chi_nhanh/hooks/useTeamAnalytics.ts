// src/pages/team-analytics/hooks/useTeamAnalytics.ts

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import type { TeamAnalyticsData } from '../types/team-analytics.types';

export interface UseTeamAnalyticsOptions {
    teamId: string;
    startDate?: string;
    endDate?: string;
    autoFetch?: boolean;
}

export function useTeamAnalytics(options: UseTeamAnalyticsOptions) {
    const { teamId, autoFetch = true } = options;
    
    const [analytics, setAnalytics] = useState<TeamAnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [dateRange, setDateRange] = useState({
        startDate: options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: options.endDate || new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (options.startDate && options.endDate) {
            setDateRange({
                startDate: options.startDate,
                endDate: options.endDate
            });
        }
    }, [options.startDate, options.endDate]);

    const fetchAnalytics = useCallback(async () => {
        if (!teamId) {
            console.warn('⚠️ No teamId provided');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [Team Analytics] Fetching:', {
                teamId,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });

            const data = await apiClient.getTeamAnalytics(teamId, {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });

            console.log('✅ [Team Analytics] Data received:', data);
            
            if (data.success) {
                setAnalytics(data);
                toast.success('Đã tải dữ liệu phân tích');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('❌ Error fetching team analytics:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(errorMessage);
            
            if (!errorMessage.includes('404')) {
                toast.error('Lỗi khi tải dữ liệu phân tích');
            }
        } finally {
            setLoading(false);
        }
    }, [teamId, dateRange.startDate, dateRange.endDate]);

    useEffect(() => {
        if (autoFetch && teamId) {
            console.log('🔄 Auto-fetching team analytics...');
            fetchAnalytics();
        }
    }, [autoFetch, teamId, dateRange.startDate, dateRange.endDate, fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        dateRange,
        setDateRange,
        refetch: fetchAnalytics
    };
}