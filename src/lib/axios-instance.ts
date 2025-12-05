// src/lib/axios-instance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động thêm JWT token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Xử lý token không hợp lệ hoặc hết hạn (401, 403)
    if (status === 401 || status === 403) {
      // Xóa dữ liệu authentication
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Kiểm tra xem có đang ở trang public không
      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      const isPublicPath = publicPaths.some(path => 
        window.location.pathname.includes(path)
      );
      
      // Chỉ redirect nếu không phải trang public
      if (!isPublicPath) {
        // Lưu URL hiện tại để redirect lại sau khi login
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
        
        // Hiển thị thông báo
        alert('🔒 Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        
        // Redirect về login
        window.location.href = '/login';
      }
    }
    
    // Xử lý các lỗi khác
    if (status === 500) {
      console.error('Server error:', error.response?.data?.message);
    }
    
    if (status === 404) {
      console.error('Resource not found:', error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;