import axiosInstance from './axios-instance';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Branch interfaces
 */
export interface Branch {
  _id: string;
  name: string;
  code?: string;
  description: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  teamsCount?: number;
  channelsCount?: number;
  director?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface BranchDetail extends Branch {
  teams?: Array<{
    _id: string;
    name: string;
    membersCount: number;
    description?: string;
  }>;
  channels?: Array<{
    _id: string;
    name: string;
    subscriberCount?: number;
    youtubeChannelId: string;
  }>;
}

export interface CreateBranchRequest {
  name: string;
  code?: string;
  description: string;
  location?: string;
  director?: string;
}

export interface UpdateBranchRequest {
  name?: string;
  description?: string;
  location?: string;
  isActive?: boolean;
  director?: string;
}

export interface BranchAnalytics {
  branch: {
    _id: string;
    name: string;
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
  };
}

export interface BranchesResponse {
  success?: boolean;
  branches?: Branch[];
  data?: Branch[];
}

export interface BranchResponse {
  success?: boolean;
  branch?: BranchDetail;
  data?: BranchDetail;
}

export interface BranchActionResponse {
  success?: boolean;
  message: string;
  branch?: Branch;
  data?: Branch;
}

/**
 * Branches API Client
 */
export const branchesAPI = {
  /**
   * GET /api/branches
   * Get all branches
   * Permission: Admin, Director, Branch Director
   */
  async getAll(): Promise<Branch[]> {
   const response = await axiosInstance.get(`${API_BASE_URL}/branches`);
   const data = response.data;
    return data.branches || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/branches/:branchId
   * Get branch by ID with detailed info
   * Permission: Admin, Director, Branch Director (own only)
   */
  async getById(branchId: string): Promise<BranchDetail> {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<BranchResponse>(response);
    
    if (!data.branch && !data.data) {
      throw new Error('Branch not found in response');
    }
    
    return data.branch || data.data!;
  },

  /**
   * POST /api/branches
   * Create new branch
   * Permission: Admin, Director
   */
  async create(branchData: CreateBranchRequest): Promise<Branch> {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(branchData),
    });

    const data = await handleResponse<BranchActionResponse>(response);
    
    if (!data.branch && !data.data) {
      throw new Error('Branch not found in response');
    }
    
    return data.branch || data.data!;
  },

  /**
   * PUT /api/branches/:branchId
   * Update branch
   * Permission: Admin, Director
   */
  async update(branchId: string, branchData: UpdateBranchRequest): Promise<Branch> {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(branchData),
    });

    const data = await handleResponse<BranchActionResponse>(response);
    
    if (!data.branch && !data.data) {
      throw new Error('Branch not found in response');
    }
    
    return data.branch || data.data!;
  },

  /**
   * DELETE /api/branches/:branchId
   * Delete branch
   * Permission: Admin only
   */
  async delete(branchId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<BranchActionResponse>(response);
  },

  /**
   * GET /api/branches/:branchId/teams
   * Get teams in branch
   * Permission: Admin, Director, Branch Director (own only)
   */
  async getTeams(branchId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}/teams`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<any>(response);
    return data.teams || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/branches/:branchId/channels
   * Get channels in branch
   * Permission: Admin, Director, Branch Director (own only)
   */
  async getChannels(branchId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}/channels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<any>(response);
    return data.channels || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/branches/:branchId/analytics
   * Get branch analytics
   * Permission: Admin, Director, Branch Director (own only)
   */
  async getAnalytics(
    branchId: string,
    params: { startDate: string; endDate: string }
  ): Promise<BranchAnalytics> {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(
      `${API_BASE_URL}/branches/${branchId}/analytics?${queryParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse<BranchAnalytics>(response);
  },
};