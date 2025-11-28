// src/types/user.types.ts

/**
 * User role definitions
 */
export type UserRole = 'admin' | 'director' | 'branch_director' | 'manager' | 'editor';

/**
 * Base User interface
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  branch?: {
    _id: string;
    name: string;
    code?: string;
  } | null;
  team?: {
    _id: string;
    name: string;
  } | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Detailed User interface with relations
 */
export interface UserDetail extends User {
  teams?: Array<{
    _id: string;
    name: string;
    description?: string;
  }>;
  channels?: Array<{
    _id: string;
    name: string;
    youtubeChannelId: string;
  }>;
}

/**
 * Create User request payload
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  branchId?: string;
  teamId?: string;
}

/**
 * Update User request payload
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  branchId?: string;
  teamId?: string;
  isActive?: boolean;
}

/**
 * Assign Branch request
 */
export interface AssignBranchRequest {
  branchId: string;
}

/**
 * Change Role request
 */
export interface ChangeRoleRequest {
  role: UserRole;
}

/**
 * User filters for queries
 */
export interface UserFilters {
  role?: UserRole;
  branchId?: string;
  teamId?: string;
  isActive?: boolean;
  searchQuery?: string;
}

/**
 * User statistics
 */
export interface UserStats {
  total: number;
  admin: number;
  director: number;
  branch_director: number;
  manager: number;
  editor: number;
  active: number;
  inactive: number;
}

/**
 * API Response types
 */
export interface UsersResponse {
  success?: boolean;
  users?: User[];
  data?: User[];
  message?: string;
}

export interface UserResponse {
  success?: boolean;
  user?: UserDetail;
  data?: UserDetail;
  message?: string;
}

export interface UserActionResponse {
  success?: boolean;
  message: string;
  user?: User;
  data?: User;
}

/**
 * Role configuration
 */
export interface RoleConfig {
  label: string;
  color: string;
  avatarColor: string;
  description: string;
  permissions: string[];
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  admin: {
    label: 'Admin',
    color: 'bg-red-100 text-red-700',
    avatarColor: 'bg-red-500',
    description: 'Toàn quyền hệ thống',
    permissions: [
      'Quản lý toàn bộ hệ thống',
      'Quản lý người dùng',
      'Quản lý chi nhánh',
      'Truy cập toàn bộ analytics',
    ],
  },
  director: {
    label: 'Director',
    color: 'bg-purple-100 text-purple-700',
    avatarColor: 'bg-purple-500',
    description: 'Giám đốc',
    permissions: [
      'Xem toàn bộ branches',
      'Quản lý branches',
      'Xem analytics tổng hợp',
      'Không quản lý users',
    ],
  },
  branch_director: {
    label: 'Branch Director',
    color: 'bg-blue-100 text-blue-700',
    avatarColor: 'bg-blue-500',
    description: 'Giám đốc chi nhánh',
    permissions: [
      'Quản lý chi nhánh được giao',
      'Xem dashboard chi nhánh',
      'Quản lý teams trong chi nhánh',
      'Xem analytics chi nhánh',
    ],
  },
  manager: {
    label: 'Manager',
    color: 'bg-green-100 text-green-700',
    avatarColor: 'bg-green-500',
    description: 'Quản lý team',
    permissions: [
      'Quản lý team được giao',
      'Quản lý kênh trong team',
      'Phân tích kênh team',
      'Kết nối YouTube channels',
    ],
  },
  editor: {
    label: 'Editor',
    color: 'bg-orange-100 text-orange-700',
    avatarColor: 'bg-orange-500',
    description: 'Biên tập viên',
    permissions: [
      'Xem kênh được assign',
      'Xem analytics kênh',
      'Tạo và quản lý video',
      'Không có quyền quản lý',
    ],
  },
};