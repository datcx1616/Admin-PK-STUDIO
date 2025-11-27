// types/teams.types.ts
/**
 * Types and Interfaces for Teams Management
 */

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
    viewCount?: number;
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

export interface TeamFilters {
  branchId?: string;
  leaderId?: string;
  searchQuery?: string;
}

export interface TeamsAPIResponse<T = Team> {
  success: boolean;
  data?: T;
  teams?: T[];
  message?: string;
  error?: string;
}

// User types (for members/leaders)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'director' | 'branch_director' | 'manager' | 'editor';
  branch?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
}

// Branch types (for team assignment)
export interface Branch {
  _id: string;
  name: string;
  code: string;
  description?: string;
  location?: string;
  isActive: boolean;
  teamsCount?: number;
  channelsCount?: number;
}
