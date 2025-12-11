// src/lib/users-api.ts

import type {
  User,
  UserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  AssignBranchRequest,
  ChangeRoleRequest,
  UserFilters,
  UsersResponse,
  UserResponse,
  UserActionResponse,
} from '@/types/user.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get authorization headers
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.message || error.error || 'Request failed');
  }
  return response.json();
}

/**
 * Users API Client
 */
export const usersAPI = {
  /**
   * GET /api/users
   * Get all users (with optional filters)
   * Permission: Admin, Director, Branch Director, Manager
   */
  async getAll(filters?: UserFilters): Promise<User[]> {
    const queryParams = new URLSearchParams();
    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.branchId) queryParams.append('branchId', filters.branchId);
    if (filters?.teamId) queryParams.append('teamId', filters.teamId);
    if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
    if (filters?.searchQuery) queryParams.append('search', filters.searchQuery);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    console.log('🔄 [UsersAPI] Fetching users with filters:', filters);
    console.log('🔗 [UsersAPI] API URL:', `${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<UsersResponse>(response);

    console.log('✅ [UsersAPI] Response:', data);
    console.log('📊 [UsersAPI] Total users returned:', (data.users || data.data || (Array.isArray(data) ? data : [])).length);

    // Handle different response formats
    return data.users || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/users/:id
   * Get user by ID with detailed info
   * Permission: Admin, Director, Branch Director
   */
  async getById(userId: string): Promise<UserDetail> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<UserResponse>(response);
    
    if (!data.user && !data.data) {
      throw new Error('User not found in response');
    }
    
    return data.user || data.data!;
  },

  /**
   * POST /api/users
   * Create new user
   * Permission: Admin only
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const payload: any = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role,
    };

    // Add optional fields
    if (userData.branchId) payload.branch = userData.branchId;
    if (userData.teamId) payload.team = userData.teamId;

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<UserActionResponse>(response);
    
    if (!data.user && !data.data) {
      throw new Error('User not found in response');
    }
    
    return data.user || data.data!;
  },

  /**
   * PUT /api/users/:id
   * Update user
   * Permission: Admin only
   */
  async update(userId: string, userData: UpdateUserRequest): Promise<User> {
    const payload: any = {};

    if (userData.name) payload.name = userData.name;
    if (userData.email) payload.email = userData.email;
    if (userData.role) payload.role = userData.role;
    if (userData.branchId !== undefined) payload.branch = userData.branchId;
    if (userData.teamId !== undefined) payload.team = userData.teamId;
    if (userData.isActive !== undefined) payload.isActive = userData.isActive;

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<UserActionResponse>(response);
    
    if (!data.user && !data.data) {
      throw new Error('User not found in response');
    }
    
    return data.user || data.data!;
  },

  /**
   * DELETE /api/users/:id
   * Delete user
   * Permission: Admin only
   */
  async delete(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<UserActionResponse>(response);
  },

  /**
   * PUT /api/users/:id/assign-branch
   * Assign user to branch
   * Permission: Admin only
   */
  async assignBranch(userId: string, branchData: AssignBranchRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/assign-branch`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(branchData),
    });

    const data = await handleResponse<UserActionResponse>(response);
    
    if (!data.user && !data.data) {
      throw new Error('User not found in response');
    }
    
    return data.user || data.data!;
  },

  /**
   * PUT /api/users/:id/change-role
   * Change user role
   * Permission: Admin only
   */
  async changeRole(userId: string, roleData: ChangeRoleRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/change-role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });

    const data = await handleResponse<UserActionResponse>(response);
    
    if (!data.user && !data.data) {
      throw new Error('User not found in response');
    }
    
    return data.user || data.data!;
  },

  /**
   * Helper: Get users by role
   */
  async getByRole(role: string): Promise<User[]> {
    return this.getAll({ role: role as any });
  },

  /**
   * Helper: Get users by branch
   */
  async getByBranch(branchId: string): Promise<User[]> {
    return this.getAll({ branchId });
  },

  /**
   * Helper: Get active users only
   */
  async getActive(): Promise<User[]> {
    return this.getAll({ isActive: true });
  },

  /**
   * Helper: Search users
   */
  async search(query: string): Promise<User[]> {
    return this.getAll({ searchQuery: query });
  },
};
