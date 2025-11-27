// lib/teams-api.ts
import { apiClient } from './api-client';

export interface Team {
  _id: string;
  name: string;
  description: string;
  branch: {
    _id: string;
    name: string;
    code?: string;
  };
  leader?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  members?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  channels?: Array<{
    _id: string;
    name: string;
    youtubeChannelId: string;
    subscriberCount?: number;
    isConnected: boolean;
  }>;
  membersCount?: number;
  channelsCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  branchId: string;
  leaderId?: string;
  memberIds?: string[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  leaderId?: string;
}

export interface TeamOverview {
  team: Team;
  statistics: {
    totalMembers: number;
    totalChannels: number;
    totalVideos: number;
    totalSubscribers: number;
    totalViews: number;
  };
  recentVideos: Array<{
    _id: string;
    title: string;
    status: string;
    channel: any;
    createdAt: string;
  }>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const teamsAPI = {
  /**
   * Get all teams
   */
  async getAll(params?: { branchId?: string; leaderId?: string }): Promise<Team[]> {
    const queryParams = new URLSearchParams();
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.leaderId) queryParams.append('leaderId', params.leaderId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/teams?${queryString}` : '/teams';

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch teams');
    }

    const data = await response.json();
    return data.teams || data.data || data || [];
  },

  /**
   * Get team by ID
   */
  async getById(teamId: string): Promise<Team> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch team');
    }

    const data = await response.json();
    return data.team || data.data || data;
  },

  /**
   * Get team overview with statistics
   */
  async getOverview(teamId: string): Promise<TeamOverview> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/overview`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch team overview');
    }

    return await response.json();
  },

  /**
   * Create new team
   */
  async create(data: CreateTeamRequest): Promise<Team> {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        branch: data.branchId,
        leader: data.leaderId,
        members: data.memberIds || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create team');
    }

    const result = await response.json();
    return result.team || result.data || result;
  },

  /**
   * Update team
   */
  async update(teamId: string, data: UpdateTeamRequest): Promise<Team> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        leader: data.leaderId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update team');
    }

    const result = await response.json();
    return result.team || result.data || result;
  },

  /**
   * Delete team
   */
  async delete(teamId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete team');
    }
  },

  /**
   * Add member to team
   */
  async addMember(teamId: string, userId: string): Promise<Team> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add member');
    }

    const result = await response.json();
    return result.team || result.data || result;
  },

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove member');
    }
  },
};