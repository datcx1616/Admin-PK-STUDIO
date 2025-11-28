// src/pages/channels/components/CreateChannelDialog.tsx
import React, { useState } from 'react';
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

interface CreateChannelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateChannelDialog({
    isOpen,
    onClose,
    onSuccess,
}: CreateChannelDialogProps) {
    const { createChannel } = useChannels({ autoFetch: false });
    const { teams } = useTeams();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        youtubeChannelId: '',
        name: '',
        teamId: '',
        accessToken: '',
        refreshToken: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.youtubeChannelId || !formData.name) {
            return;
        }

        setLoading(true);
        try {
            await createChannel({
                youtubeChannelId: formData.youtubeChannelId,
                name: formData.name,
                teamId: formData.teamId && formData.teamId !== 'none' ? formData.teamId : undefined,
                accessToken: formData.accessToken,
                refreshToken: formData.refreshToken,
            });
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Create channel error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            youtubeChannelId: '',
            name: '',
            teamId: '',
            accessToken: '',
            refreshToken: '',
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm kênh YouTube mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin kênh YouTube để thêm vào hệ thống
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="youtubeChannelId">
                            YouTube Channel ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="youtubeChannelId"
                            placeholder="UC..."
                            value={formData.youtubeChannelId}
                            onChange={(e) =>
                                setFormData({ ...formData, youtubeChannelId: e.target.value })
                            }
                            required
                        />
                    </div>

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
                        <Label htmlFor="teamId">Team (Tùy chọn)</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="accessToken">Access Token</Label>
                        <Input
                            id="accessToken"
                            type="password"
                            placeholder="Nhập access token"
                            value={formData.accessToken}
                            onChange={(e) =>
                                setFormData({ ...formData, accessToken: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="refreshToken">Refresh Token</Label>
                        <Input
                            id="refreshToken"
                            type="password"
                            placeholder="Nhập refresh token"
                            value={formData.refreshToken}
                            onChange={(e) =>
                                setFormData({ ...formData, refreshToken: e.target.value })
                            }
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Thêm kênh
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}