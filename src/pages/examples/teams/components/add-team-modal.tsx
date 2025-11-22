// src/pages/examples/team/components/add-team-modal.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Plus, X, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'

interface User {
    _id: string
    name: string
    email: string
    role: string
}

interface Branch {
    _id: string
    name: string
    code: string
}

interface AddTeamModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddTeamModal({ open, onClose, onSuccess }: AddTeamModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        branchId: '',
        leaderId: '',
        memberIds: [] as string[]
    })

    const [branches, setBranches] = useState<Branch[]>([])
    const [managers, setManagers] = useState<User[]>([])
    const [editors, setEditors] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (open) {
            fetchInitialData()
            // Reset form
            setFormData({
                name: '',
                description: '',
                branchId: '',
                leaderId: '',
                memberIds: []
            })
            setErrors({})
            setSuccessMessage('')
            setErrorMessage('')
        }
    }, [open])

    // Fetch managers khi chọn branch
    useEffect(() => {
        if (formData.branchId) {
            fetchManagersForBranch(formData.branchId)
        }
    }, [formData.branchId])

    const fetchInitialData = async () => {
        setFetchingData(true)
        try {
            const token = localStorage.getItem('authToken')

            // Fetch branches
            const branchesResponse = await axios.get('http://localhost:3000/api/branches', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setBranches(branchesResponse.data.branches || [])

            // Fetch all editors
            const editorsResponse = await axios.get('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { role: 'editor' }
            })
            setEditors(editorsResponse.data.users || [])

        } catch (error) {
            console.error('Error fetching initial data:', error)
            setErrorMessage('Không thể tải dữ liệu ban đầu')
        } finally {
            setFetchingData(false)
        }
    }

    const fetchManagersForBranch = async (branchId: string) => {
        try {
            const token = localStorage.getItem('authToken')

            // Fetch managers thuộc branch này
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    role: 'manager',
                    branch: branchId
                }
            })

            setManagers(response.data.users || [])

        } catch (error) {
            console.error('Error fetching managers:', error)
            setManagers([])
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Tên nhóm là bắt buộc'
        } else if (formData.name.length < 3) {
            newErrors.name = 'Tên nhóm phải có ít nhất 3 ký tự'
        }

        if (!formData.branchId) {
            newErrors.branchId = 'Vui lòng chọn chi nhánh'
        }

        if (!formData.leaderId) {
            newErrors.leaderId = 'Vui lòng chọn trưởng nhóm (Manager)'
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

            const response = await axios.post(
                'http://localhost:3000/api/teams',
                {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    branch: formData.branchId,
                    leader: formData.leaderId,
                    members: formData.memberIds
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log('Team created:', response.data)

            // Show success message
            setSuccessMessage('✅ Tạo nhóm thành công!')

            // Wait then close and refresh
            setTimeout(() => {
                onSuccess()
                onClose()
            }, 1500)

        } catch (error: any) {
            console.error('Error creating team:', error)

            const errorMsg = error.response?.data?.error || 'Lỗi khi tạo nhóm!'
            setErrorMessage(errorMsg)

            setTimeout(() => setErrorMessage(''), 5000)

        } finally {
            setLoading(false)
        }
    }

    const toggleMember = (memberId: string) => {
        setFormData(prev => ({
            ...prev,
            memberIds: prev.memberIds.includes(memberId)
                ? prev.memberIds.filter(id => id !== memberId)
                : [...prev.memberIds, memberId]
        }))
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
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Thêm Nhóm Mới</h2>
                            <p className="text-sm text-slate-500">Tạo nhóm làm việc cho chi nhánh</p>
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
                    {/* Team Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tên Nhóm <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: Nhóm Sản Xuất Video"
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

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mô Tả
                        </label>
                        <textarea
                            placeholder="Mô tả về nhiệm vụ, mục tiêu của nhóm..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                            disabled={loading}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.description.length}/500 ký tự
                        </p>
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Chi Nhánh <span className="text-red-500">*</span>
                        </label>

                        {fetchingData ? (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-4 h-4 border-2 border-slate-300 border-t-green-600 rounded-full animate-spin" />
                                Đang tải danh sách chi nhánh...
                            </div>
                        ) : branches.length === 0 ? (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                Chưa có chi nhánh nào. Vui lòng tạo chi nhánh trước.
                            </div>
                        ) : (
                            <>
                                <select
                                    value={formData.branchId}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            branchId: e.target.value,
                                            leaderId: '', // Reset leader khi đổi branch
                                            memberIds: [] // Reset members khi đổi branch
                                        })
                                    }}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.branchId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
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
                                {errors.branchId ? (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.branchId}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Nhóm sẽ thuộc chi nhánh này
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Team Leader Selection */}
                    {formData.branchId && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Trưởng Nhóm (Manager) <span className="text-red-500">*</span>
                            </label>

                            {managers.length === 0 ? (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                    Không có Manager nào trong chi nhánh này. Vui lòng thêm Manager trước.
                                </div>
                            ) : (
                                <>
                                    <select
                                        value={formData.leaderId}
                                        onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.leaderId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                                            }`}
                                        disabled={loading}
                                    >
                                        <option value="">-- Chọn Trưởng Nhóm --</option>
                                        {managers.map((manager) => (
                                            <option key={manager._id} value={manager._id}>
                                                {manager.name} ({manager.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.leaderId ? (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.leaderId}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-500 mt-1">
                                            Manager sẽ quản lý nhóm này
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Members Selection */}
                    {formData.branchId && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Thành Viên (Editors) <span className="text-slate-400">(Tùy chọn)</span>
                            </label>

                            {editors.length === 0 ? (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                                    Chưa có Editor nào. Có thể thêm thành viên sau.
                                </div>
                            ) : (
                                <div className="border border-slate-300 rounded-lg p-3 max-h-60 overflow-y-auto">
                                    <p className="text-xs text-slate-500 mb-2">
                                        Chọn {formData.memberIds.length} / {editors.length} editors
                                    </p>
                                    <div className="space-y-2">
                                        {editors.map((editor) => (
                                            <label
                                                key={editor._id}
                                                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.memberIds.includes(editor._id)}
                                                    onChange={() => toggleMember(editor._id)}
                                                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                                                    disabled={loading}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{editor.name}</p>
                                                    <p className="text-xs text-slate-500">{editor.email}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-lg font-semibold">ℹ</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-green-900 mb-1">Lưu ý:</p>
                                <ul className="list-disc list-inside space-y-1 text-green-800">
                                    <li>Nhóm sẽ được tạo với trạng thái "Hoạt động"</li>
                                    <li>Manager có thể quản lý tất cả thành viên và kênh của nhóm</li>
                                    <li>Editors có thể được thêm hoặc xóa sau khi tạo nhóm</li>
                                    <li>Có thể thêm kênh YouTube vào nhóm sau khi tạo</li>
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
                            className="bg-red-600 hover:bg-red-700 gap-2 min-w-[140px]"
                            disabled={loading || branches.length === 0}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo Nhóm
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}