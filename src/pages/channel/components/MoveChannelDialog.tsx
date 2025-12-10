// src/pages/channels/components/MoveChannelDialog.tsx
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useChannels } from '@/hooks/useChannels';
import { useBranches } from '@/hooks/useBranches';
import { useTeams } from '@/hooks/useTeams';
import { Loader2, ArrowRight } from 'lucide-react';
import type { Channel } from '@/types/channel.types';

interface MoveChannelDialogProps {
    channel: Channel;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function MoveChannelDialog({
    channel,
    isOpen,
    onClose,
    onSuccess,
}: MoveChannelDialogProps) {
    const { moveToTeam } = useChannels({ autoFetch: false });
    const { branches } = useBranches();
    const { teams } = useTeams();

    const [loading, setLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTeam) {
            return;
        }

        setLoading(true);
        try {
            await moveToTeam(channel._id, selectedTeam);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Move channel error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedBranch('');
        setSelectedTeam('');
        onClose();
    };

    const filteredTeams = selectedBranch
        ? teams.filter((team) => team.branch._id === selectedBranch)
        : teams;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chuyển kênh sang Team khác</DialogTitle>
                    <DialogDescription>
                        Chuyển kênh "{channel.name}" sang team mới
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Assignment */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-2">
                            Vị trí hiện tại:
                        </p>
                        <div className="flex items-center gap-2">
                            {channel.team?.branch && (
                                <>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {channel.team.branch.name}
                                    </Badge>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </>
                            )}
                            {channel.team ? (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    {channel.team.name}
                                </Badge>
                            ) : (
                                <span className="text-sm text-slate-500 italic">Chưa gán team</span>
                            )}
                        </div>
                    </div>

                    {/* New Assignment */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="branch">
                                Chọn Chi nhánh
                            </Label>
                            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn chi nhánh" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            {branch.code ? `${branch.code} - ` : ''}{branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="team">
                                Chọn Team <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedTeam}
                                onValueChange={setSelectedTeam}
                                disabled={!selectedBranch}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={selectedBranch ? "Chọn team" : "Vui lòng chọn chi nhánh trước"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredTeams.map((team) => (
                                        <SelectItem key={team._id} value={team._id}>
                                            {team.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedBranch && filteredTeams.length === 0 && (
                                <p className="text-sm text-amber-600">
                                    Chi nhánh này chưa có team nào
                                </p>
                            )}
                        </div>
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
                        <Button
                            variant="outline" type="submit" disabled={loading || !selectedTeam}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Chuyển team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}