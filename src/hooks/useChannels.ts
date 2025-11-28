// src/hooks/useChannels.ts
/**
 * Custom hook for managing channels
 * Provides CRUD operations and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { channelsAPI } from '@/lib/channels-api';
import type {
  Channel,
  ChannelDetail,
  CreateChannelRequest,
  UpdateChannelRequest,
  AssignEditorRequest,
  MoveChannelRequest,
  ChannelFilters,
  ChannelStats,
} from '@/types/channel.types';
import { toast } from 'sonner';

export interface UseChannelsOptions {
  filters?: ChannelFilters;
  autoFetch?: boolean;
}

export interface UseChannelsReturn {
  channels: Channel[];
  loading: boolean;
  error: string | null;
  stats: ChannelStats;
  
  // CRUD operations
  refetch: () => Promise<void>;
  getChannel: (channelId: string) => Promise<ChannelDetail>;
  getChannelDetail: (channelId: string) => Promise<ChannelDetail>;
  createChannel: (data: CreateChannelRequest) => Promise<Channel>;
  updateChannel: (channelId: string, data: UpdateChannelRequest) => Promise<Channel>;
  deleteChannel: (channelId: string) => Promise<void>;
  
  // Assignment operations
  assignEditor: (channelId: string, userId: string) => Promise<Channel>;
  removeEditor: (channelId: string, userId: string) => Promise<void>;
  
  // Team operations
  moveToTeam: (channelId: string, teamId: string) => Promise<Channel>;
  unassignFromTeam: (channelId: string) => Promise<Channel>;
  
  // Admin operations
  restoreChannel: (channelId: string) => Promise<Channel>;
  
  // Utility methods
  searchChannels: (query: string) => void;
  filterByTeam: (teamId: string) => void;
  filterByBranch: (branchId: string) => void;
  checkTeam: () => Promise<{ hasTeam: boolean; teams: any[] }>;
}

/**
 * Hook for managing channels
 */
export function useChannels(options: UseChannelsOptions = {}): UseChannelsReturn {
  const { filters, autoFetch = true } = options;

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ChannelFilters>(filters || {});
  const [stats, setStats] = useState<ChannelStats>({
    totalChannels: 0,
    connectedChannels: 0,
    disconnectedChannels: 0,
    totalSubscribers: 0,
    totalViews: 0,
    totalVideos: 0,
  });

  /**
   * Calculate statistics from channels
   */
  const calculateStats = useCallback((channelList: Channel[]): ChannelStats => {
    return {
      totalChannels: channelList.length,
      connectedChannels: channelList.filter(c => c.isConnected).length,
      disconnectedChannels: channelList.filter(c => !c.isConnected).length,
      totalSubscribers: channelList.reduce((sum, c) => sum + (c.subscriberCount || 0), 0),
      totalViews: channelList.reduce((sum, c) => sum + (c.viewCount || 0), 0),
      totalVideos: channelList.reduce((sum, c) => sum + (c.videoCount || 0), 0),
    };
  }, []);

  /**
   * Fetch channels
   */
  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await channelsAPI.getAll(currentFilters);
      setChannels(data);
      setStats(calculateStats(data));
    } catch (err: any) {
      console.error('Error fetching channels:', err);
      const errorMessage = err.message || 'Failed to fetch channels';
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
      fetchChannels();
    }
  }, [autoFetch, fetchChannels]);

  /**
   * Get single channel by ID
   */
  const getChannel = async (channelId: string): Promise<ChannelDetail> => {
    try {
      return await channelsAPI.getById(channelId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Get channel detail with analytics
   */
  const getChannelDetail = async (channelId: string): Promise<ChannelDetail> => {
    try {
      return await channelsAPI.getDetail(channelId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch channel detail';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Create new channel
   */
  const createChannel = async (data: CreateChannelRequest): Promise<Channel> => {
    try {
      const channel = await channelsAPI.create(data);
      toast.success('Channel created successfully');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Update channel
   */
  const updateChannel = async (channelId: string, data: UpdateChannelRequest): Promise<Channel> => {
    try {
      const channel = await channelsAPI.update(channelId, data);
      toast.success('Channel updated successfully');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Delete channel
   */
  const deleteChannel = async (channelId: string): Promise<void> => {
    try {
      await channelsAPI.delete(channelId);
      toast.success('Channel deleted successfully');
      await fetchChannels(); // Refresh list
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Assign editor to channel
   */
  const assignEditor = async (channelId: string, userId: string): Promise<Channel> => {
    try {
      const channel = await channelsAPI.assignEditor(channelId, { userId });
      toast.success('Editor assigned successfully');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign editor';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Remove editor from channel
   */
  const removeEditor = async (channelId: string, userId: string): Promise<void> => {
    try {
      await channelsAPI.removeEditor(channelId, userId);
      toast.success('Editor removed successfully');
      await fetchChannels(); // Refresh list
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove editor';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Move channel to another team
   */
  const moveToTeam = async (channelId: string, teamId: string): Promise<Channel> => {
    try {
      const channel = await channelsAPI.moveToTeam(channelId, { teamId });
      toast.success('Channel moved successfully');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to move channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Unassign channel from team
   */
  const unassignFromTeam = async (channelId: string): Promise<Channel> => {
    try {
      const channel = await channelsAPI.unassignFromTeam(channelId);
      toast.success('Channel unassigned from team');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to unassign channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Restore deleted channel
   */
  const restoreChannel = async (channelId: string): Promise<Channel> => {
    try {
      const channel = await channelsAPI.restore(channelId);
      toast.success('Channel restored successfully');
      await fetchChannels(); // Refresh list
      return channel;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to restore channel';
      toast.error(errorMessage);
      throw err;
    }
  };

  /**
   * Search channels
   */
  const searchChannels = (query: string) => {
    setCurrentFilters(prev => ({ ...prev, searchQuery: query }));
  };

  /**
   * Filter by team
   */
  const filterByTeam = (teamId: string) => {
    setCurrentFilters(prev => ({ ...prev, teamId }));
  };

  /**
   * Filter by branch
   */
  const filterByBranch = (branchId: string) => {
    setCurrentFilters(prev => ({ ...prev, branchId }));
  };

  /**
   * Check if user has teams
   */
  const checkTeam = async () => {
    try {
      return await channelsAPI.checkTeam();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to check team';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    channels,
    loading,
    error,
    stats,
    
    // CRUD
    refetch: fetchChannels,
    getChannel,
    getChannelDetail,
    createChannel,
    updateChannel,
    deleteChannel,
    
    // Assignments
    assignEditor,
    removeEditor,
    
    // Team operations
    moveToTeam,
    unassignFromTeam,
    
    // Admin operations
    restoreChannel,
    
    // Utilities
    searchChannels,
    filterByTeam,
    filterByBranch,
    checkTeam,
  };
}

/**
 * Hook for single channel
 */
export function useChannel(channelId: string) {
  const [channel, setChannel] = useState<ChannelDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannel = useCallback(async () => {
    if (!channelId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await channelsAPI.getById(channelId);
      setChannel(data);
    } catch (err: any) {
      console.error('Error fetching channel:', err);
      const errorMessage = err.message || 'Failed to fetch channel';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  return {
    channel,
    loading,
    error,
    refetch: fetchChannel,
  };
}

/**
 * Hook for my channels
 */
export function useMyChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await channelsAPI.getMyChannels();
      setChannels(data);
    } catch (err: any) {
      console.error('Error fetching my channels:', err);
      const errorMessage = err.message || 'Failed to fetch my channels';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyChannels();
  }, [fetchMyChannels]);

  return {
    channels,
    loading,
    error,
    refetch: fetchMyChannels,
  };
}