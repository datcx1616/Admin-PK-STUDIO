// src/pages/examples/team/components/add-branch-modal.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Plus, X } from 'lucide-react'
import axios from 'axios'

interface User {
    _id: string
    name: string
    email: string
    role: string
}

interface AddBranchModalProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddBranchModal({ open, onClose, onSuccess }: AddBranchModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        directorId: ''
    })
    const [directors, setDirectors] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            fetchDirectors()
            // Reset form khi mở modal
            setFormData({ name: '', code: '', description: '', directorId: '' })
            setErrors({})
        }
    }, [open])

    const fetchDirectors = async () => {
        try {
            const token = localStorage.getItem('authToken')

            // Nếu có API users
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { role: 'branch_director' }
            })

            setDirectors(response.data.users || [])
        } catch (error) {
            console.error('Error fetching directors:', error)

            // Fallback: fetch từ dashboard
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard/overview', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                })

                const allDirectors = response.data.branches?.map((b: any) => b.director) || []
                setDirectors(allDirectors)
            } catch (err) {
                console.error('Fallback error:', err)
            }
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Tên chi nhánh là bắt buộc'
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Mã chi nhánh là bắt buộc'
        } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
            newErrors.code = 'Mã chi nhánh chỉ chứa chữ in hoa và số'
        }

        if (!formData.directorId) {
            newErrors.directorId = 'Vui lòng chọn giám đốc chi nhánh'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem('authToken')

            await axios.post(
                'http://localhost:3000/api/branches',
                {
                    name: formData.name,
                    code: formData.code,
                    description: formData.description,
                    director: formData.directorId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            // Success
            onSuccess()
            onClose()

            // Show success message
            alert('✅ Tạo chi nhánh thành công!')

        } catch (error: any) {
            console.error('Error creating branch:', error)
            const errorMsg = error.response?.data?.error || 'Lỗi khi tạo chi nhánh!'
            alert('❌ ' + errorMsg)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Thêm Chi Nhánh Mới</h2>
                            <p className="text-sm text-slate-500">Điền thông tin chi nhánh</p>
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Branch Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tên Chi Nhánh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: Chi nhánh Hà Nội"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'border-red-500' : ''}
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Branch Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mã Chi Nhánh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: HN, HCM, DN"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            maxLength={10}
                            className={`uppercase ${errors.code ? 'border-red-500' : ''}`}
                            disabled={loading}
                        />
                        {errors.code ? (
                            <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                        ) : (
                            <p className="text-xs text-slate-500 mt-1">
                                Mã chi nhánh phải là chữ in hoa hoặc số, không có khoảng trắng
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mô Tả
                        </label>
                        <textarea
                            placeholder="Mô tả về chi nhánh..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
                            disabled={loading}
                        />
                    </div>

                    {/* Director Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Giám Đốc Chi Nhánh <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.directorId}
                            onChange={(e) => setFormData({ ...formData, directorId: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 ${errors.directorId ? 'border-red-500' : 'border-slate-300'
                                }`}
                            disabled={loading}
                        >
                            <option value="">-- Chọn Giám Đốc --</option>
                            {directors.map((director) => (
                                <option key={director._id} value={director._id}>
                                    {director.name} ({director.email})
                                </option>
                            ))}
                        </select>
                        {errors.directorId ? (
                            <p className="text-xs text-red-500 mt-1">{errors.directorId}</p>
                        ) : (
                            <p className="text-xs text-slate-500 mt-1">
                                Chọn người dùng có quyền Branch Director
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-lg font-semibold">ℹ</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 mb-1">Lưu ý:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-800">
                                    <li>Chi nhánh sẽ được tạo với trạng thái "Hoạt động"</li>
                                    <li>Giám đốc có thể quản lý tất cả các nhóm trong chi nhánh</li>
                                    <li>Mã chi nhánh không thể thay đổi sau khi tạo</li>
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
                            className="bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo Chi Nhánh
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}