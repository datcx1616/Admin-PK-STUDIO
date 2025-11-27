// src/pages/examples/team/components/site-header.tsx
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { AddBranchModal } from './add-branch-modal'
import { AddTeamModal } from './add-team-modal'

interface SiteHeaderProps {
    onBranchAdded?: () => void
    onTeamAdded?: () => void
}

export function SiteHeader({ onBranchAdded, onTeamAdded }: SiteHeaderProps) {
    const [showAddBranchModal, setShowAddBranchModal] = useState(false)
    const [showAddTeamModal, setShowAddTeamModal] = useState(false)

    const handleBranchSuccess = () => {
        setShowAddBranchModal(false)
        onBranchAdded?.()
    }

    const handleTeamSuccess = () => {
        setShowAddTeamModal(false)
        onTeamAdded?.()
    }

    return (
        <>
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản Lý chính nhánh</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            // variant="outline"
                            className=" bg-red-600 hover:bg-red-700 gap-2"
                            onClick={() => setShowAddBranchModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Thêm Chi Nhánh
                        </Button>
                        {/* <Button
                            className="bg-red-600 hover:bg-red-700 gap-2"
                            onClick={() => setShowAddTeamModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Thêm Nhóm
                        </Button> */}
                    </div>
                </div>
            </header>

            {/* Add Branch Modal */}
            <AddBranchModal
                open={showAddBranchModal}
                onClose={() => setShowAddBranchModal(false)}
                onSuccess={handleBranchSuccess}
            />

            {/* Add Team Modal */}
            <AddTeamModal
                open={showAddTeamModal}
                onClose={() => setShowAddTeamModal(false)}
                onSuccess={handleTeamSuccess}
            />
        </>
    )
}