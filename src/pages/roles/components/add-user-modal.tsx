// src/pages/examples/roles/components/add-user-modal.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, X, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import axiosInstance from '@/lib/axios-instance'

interface Branch {
    _id: string
    name: string
    code: string
}

interface Team {
    _id: string
    name: string
    branch: string
}

interface AddUserModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddUserModal({ open, onClose, onSuccess }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        branchId: '',
        teamId: ''
    })

    const [branches, setBranches] = useState<Branch[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (open) {
            fetchInitialData()
            resetForm()
        }
    }, [open])

    useEffect(() => {
        // Filter teams by selected branch
        if (formData.branchId) {
            const filtered = teams.filter(t => t.branch === formData.branchId)
            setFilteredTeams(filtered)
        } else {
            setFilteredTeams([])
        }
    }, [formData.branchId, teams])

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            branchId: '',
            teamId: ''
        })
        setErrors({})
        setSuccessMessage('')
        setErrorMessage('')
    }

    const fetchInitialData = async () => {
        setFetchingData(true)
        try {
            const token = localStorage.getItem('authToken')
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

            // Fetch branches
            const branchesResponse = await axiosInstance.get(`${API_URL}/branches`)
            setBranches(branchesResponse.data.branches || [])

            // Fetch teams
            const teamsResponse = await axiosInstance.get(`${API_URL}/teams`)
            setTeams(teamsResponse.data.teams || [])

        } catch (error) {
            console.error('Error fetching data:', error)
            setErrorMessage('Không thể tải dữ liệu. Vui lòng thử lại.')
        } finally {
            setFetchingData(false)
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Tên là bắt buộc'
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên phải có ít nhất 3 ký tự'
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp'
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Vui lòng chọn vai trò'
        }

        // Branch validation for branch_director, manager, editor
        if (['branch_director', 'manager', 'editor'].includes(formData.role) && !formData.branchId) {
            newErrors.branchId = 'Vui lòng chọn chi nhánh'
        }

        // Team validation for manager, editor
        if (['manager', 'editor'].includes(formData.role) && !formData.teamId) {
            newErrors.teamId = 'Vui lòng chọn team'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage('')
        setErrorMessage('')

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem('authToken')

            const payload: any = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role
            }

            // Add branch if needed
            if (['branch_director', 'manager', 'editor'].includes(formData.role)) {
                payload.branch = formData.branchId
            }

            // Add team if needed
            if (['manager', 'editor'].includes(formData.role)) {
                payload.team = formData.teamId
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
            const response = await axios.post(
                `${API_URL}/users`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log('User created:', response.data)

            setSuccessMessage('✅ Tạo người dùng thành công!')

            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1500)

        } catch (error: any) {
            console.error('Error creating user:', error)

            const errorMsg = error.response?.data?.error || 'Lỗi khi tạo người dùng!'
            setErrorMessage(errorMsg)

            setTimeout(() => setErrorMessage(''), 5000)

        } finally {
            setLoading(false)
        }
    }

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            admin: 'Admin',
            director: 'Director',
            branch_director: 'Branch Director',
            manager: 'Manager',
            editor: 'Editor'
        }
        return labels[role] || role
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={loading ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Thêm Người Dùng Mới</h2>
                            <p className="text-sm text-slate-500">Tạo tài khoản mới cho hệ thống</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Họ và Tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: Nguyễn Văn A"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                            disabled={loading}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="email"
                            placeholder="VD: user@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mật Khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className={`pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Vai Trò <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({
                                ...formData,
                                role: e.target.value,
                                branchId: '', // Reset branch when role changes
                                teamId: '' // Reset team when role changes
                            })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.role ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                                }`}
                            disabled={loading}
                        >
                            <option value="">-- Chọn Vai Trò --</option>
                            <option value="admin">Admin (Toàn quyền hệ thống)</option>
                            <option value="director">Director (Giám đốc)</option>
                            <option value="branch_director">Branch Director (Giám đốc chi nhánh)</option>
                            <option value="manager">Manager (Quản lý team)</option>
                            <option value="editor">Editor (Biên tập viên)</option>
                        </select>
                        {errors.role && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Branch Selection (for branch_director, manager, editor) */}
                    {['branch_director', 'manager', 'editor'].includes(formData.role) && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Chi Nhánh <span className="text-red-500">*</span>
                            </label>

                            {fetchingData ? (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                                    Đang tải chi nhánh...
                                </div>
                            ) : branches.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    Chưa có chi nhánh nào. Vui lòng tạo chi nhánh trước.
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={formData.branchId}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            branchId: e.target.value,
                                            teamId: '' // Reset team when branch changes
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.branchId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                                            }`}
                                        disabled={loading}
                                    >
                                        <option value="">-- Chọn Chi Nhánh --</option>
                                        {branches.map((branch) => (
                                            <option key={branch._id} value={branch._id}>
                                                {branch.name} ({branch.code})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branchId && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.branchId}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Team Selection (for manager, editor) */}
                    {['manager', 'editor'].includes(formData.role) && formData.branchId && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Team <span className="text-red-500">*</span>
                            </label>

                            {filteredTeams.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    Chi nhánh này chưa có team nào. Vui lòng tạo team trước.
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={formData.teamId}
                                        onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.teamId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                                            }`}
                                        disabled={loading}
                                    >
                                        <option value="">-- Chọn Team --</option>
                                        {filteredTeams.map((team) => (
                                            <option key={team._id} value={team._id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.teamId && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.teamId}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-lg font-semibold">ℹ</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 mb-1">Quyền hạn theo vai trò:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-800">
                                    <li><strong>Admin/Director:</strong> Toàn quyền hệ thống</li>
                                    <li><strong>Branch Director:</strong> Quản lý chi nhánh được giao</li>
                                    <li><strong>Manager:</strong> Quản lý team và kênh</li>
                                    <li><strong>Editor:</strong> Xem kênh được assign</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 min-w-[140px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Tạo Người Dùng
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}