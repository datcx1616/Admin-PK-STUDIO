// src/hooks/useBranches.ts
/**
 * Custom hook for managing branches
 * Provides CRUD operations and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { branchesAPI, type Branch, type BranchDetail, type CreateBranchRequest, type UpdateBranchRequest } from '@/lib/branches-api';
import { toast } from 'sonner';

export interface UseBranchesOptions {
  autoFetch?: boolean;
}

export interface UseBranchesReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  refetch: () => Promise<void>;
  getBranch: (branchId: string) => Promise<BranchDetail>;
  createBranch: (data: CreateBranchRequest) => Promise<Branch>;
  updateBranch: (branchId: string, data: UpdateBranchRequest) => Promise<Branch>;
  deleteBranch: (branchId: string) => Promise<void>;
  
  // Related data
  getBranchTeams: (branchId: string) => Promise<any[]>;
  getBranchChannels: (branchId: string) => Promise<any[]>;
  getBranchAnalytics: (branchId: string, startDate: string, endDate: string) => Promise<any>;
}

/**
 * Hook for managing branches
 */
export function useBranches(options: UseBranchesOptions = {}): UseBranchesReturn {
  const { autoFetch = true } = options;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all branches
   */
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await branchesAPI.getAll();
      setBranches(data);
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      const errorMessage = err.message || 'Failed to fetch branches';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchBranches();
    }
  }, [autoFetch, fetchBranches]);

  /**
   * Get single branch by ID
   */
  const getBranch = async (branchId: string): Promise<BranchDetail> => {
    try {
      return await branchesAPI.getById(branchId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch branch';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Create new branch
   */
  const createBranch = async (data: CreateBranchRequest): Promise<Branch> => {
    try {
      const branch = await branchesAPI.create(data);
      toast.success('Branch created successfully');
      await fetchBranches(); // Refresh list
      return branch;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create branch';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Update branch
   */
  const updateBranch = async (branchId: string, data: UpdateBranchRequest): Promise<Branch> => {
    try {
      const branch = await branchesAPI.update(branchId, data);
      toast.success('Branch updated successfully');
      await fetchBranches(); // Refresh list
      return branch;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update branch';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Delete branch
   */
  const deleteBranch = async (branchId: string): Promise<void> => {
    try {
      await branchesAPI.delete(branchId);
      toast.success('Branch deleted successfully');
      await fetchBranches(); // Refresh list
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete branch';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Get teams in branch
   */
  const getBranchTeams = async (branchId: string): Promise<any[]> => {
    try {
      return await branchesAPI.getTeams(branchId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch branch teams';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Get channels in branch
   */
  const getBranchChannels = async (branchId: string): Promise<any[]> => {
    try {
      return await branchesAPI.getChannels(branchId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch branch channels';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Get branch analytics
   */
  const getBranchAnalytics = async (
    branchId: string,
    startDate: string,
    endDate: string
  ): Promise<any> => {
    try {
      return await branchesAPI.getAnalytics(branchId, { startDate, endDate });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch branch analytics';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    branches,
    loading,
    error,
    
    // CRUD
    refetch: fetchBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch,
    
    // Related data
    getBranchTeams,
    getBranchChannels,
    getBranchAnalytics,
  };
}

/**
 * Hook for single branch
 */
export function useBranch(branchId: string) {
  const [branch, setBranch] = useState<BranchDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranch = useCallback(async () => {
    if (!branchId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await branchesAPI.getById(branchId);
      setBranch(data);
    } catch (err: any) {
      console.error('Error fetching branch:', err);
      const errorMessage = err.message || 'Failed to fetch branch';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchBranch();
  }, [fetchBranch]);

  return {
    branch,
    loading,
    error,
    refetch: fetchBranch,
  };
}