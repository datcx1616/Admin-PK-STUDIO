// src/pages/channels/components/AssignEditorDialog.tsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChannels } from '@/hooks/useChannels';
import { useUsers } from '@/hooks/useUsers';
import { Search, UserPlus, X, Loader2 } from 'lucide-react';
import type { Channel } from '@/types/channel.types';

interface AssignEditorDialogProps {
    channel: Channel;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssignEditorDialog({
    channel,
    isOpen,
    onClose,
    onSuccess,
}: AssignEditorDialogProps) {
    const { assignEditor, removeEditor } = useChannels({ autoFetch: false });
    const { users } = useUsers({ filters: { role: 'editor' } });

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [assignedEditors, setAssignedEditors] = useState(channel.assignedEditors || []);

    useEffect(() => {
        setAssignedEditors(channel.assignedEditors || []);
    }, [channel]);

    const handleAssign = async (userId: string) => {
        setLoading(true);
        try {
            await assignEditor(channel._id, userId);
            onSuccess();
        } catch (error) {
            console.error('Assign editor error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (userId: string) => {
        setLoading(true);
        try {
            await removeEditor(channel._id, userId);
            onSuccess();
        } catch (error) {
            console.error('Remove editor error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEditors = users.filter(
        (user) =>
            !assignedEditors.some((editor) => editor._id === user._id) &&
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Phân công Editor</DialogTitle>
                    <DialogDescription>
                        Quản lý editors cho kênh "{channel.name}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Editors */}
                    <div>
                        <h4 className="text-sm font-medium text-slate-900 mb-3">
                            Editors hiện tại ({assignedEditors.length})
                        </h4>
                        {assignedEditors.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-lg">
                                Chưa có editor nào được phân công
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {assignedEditors.map((editor) => (
                                    <div
                                        key={editor._id}
                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                    {editor.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {editor.name}
                                                </p>
                                                <p className="text-xs text-slate-500">{editor.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleRemove(editor._id)}
                                            disabled={loading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Available Editors */}
                    <div>
                        <h4 className="text-sm font-medium text-slate-900 mb-3">
                            Thêm Editor
                        </h4>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Tìm kiếm editor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {filteredEditors.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-lg">
                                {searchQuery
                                    ? 'Không tìm thấy editor nào'
                                    : 'Tất cả editors đã được phân công'}
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {filteredEditors.map((editor) => (
                                    <div
                                        key={editor._id}
                                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                                                    {editor.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {editor.name}
                                                </p>
                                                <p className="text-xs text-slate-500">{editor.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAssign(editor._id)}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Thêm
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}