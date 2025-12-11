// hooks/useTeams.ts
import { useState, useEffect, useCallback } from 'react';
import { teamsAPI, type Team } from '@/lib/teams-api';

export interface UseTeamsOptions {
  branchId?: string;
  leaderId?: string;
  autoFetch?: boolean;
}

export interface UseTeamsReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTeam: (data: any) => Promise<Team>;
  updateTeam: (teamId: string, data: any) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMember: (teamId: string, userId: string) => Promise<Team>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
}

export function useTeams(options: UseTeamsOptions = {}): UseTeamsReturn {
  const { branchId, leaderId, autoFetch = true } = options;

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamsAPI.getAll({ branchId, leaderId });
      setTeams(data);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, [branchId, leaderId]);

  useEffect(() => {
    if (autoFetch) {
      fetchTeams();
    }
  }, [autoFetch, fetchTeams]);

  const createTeam = async (data: any): Promise<Team> => {
    const team = await teamsAPI.create(data);
    await fetchTeams(); // Refresh list
    return team;
  };

  const updateTeam = async (teamId: string, data: any): Promise<Team> => {
    const team = await teamsAPI.update(teamId, data);
    await fetchTeams(); // Refresh list
    return team;
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    await teamsAPI.delete(teamId);
    await fetchTeams(); // Refresh list
  };

  const addMember = async (teamId: string, userId: string): Promise<Team> => {
    const team = await teamsAPI.addMember(teamId, userId);
    await fetchTeams(); // Refresh list
    return team;
  };

  const removeMember = async (teamId: string, userId: string): Promise<void> => {
    await teamsAPI.removeMember(teamId, userId);
    await fetchTeams(); // Refresh list
  };

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
  };
}
