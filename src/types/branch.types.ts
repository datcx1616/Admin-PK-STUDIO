// src/types/branch.types.ts
/**
 * Branch Types and Interfaces
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
    role?: string;
  };
}

export interface BranchDetail extends Branch {
  teams?: Array<{
    _id: string;
    name: string;
    description?: string;
    membersCount: number;
    channelsCount?: number;
    leader?: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
  channels?: Array<{
    _id: string;
    name: string;
    youtubeChannelId: string;
    subscriberCount?: number;
    viewCount?: number;
    isConnected: boolean;
    team?: {
      _id: string;
      name: string;
    };
  }>;
}

export interface CreateBranchRequest {
  name: string;
  code?: string;
  description: string;
  location?: string;
  director?: string; // User ID
}

export interface UpdateBranchRequest {
  name?: string;
  code?: string;
  description?: string;
  location?: string;
  isActive?: boolean;
  director?: string; // User ID
}

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
  };
  dailyBreakdown?: Array<{
    date: string;
    views: number;
    watchTime: number;
    subscribersGained: number;
  }>;
}

export interface BranchFilters {
  searchQuery?: string;
  isActive?: boolean;
  location?: string;
}

export interface BranchStats {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  totalTeams: number;
  totalChannels: number;
  totalSubscribers: number;
}

/**
 * API Response types
 */
export interface BranchesResponse {
  success?: boolean;
  branches?: Branch[];
  data?: Branch[];
  message?: string;
}

export interface BranchResponse {
  success?: boolean;
  branch?: BranchDetail;
  data?: BranchDetail;
  message?: string;
}

export interface BranchActionResponse {
  success?: boolean;
  message: string;
  branch?: Branch;
  data?: Branch;
}