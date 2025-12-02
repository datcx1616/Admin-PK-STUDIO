// src/pages/channels/components/EditChannelDialog.tsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useChannels } from '@/hooks/useChannels';
import { useTeams } from '@/hooks/useTeams';
import { Loader2 } from 'lucide-react';
import type { Channel } from '@/types/channel.types';

interface EditChannelDialogProps {
    channel: Channel;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditChannelDialog({
    channel,
    isOpen,
    onClose,
    onSuccess,
}: EditChannelDialogProps) {
    const { updateChannel } = useChannels({ autoFetch: false });
    const { teams } = useTeams();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        teamId: '',
    });

    useEffect(() => {
        if (channel) {
            setFormData({
                name: channel.name || '',
                description: channel.description || '',
                teamId: channel.team?._id || '',
            });
        }
    }, [channel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            return;
        }

        console.log('=== EDIT CHANNEL SUBMIT ===');
        console.log('Current channel:', channel);
        console.log('Form data:', formData);
        console.log('Team ID to send:', formData.teamId && formData.teamId !== 'none' ? formData.teamId : undefined);

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                teamId: formData.teamId && formData.teamId !== 'none' ? formData.teamId : undefined,
            };

            console.log('Update payload:', updateData);

            const result = await updateChannel(channel._id, updateData);

            console.log('Update result:', result);
            console.log('✅ Channel updated successfully');

            onSuccess();
        } catch (error) {
            console.error('❌ Update channel error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa kênh</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin kênh YouTube
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên kênh <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Nhập tên kênh"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Nhập mô tả kênh"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teamId">Team</Label>
                        <Select
                            value={formData.teamId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, teamId: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Không gán team</SelectItem>
                                {teams.map((team) => (
                                    <SelectItem key={team._id} value={team._id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="outline"
                            type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}