// src/pages/branch-analytics/hooks/useBranchAnalytics.ts

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { BranchAnalyticsData } from '../types/branch-analytics.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface UseBranchAnalyticsOptions {
    branchId: string;
    dateRange: DateRange;
    autoFetch?: boolean;
}

export function useBranchAnalytics(options: UseBranchAnalyticsOptions) {
    const { branchId, dateRange, autoFetch = true } = options;
    
    const [analytics, setAnalytics] = useState<BranchAnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!branchId) {
            console.warn('⚠️ No branchId provided');
            return;
        }

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
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });

            console.log('🔄 Fetching analytics:', {
                branchId,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                url: `${API_BASE_URL}/youtube/analytics/branch/${branchId}?${params}`
            });

            const response = await fetch(
                `${API_BASE_URL}/youtube/analytics/branch/${branchId}?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }
                
                if (response.status === 404) {
                    console.warn('⚠️ No analytics data found (404)');
                    setError('Chưa có dữ liệu analytics');
                    setAnalytics(null);
                    setLoading(false);
                    return;
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Analytics data received:', data);
            
            if (data.success) {
                setAnalytics(data);
                toast.success('Đã tải dữ liệu analytics');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('❌ Error fetching analytics:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(errorMessage);
            
            // Only show toast if it's not a 404
            if (!errorMessage.includes('404')) {
                toast.error('Lỗi khi tải dữ liệu analytics');
            }
        } finally {
            setLoading(false);
        }
    }, [branchId, dateRange.startDate, dateRange.endDate]);

    // ✅ FIX: Auto refetch khi dateRange thay đổi
    useEffect(() => {
        if (autoFetch && branchId) {
            console.log('🔄 Auto-fetching due to dateRange change:', dateRange);
            fetchAnalytics();
        }
    }, [autoFetch, branchId, dateRange.startDate, dateRange.endDate, fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics
    };
}