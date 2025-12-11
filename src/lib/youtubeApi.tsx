// src/lib/youtubeApi.ts
import axiosInstance from '@/lib/axios-instance';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/youtube`;

// Lấy token từ localStorage (key: "authToken")
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

interface AuthResponse {
    authUrl: string;
}

interface ChannelAnalytics {
    success: boolean;
    totals: {
        totalViews: number;
        totalWatchTimeHours: number;
        totalSubscribersNet: number;
    };
    dailyData: Array<{
        date: string;
        views: number;
        subscribersNet: number;
    }>;
}

export const youtubeApi = {
<<<<<<< HEAD
    /**
     * Login YouTube OAuth
     * @param teamId - Optional teamId để tự động gán kênh vào team sau khi kết nối
     */
    login: async (teamId?: string): Promise<void> => {
=======
    login: async (): Promise<void> => {
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
        try {
            const token = getAuthToken();

            if (!token) {
                alert('🔒 Vui lòng đăng nhập hệ thống trước!');
                window.location.href = '/login';
                return;
            }

            console.log('📡 Calling /api/youtube/auth...');

<<<<<<< HEAD
            // Lưu teamId vào localStorage để backend callback có thể sử dụng
            if (teamId) {
                localStorage.setItem('pendingTeamId', teamId);
                console.log('💾 Saved pendingTeamId:', teamId);
            } else {
                localStorage.removeItem('pendingTeamId');
            }

            // Gọi API với token và teamId (nếu có)
            const params = teamId ? { teamId } : {};
            const response = await axiosInstance.get<AuthResponse>(`${API_URL}/auth`, { params });
=======
            // Gọi API với token
            const response = await axiosInstance.get<AuthResponse>(`${API_URL}/auth`);
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8

            console.log('✅ Response:', response.data);

            const { authUrl } = response.data;

            if (!authUrl) {
                throw new Error('Không nhận được authUrl từ backend');
            }

            console.log('🚀 Mở popup OAuth...');

            // Hiển thị hướng dẫn trước khi mở popup
<<<<<<< HEAD
            const instruction = teamId
                ? `
📺 HƯỚNG DẪN KẾT NỐI KÊNH YOUTUBE

Bạn sẽ thực hiện các bước sau:

1️⃣ Đăng nhập Google
2️⃣ Cho phép quyền truy cập YouTube
3️⃣ Chọn kênh YouTube muốn kết nối
4️⃣ Kênh sẽ được tự động gán vào nhóm đã chọn
5️⃣ Hoàn tất! ✅

⚠️ QUAN TRỌNG:
- Đừng đóng popup trước khi thấy thông báo "Kết nối thành công"
- Popup sẽ tự động đóng sau khi hoàn tất

Click OK để bắt đầu!
                `.trim()
                : `
=======
            const instruction = `
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
📺 HƯỚNG DẪN KẾT NỐI KÊNH YOUTUBE

Bạn sẽ thực hiện các bước sau:

1️⃣ Đăng nhập Google
2️⃣ Cho phép quyền truy cập YouTube
3️⃣ Chọn kênh YouTube muốn kết nối
4️⃣ Chọn Team để gán kênh vào
5️⃣ Hoàn tất! ✅

<<<<<<< HEAD
⚠️ QUAN TRỌNG:
=======
⚠️ QUAN TRỌNG: 
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8
- Đừng đóng popup trước khi thấy thông báo "Kết nối thành công"
- Popup sẽ tự động đóng sau khi hoàn tất

Click OK để bắt đầu!
<<<<<<< HEAD
                `.trim();
=======
            `.trim();
>>>>>>> 197243bb845fd7ef1139096c146e88c0013330f8

            if (!confirm(instruction)) {
                return;
            }

            // Mở popup OAuth
            const oauthWindow = window.open(
                authUrl,
                'YouTube OAuth',
                'width=600,height=700,left=200,top=100'
            );

            if (!oauthWindow) {
                alert('⚠️ Popup bị chặn! Vui lòng cho phép popup trong trình duyệt.');
                return;
            }

            // Polling để check khi user đóng popup
            const pollInterval = setInterval(() => {
                try {
                    if (oauthWindow.closed) {
                        clearInterval(pollInterval);
                        console.log('✅ OAuth popup đã đóng!');

                        // Kiểm tra xem user có hoàn thành flow không
                        setTimeout(() => {
                            console.log('🔄 Đang kiểm tra kết nối...');

                            // Hiển thị thông báo
                            const message = `
✅ Đã đóng cửa sổ OAuth!

⚠️ LƯU Ý: 
- Nếu bạn vừa chọn kênh và team → Kênh đã được kết nối thành công!
- Nếu bạn đóng popup trước khi chọn team → Kênh CHƯA được lưu!

Click OK để reload và xem kênh mới.
                            `.trim();

                            alert(message);
                            window.location.reload();
                        }, 1500);
                    }
                } catch (e) {
                    // Ignore cross-origin errors
                }
            }, 1000);

            // Timeout sau 5 phút
            setTimeout(() => {
                clearInterval(pollInterval);
                if (oauthWindow && !oauthWindow.closed) {
                    oauthWindow.close();
                    alert('⏱️ Timeout - Vui lòng thử lại');
                }
            }, 5 * 60 * 1000);

        } catch (err) {
            const error = err as any;
            console.error('❌ OAuth error:', error);
            if (error && error.response) {
                if (error.response.status === 401) {
                    alert('🔒 Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                } else if (error.response.status === 500) {
                    alert('❌ Lỗi server: ' + (error.response.data?.error || 'Lỗi không xác định'));
                } else if (error.code === 'ERR_NETWORK') {
                    alert('❌ Không kết nối được backend.\n\nKiểm tra:\n1. Backend có chạy không?\n2. URL có đúng không?\n3. CORS có được cấu hình không?');
                } else {
                    alert('❌ Lỗi: ' + (error.response?.data?.error || error.message));
                }
            } else {
                alert('❌ Lỗi không xác định: ' + (error as Error).message);
            }
            throw error;
        }
    },

    getChannelAnalytics: async (
        channelId: string,
        startDate: string,
        endDate: string
    ): Promise<ChannelAnalytics> => {
        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Chưa đăng nhập');
            }

            const response = await axiosInstance.get<ChannelAnalytics>(
                `${API_URL}/analytics`,
                {
                    params: { channelId, startDate, endDate }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    },

    getStatus: async () => {
        try {
            const token = getAuthToken();

            if (!token) {
                return {
                    success: false,
                    connected: false,
                    channels: []
                };
            }

            const response = await axiosInstance.get(`${API_URL}/status`);
            return response.data;
        } catch (error) {
            console.error('Error fetching status:', error);
            return {
                success: false,
                connected: false,
                channels: []
            };
        }
    }
};