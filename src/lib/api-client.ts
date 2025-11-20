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

  // ===== YOUTUBE METHODS =====
  
  async getYouTubeAuthUrl(): Promise<YouTubeAuthResponse> {
    return this.request<YouTubeAuthResponse>("/youtube/auth");
  }

  async getYouTubeStatus(): Promise<YouTubeStatusResponse> {
    return this.request<YouTubeStatusResponse>("/youtube/status");
  }
}

export const apiClient = new ApiClient();