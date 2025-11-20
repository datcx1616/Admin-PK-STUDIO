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
  stats: any;
  team?: any;
  channels?: any[];
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
    return {
      stats: response.data.totalStats,
      branches: response.data.branches,
      user: { role: response.data.userRole },
    };
  }
}

export const apiClient = new ApiClient();
