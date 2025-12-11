// src/types/channel.types.ts
/**
 * Channel Types and Interfaces
 * Based on API 4.5 specification
 */

export interface Channel {
  _id: string;
  name: string;
  youtubeChannelId: string;
  description: string;
  customUrl: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  isConnected: boolean;
  isActive: boolean;
  team?: {
    _id: string;
    name: string;
    branch?: {
      _id: string;
      name: string;
      code: string;
    };
  } | null;
  assignedEditors?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  assignedTo?: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    role: string;
    assignedAt: string;
  }>;
  accessToken?: string;
  refreshToken?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChannelDetail extends Channel {
  analytics?: {
    views: number;
    watchTime: number;
    estimatedRevenue: number;
    subscribersGained: number;
  };
  recentVideos?: Array<{
    videoId: string;
    title: string;
    views: number;
    publishedAt: string;
  }>;
}

export interface CreateChannelRequest {
  youtubeChannelId: string;
  name: string;
  teamId?: string;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
  teamId?: string;
}

export interface AssignEditorRequest {
  userId: string;
<<<<<<< HEAD
  role?: 'editor' | 'manager' | 'viewer';
=======
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
}

export interface MoveChannelRequest {
  teamId: string;
}

export interface ChannelFilters {
  teamId?: string;
  branchId?: string;
  isActive?: boolean;
  isConnected?: boolean;
  searchQuery?: string;
}

export interface ChannelStats {
  totalChannels: number;
  connectedChannels: number;
  disconnectedChannels: number;
  totalSubscribers: number;
  totalViews: number;
  totalVideos: number;
}

/**
 * API Response types
 */
export interface ChannelsResponse {
  success?: boolean;
  channels?: Channel[];
  data?: Channel[];
  count?: number;
  message?: string;
}

export interface ChannelResponse {
  success?: boolean;
  channel?: ChannelDetail;
  data?: ChannelDetail;
  message?: string;
}

export interface ChannelActionResponse {
  success?: boolean;
  message: string;
  channel?: Channel;
  data?: Channel;
}

export interface CheckTeamResponse {
  hasTeam: boolean;
  teams: Array<{
    _id: string;
    name: string;
  }>;
}