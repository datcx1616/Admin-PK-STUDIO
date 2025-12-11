// src/hooks/useChannelAnalytics.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { ChannelAnalyticsData } from '@/types/channel-analytics.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UseChannelAnalyticsOptions {
    channelId: string;
    startDate?: string;
    endDate?: string;
    autoFetch?: boolean;
}

export function useChannelAnalytics(options: UseChannelAnalyticsOptions) {
    const { channelId, autoFetch = true } = options;
    
    const [analytics, setAnalytics] = useState<ChannelAnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: options.endDate || new Date().toISOString().split('T')[0]
    });

    const fetchAnalytics = useCallback(async () => {
        if (!channelId) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                toast.error('Vui lòng đăng nhập lại');
                setLoading(false);
                return;
            }

            const params = new URLSearchParams({
                channelId,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });

            console.log('🔄 Fetching channel analytics:', `${API_BASE_URL}/youtube/analytics?${params}`);

            const response = await fetch(`${API_BASE_URL}/youtube/analytics?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    toast.error('Phiên đăng nhập hết hạn');
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Analytics data:', data);
            
            if (data.success) {
                setAnalytics(data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('❌ Error fetching analytics:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [channelId, dateRange]);

    useEffect(() => {
        if (autoFetch && channelId) {
            fetchAnalytics();
        }
    }, [autoFetch, channelId, fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        dateRange,
        setDateRange,
        refetch: fetchAnalytics
    };
}