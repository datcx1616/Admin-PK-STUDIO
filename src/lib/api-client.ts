// lib/api-client.ts
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3000/api";

interface ApiError {
  error: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface DashboardOverviewResponse {
  user: any;
  branches?: any[];
  branch?: any;
  stats?: any;
  team?: any;
  channels?: any[];
}

// Thêm interfaces cho YouTube
interface YouTubeAuthResponse {
  success: boolean;
  authUrl: string;
  message: string;
}

interface YouTubeStatusResponse {
  success: boolean;
  connected: boolean;
  channels: {
    id: string;
    channelId: string;
    channelTitle: string;
    connectedAt: string;
    thumbnail: string;
  }[];
  scopes: string[] | null;
}

class ApiClient {
  private getHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error || "An error occurred");
      }

      return data as T;
    } catch (error) {
      console.error("API Request Failed:", error);
      toast.error(error instanceof Error ? error.message : "API Request Failed");
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    const response = await this.request<any>("/dashboard/overview");
    if (response.data) {
      return {
        user: { role: response.data.userRole, ...response.data.user },
        stats: response.data.totalStats,
        branches: response.data.branches,
        branch: response.data.branch,
        team: response.data.team,
        channels: response.data.channels
      };
    }
    return response;
  }

  async getBranchDetail(branchId: string): Promise<any> {
    return this.request<any>(`/dashboard/branch/${branchId}`);
  }

  async getChannels(params: any = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/channels?${queryString}`);
  }

  async createVideo(data: any): Promise<any> {
    return this.request<any>("/videos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ===== ANALYTICS METHODS =====

  async getBranches(): Promise<any> {
    return this.request<any>("/branches");
  }

  async getTeams(params: any = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/teams?${queryString}` : "/teams";
    return this.request<any>(url);
  }

  async getUsers(params: any = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/users?${queryString}` : "/users";
    return this.request<any>(url);
  }

  async getChannelsForAnalytics(params: any = {}): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/channels?${queryString}` : "/channels";
    return this.request<any>(url);
  }

  async getYouTubeAnalytics(params: {
    channelId?: string;
    teamId?: string;
    branchId?: string;
    startDate: string;
    endDate: string;
    include?: string;
  }): Promise<any> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request<any>(`/youtube/analytics?${queryString}`);
  }

  async getChannelStats(channelId: string): Promise<any> {
    return this.request<any>(`/youtube/channel-stats?channelId=${channelId}`);
  }

  async getAggregatedAnalytics(params: {
    channelIds: string[];
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const queryString = new URLSearchParams({
      channelIds: params.channelIds.join(','),
      startDate: params.startDate,
      endDate: params.endDate,
    }).toString();
    return this.request<any>(`/youtube/analytics/aggregate?${queryString}`);
  }

  async getTeamAnalytics(teamId: string, params: {
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/youtube/analytics/team/${teamId}?${queryString}`);
  }

  async getBranchAnalytics(branchId: string, params: {
    startDate: string;
    endDate: string;
  }): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/youtube/analytics/branch/${branchId}?${queryString}`);
  }

  async getAdminStats(): Promise<any> {
    return this.request<any>("/dashboard/admin-stats");
  }

  // ===== YOUTUBE METHODS =====
  
  async getYouTubeAuthUrl(): Promise<YouTubeAuthResponse> {
    return this.request<YouTubeAuthResponse>("/youtube/auth");
  }

  async getYouTubeStatus(): Promise<YouTubeStatusResponse> {
    return this.request<YouTubeStatusResponse>("/youtube/status");
  }
}

const baseApiClient = new ApiClient();

// Video Upload Service APIs (Python Backend - Port 8000)
export const videoAPI = {

    baseURL: import.meta.env.VITE_PYTHON_API_URL || 'https://api.nexachannel.com',

    uploadVideo: async (formData: FormData) => {
        console.log('🔄 Uploading video to:', `${videoAPI.baseURL}/api/upload`);
        console.log('📦 FormData entries:');
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
                console.log(`  ${key}:`, value);
            }
        }

        try {
            const response = await fetch(`${videoAPI.baseURL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                let errorMessage = 'Upload failed';
                const contentType = response.headers.get('content-type');
                
                try {
                    if (contentType && contentType.includes('application/json')) {
                        const error = await response.json();
                        console.error('❌ Server error response:', error);
                        errorMessage = error.detail || error.message || JSON.stringify(error);
                    } else {
                        const text = await response.text();
                        console.error('❌ Server error text:', text);
                        errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
                    }
                } catch (e) {
                    console.error('❌ Error parsing response:', e);
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('✅ Upload successful:', result);
            return result;
        } catch (error) {
            console.error('❌ Upload error:', error);
            throw error;
        }
    },

    getMyVideos: async (params?: any) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });
        }

        const response = await fetch(`${videoAPI.baseURL}/api/videos?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        return response.json();
    },

    getVideo: async (id: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch video');
        }

        return response.json();
    },

    updateVideo: async (id: string, data: any) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update video');
        }

        return response.json();
    },

    submitVideoForReview: async (id: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to submit video');
        }

        return response.json();
    },

    deleteVideo: async (id: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete video');
        }

        return response.json();
    },

    getUploadJobStatus: async (jobId: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/upload-jobs/${jobId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get job status');
        }

        return response.json();
    },


    
    getPendingVideos: async () => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/pending`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pending videos');
        }

        return response.json();
    },

    approveVideo: async (id: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to approve video');
        }

        return response.json();
    },

    rejectVideo: async (id: string, reason: string) => {
        const response = await fetch(`${videoAPI.baseURL}/api/videos/${id}/reject`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        });

        if (!response.ok) {
            throw new Error('Failed to reject video');
        }

        return response.json();
    }
};

// Extend ApiClient with video methods
const extendedApiClient = Object.assign(baseApiClient, {
    uploadVideo: videoAPI.uploadVideo,
    getMyVideos: videoAPI.getMyVideos,
    getVideo: videoAPI.getVideo,
    updateVideo: videoAPI.updateVideo,
    submitVideoForReview: videoAPI.submitVideoForReview,
    deleteVideo: videoAPI.deleteVideo,
    getUploadJobStatus: videoAPI.getUploadJobStatus,
    getPendingVideos: videoAPI.getPendingVideos,
    approveVideo: videoAPI.approveVideo,
    rejectVideo: videoAPI.rejectVideo
}) as ApiClient & {
    uploadVideo: typeof videoAPI.uploadVideo;
    getMyVideos: typeof videoAPI.getMyVideos;
    getVideo: typeof videoAPI.getVideo;
    updateVideo: typeof videoAPI.updateVideo;
    submitVideoForReview: typeof videoAPI.submitVideoForReview;
    deleteVideo: typeof videoAPI.deleteVideo;
    getUploadJobStatus: typeof videoAPI.getUploadJobStatus;
    getPendingVideos: typeof videoAPI.getPendingVideos;
    approveVideo: typeof videoAPI.approveVideo;
    rejectVideo: typeof videoAPI.rejectVideo;
};

export { extendedApiClient as apiClient };
