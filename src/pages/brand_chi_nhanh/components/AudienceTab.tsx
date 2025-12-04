import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { TeamCard } from "./TeamCard"
import { useNavigate } from "react-router-dom"
import { type TeamWithStats } from "../types"

interface AudienceTabProps {
    teams: TeamWithStats[]
    totalMembers: number
}

export function AudienceTab({ teams, totalMembers }: AudienceTabProps) {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Teams ({teams.length})
                    </CardTitle>
                    <CardDescription>
                        {totalMembers} thành viên trên tất cả các teams
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {teams.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {teams.map((team) => (
                                <TeamCard
                                    key={team._id}
                                    team={team}
                                    onClick={() => navigate(`/teams/${team._id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 rounded-lg border border-dashed bg-muted/30 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Không tìm thấy team trong chi nhánh này</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
