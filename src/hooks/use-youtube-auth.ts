// hooks/use-youtube-auth.ts
import { useState } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

export function useYouTubeAuth() {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectYouTube = async () => {
    setIsConnecting(true)
    
    try {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast.error('Vui lòng đăng nhập trước')
        setIsConnecting(false)
        return
      }
      
      const data = await apiClient.getYouTubeAuthUrl()
      
      if (data.success) {
        const oauthWindow = window.open(
          data.authUrl,
          'YouTube OAuth',
          'width=600,height=700,left=200,top=100'
        )
        
        if (!oauthWindow) {
          toast.error('Popup bị chặn. Vui lòng cho phép popup trên trình duyệt.')
          setIsConnecting(false)
          return
        }
        
        // Poll để theo dõi khi popup đóng
        const pollInterval = setInterval(() => {
          if (oauthWindow?.closed) {
            clearInterval(pollInterval)
            setIsConnecting(false)
            checkConnectionStatus()
          }
        }, 1000)
      }
    } catch (error) {
      console.error('YouTube connection error:', error)
      setIsConnecting(false)
      // toast.error đã được gọi trong apiClient.request
    }
  }

  const checkConnectionStatus = async () => {
    try {
      const data = await apiClient.getYouTubeStatus()
      
      if (data.success && data.connected) {
        toast.success(`Đã kết nối ${data.channels.length} kênh YouTube`)
        
        // Reload trang hoặc trigger re-fetch
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.info('Chưa kết nối kênh YouTube nào')
      }
    } catch (error) {
      console.error('Error checking YouTube status:', error)
    }
  }

  return {
    connectYouTube,
    isConnecting,
    checkConnectionStatus
  }
}