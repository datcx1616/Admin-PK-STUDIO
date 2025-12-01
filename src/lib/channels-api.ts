// src/lib/channels-api.ts
/**
 * Channel API Client
 * Implements all endpoints from API 4.5 Channel APIs
 */

import type {
  Channel,
  ChannelDetail,
  CreateChannelRequest,
  UpdateChannelRequest,
  AssignEditorRequest,
  MoveChannelRequest,
  ChannelFilters,
  ChannelsResponse,
  ChannelResponse,
  ChannelActionResponse,
  CheckTeamResponse,
} from '@/types/channel.types';

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
 * Channels API Client
 */
export const channelsAPI = {
  /**
   * GET /api/channels
   * Get all channels
   * Permission: All authenticated users
   */
  async getAll(filters?: ChannelFilters): Promise<Channel[]> {
    const queryParams = new URLSearchParams();
    
    if (filters?.teamId) queryParams.append('teamId', filters.teamId);
    if (filters?.branchId) queryParams.append('branchId', filters.branchId);
    if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
    if (filters?.isConnected !== undefined) queryParams.append('isConnected', String(filters.isConnected));
    if (filters?.searchQuery) queryParams.append('search', filters.searchQuery);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/channels?${queryString}` : '/channels';

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelsResponse>(response);
    return data.channels || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/channels/my-channels
   * Get channels assigned to current user
   * Permission: All authenticated users
   */
  async getMyChannels(): Promise<Channel[]> {
    const response = await fetch(`${API_BASE_URL}/channels/my-channels`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelsResponse>(response);
    return data.channels || data.data || (Array.isArray(data) ? data : []);
  },

  /**
   * GET /api/channels/:id
   * Get channel by ID
   * Permission: All authenticated users
   */
  async getById(channelId: string): Promise<ChannelDetail> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * GET /api/channels/:id/detail
   * Get channel detail with analytics
   * Permission: All authenticated users
   */
  async getDetail(channelId: string): Promise<ChannelDetail> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/detail`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * POST /api/channels
   * Create new channel
   * Permission: All authenticated users
   */
  async create(channelData: CreateChannelRequest): Promise<Channel> {
    const response = await fetch(`${API_BASE_URL}/channels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(channelData),
    });

    const data = await handleResponse<ChannelActionResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * PUT /api/channels/:id
   * Update channel
   * Permission: Admin, Director, Branch Director, Manager, Editor (assigned)
   */
  async update(channelId: string, channelData: UpdateChannelRequest): Promise<Channel> {
    console.log('🔄 [API] Updating channel:', channelId);
    console.log('📤 [API] Update data:', channelData);
    console.log('🔗 [API] URL:', `${API_BASE_URL}/channels/${channelId}`);
    
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(channelData),
    });

    console.log('📡 [API] Response status:', response.status);

    const data = await handleResponse<ChannelActionResponse>(response);
    
    console.log('✅ [API] Response data:', data);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    const updatedChannel = data.channel || data.data!;
    console.log('📊 [API] Updated channel team:', updatedChannel.team);
    
    return updatedChannel;
  },

  /**
   * DELETE /api/channels/:id
   * Delete channel (soft delete)
   * Permission: Admin, Director, Branch Director
   */
  async delete(channelId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ChannelActionResponse>(response);
  },

  /**
   * POST /api/channels/:id/assign
   * Assign editor to channel
   * Permission: Admin, Director, Branch Director, Manager
   */
  async assignEditor(channelId: string, editorData: AssignEditorRequest): Promise<Channel> {
    console.log('🔄 [API] Assigning editor:', { channelId, userId: editorData.userId });
    
    const requestBody = {
      userId: editorData.userId
      // Backend only expects userId, not role
    };
    
    console.log('📤 [API] Request body:', requestBody);
    console.log('🔗 [API] URL:', `${API_BASE_URL}/channels/${channelId}/assign`);
    
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    console.log('📡 [API] Response status:', response.status);
    
    const data = await handleResponse<ChannelActionResponse>(response);
    
    console.log('✅ [API] Response data:', data);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * DELETE /api/channels/:id/members/:userId
   * Remove editor from channel
   * Permission: Admin, Director, Branch Director, Manager
   */
  async removeEditor(channelId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/members/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse<ChannelActionResponse>(response);
  },

  /**
   * PATCH /api/channels/:id/move
   * Move channel to another team
   * Permission: Admin, Director, Branch Director
   */
  async moveToTeam(channelId: string, moveData: MoveChannelRequest): Promise<Channel> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/move`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(moveData),
    });

    const data = await handleResponse<ChannelActionResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * POST /api/channels/:id/unassign
   * Unassign channel from team
   * Permission: Admin, Director, Branch Director
   */
  async unassignFromTeam(channelId: string): Promise<Channel> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/unassign`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelActionResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * POST /api/channels/:id/restore
   * Restore deleted channel
   * Permission: Admin only
   */
  async restore(channelId: string): Promise<Channel> {
    const response = await fetch(`${API_BASE_URL}/channels/${channelId}/restore`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<ChannelActionResponse>(response);
    
    if (!data.channel && !data.data) {
      throw new Error('Channel not found in response');
    }
    
    return data.channel || data.data!;
  },

  /**
   * POST /api/channels/check-team
   * Check if user has teams
   * Permission: All authenticated users
   */
  async checkTeam(): Promise<CheckTeamResponse> {
    const response = await fetch(`${API_BASE_URL}/channels/check-team`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return handleResponse<CheckTeamResponse>(response);
  },

  /**
   * Helper: Get channels by team
   */
  async getByTeam(teamId: string): Promise<Channel[]> {
    return this.getAll({ teamId });
  },

  /**
   * Helper: Get channels by branch
   */
  async getByBranch(branchId: string): Promise<Channel[]> {
    return this.getAll({ branchId });
  },

  /**
   * Helper: Get active channels only
   */
  async getActive(): Promise<Channel[]> {
    return this.getAll({ isActive: true });
  },

  /**
   * Helper: Get connected channels only
   */
  async getConnected(): Promise<Channel[]> {
    return this.getAll({ isConnected: true });
  },

  /**
   * Helper: Search channels
   */
  async search(query: string): Promise<Channel[]> {
    return this.getAll({ searchQuery: query });
  },
};