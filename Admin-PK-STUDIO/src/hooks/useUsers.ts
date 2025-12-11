// src/hooks/useUsers.ts

import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '@/lib/users-api';
import type {
  User,
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  AssignBranchRequest,
  ChangeRoleRequest,
  UserFilters,
  UserStats,
} from '@/types/user.types';
import { toast } from 'sonner';

export interface UseUsersOptions {
  filters?: UserFilters;
  autoFetch?: boolean;
}

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  stats: UserStats;
  
  // CRUD operations
  refetch: () => Promise<void>;
  getUser: (userId: string) => Promise<UserDetail>;
  createUser: (data: CreateUserRequest) => Promise<User>;
  updateUser: (userId: string, data: UpdateUserRequest) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Special operations
  assignBranch: (userId: string, branchId: string) => Promise<User>;
  changeRole: (userId: string, role: string) => Promise<User>;
  
  // Utility methods
  searchUsers: (query: string) => void;
  filterByRole: (role: string) => void;
  filterByBranch: (branchId: string) => void;
}

/**
 * Hook for managing users
 */
export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { filters, autoFetch = true } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<UserFilters>(filters || {});
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admin: 0,
    director: 0,
    branch_director: 0,
    manager: 0,
    editor: 0,
    active: 0,
    inactive: 0,
  });

  /**
   * Calculate statistics from users
   */
  const calculateStats = useCallback((userList: User[]): UserStats => {
    return {
      total: userList.length,
      admin: userList.filter(u => u.role === 'admin').length,
      director: userList.filter(u => u.role === 'director').length,
      branch_director: userList.filter(u => u.role === 'branch_director').length,
      manager: userList.filter(u => u.role === 'manager').length,
      editor: userList.filter(u => u.role === 'editor').length,
      active: userList.filter(u => u.isActive).length,
      inactive: userList.filter(u => !u.isActive).length,
    };
  }, []);

  /**
   * Fetch users
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await usersAPI.getAll(currentFilters);
      setUsers(data);
      setStats(calculateStats(data));
    } catch (err: any) {
      console.error('Error fetching users:', err);
      const errorMessage = err.message || 'Failed to fetch users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, calculateStats]);

  /**
   * Auto-fetch on mount and when filters change
   */
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  /**
   * Get single user by ID
   */
  const getUser = async (userId: string): Promise<UserDetail> => {
    try {
      return await usersAPI.getById(userId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Create new user
   */
  const createUser = async (data: CreateUserRequest): Promise<User> => {
    try {
      const user = await usersAPI.create(data);
      toast.success('User created successfully');
      await fetchUsers(); // Refresh list
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create user';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Update user
   */
  const updateUser = async (userId: string, data: UpdateUserRequest): Promise<User> => {
    try {
      const user = await usersAPI.update(userId, data);
      toast.success('User updated successfully');
      await fetchUsers(); // Refresh list
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      await usersAPI.delete(userId);
      toast.success('User deleted successfully');
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete user';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Assign branch to user
   */
  const assignBranch = async (userId: string, branchId: string): Promise<User> => {
    try {
      const user = await usersAPI.assignBranch(userId, { branchId });
      toast.success('Branch assigned successfully');
      await fetchUsers(); // Refresh list
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign branch';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Change user role
   */
  const changeRole = async (userId: string, role: string): Promise<User> => {
    try {
      const user = await usersAPI.changeRole(userId, { role: role as any });
      toast.success('Role changed successfully');
      await fetchUsers(); // Refresh list
      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to change role';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Search users
   */
  const searchUsers = (query: string) => {
    setCurrentFilters(prev => ({ ...prev, searchQuery: query }));
  };

  /**
   * Filter by role
   */
  const filterByRole = (role: string) => {
    setCurrentFilters(prev => ({ ...prev, role: role as any }));
  };

  /**
   * Filter by branch
   */
  const filterByBranch = (branchId: string) => {
    setCurrentFilters(prev => ({ ...prev, branchId }));
  };

  return {
    users,
    loading,
    error,
    stats,
    
    // CRUD
    refetch: fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    
    // Special operations
    assignBranch,
    changeRole,
    
    // Utilities
    searchUsers,
    filterByRole,
    filterByBranch,
  };
}

/**
 * Hook for single user
 */
export function useUser(userId: string) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await usersAPI.getById(userId);
      setUser(data);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      const errorMessage = err.message || 'Failed to fetch user';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
