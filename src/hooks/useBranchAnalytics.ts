// src/hooks/useBranchAnalytics.ts
/**
 * Custom hook for fetching and managing branch analytics
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface BranchAnalytics {
    branch: {
        _id: string;
        name: string;
        code?: string;
    };
    summary: {
        totalChannels: number;
        totalTeams: number;
        totalSubscribers: number;
        totalViews: number;
        totalVideos: number;
    };
    analytics: {
        views: number;
        watchTime: number;
        estimatedRevenue: number;
        subscribersGained: number;
        subscribersLost?: number;
        subscribersNet?: number;
        likes?: number;
        comments?: number;
        shares?: number;
        averageViewDuration?: number;
        engagementRate?: number;
    };
    dailyBreakdown?: Array<{
        date: string;
        views: number;
        watchTime: number;
        subscribersGained: number;
        subscribersLost?: number;
    }>;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface UseBranchAnalyticsOptions {
    branchId: string;
    dateRange?: DateRange;
    autoFetch?: boolean;
}

export interface UseBranchAnalyticsReturn {
    analytics: BranchAnalytics | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    setDateRange: (range: DateRange) => void;
}

/**
 * Hook for managing branch analytics
 */
export function useBranchAnalytics(options: UseBranchAnalyticsOptions): UseBranchAnalyticsReturn {
    const { branchId, autoFetch = true } = options;

    const [analytics, setAnalytics] = useState<BranchAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>(
        options.dateRange || {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
        }
    );

    /**
     * Fetch analytics data
     */
    const fetchAnalytics = useCallback(async () => {
        if (!branchId) return;

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 [useBranchAnalytics] Fetching analytics for branch:', branchId);
            console.log('📅 [useBranchAnalytics] Date range:', dateRange);

            const data = await apiClient.getBranchAnalytics(branchId, dateRange);
            
            console.log('✅ [useBranchAnalytics] Analytics data received:', data);
            
            setAnalytics(data);
        } catch (err: any) {
            console.error('❌ [useBranchAnalytics] Error fetching analytics:', err);
            const errorMessage = err.message || 'Failed to fetch branch analytics';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [branchId, dateRange]);

    /**
     * Auto-fetch on mount and when dependencies change
     */
    useEffect(() => {
        if (autoFetch && branchId) {
            fetchAnalytics();
        }
    }, [autoFetch, branchId, fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics,
        setDateRange,
    };
}

/**
 * Hook for fetching teams with analytics
 */
export function useBranchTeams(branchId: string) {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        if (!branchId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await apiClient.getTeams({ branchId });
            const teamsList = data.teams || data.data || data || [];
            setTeams(teamsList);
        } catch (err: any) {
            console.error('Error fetching teams:', err);
            const errorMessage = err.message || 'Failed to fetch teams';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    return {
        teams,
        loading,
        error,
        refetch: fetchTeams,
    };
}

/**
 * Hook for fetching channels with analytics
 */
export function useBranchChannels(branchId: string) {
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChannels = useCallback(async () => {
        if (!branchId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await apiClient.getChannelsForAnalytics({ branchId });
            const channelsList = data.channels || data.data || data || [];
            setChannels(channelsList);
        } catch (err: any) {
            console.error('Error fetching channels:', err);
            const errorMessage = err.message || 'Failed to fetch channels';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    return {
        channels,
        loading,
        error,
        refetch: fetchChannels,
    };
}