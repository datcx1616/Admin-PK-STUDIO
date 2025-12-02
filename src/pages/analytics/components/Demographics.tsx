import { Users, PieChart, Globe } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { AnalyticsResponse } from "./types"
import { formatNumber, getAgeGroupName } from "./utils"

interface DemographicsProps {
    analytics: AnalyticsResponse
}

export function Demographics({ analytics }: DemographicsProps) {
    if (!analytics.demographics) return null

    const { ageGroups, gender, topCountries } = analytics.demographics

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Groups */}
            {ageGroups.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Age Demographics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {ageGroups.map((age, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{getAgeGroupName(age.ageGroup)}</span>
                                        <span className="text-sm font-bold text-gray-900">{age.viewsPercentage.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={age.viewsPercentage} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gender & Top Countries */}
            <div className="space-y-6">
                {(gender.male > 0 || gender.female > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-pink-600" />
                                Gender Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Male</span>
                                        <span className="text-sm font-bold text-gray-900">{gender.male.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={gender.male} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">Female</span>
                                        <span className="text-sm font-bold text-gray-900">{gender.female.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={gender.female} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {topCountries.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                Top Countries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {topCountries.map((country, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="w-10 justify-center">
                                                {country.country}
                                            </Badge>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{country.countryName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatNumber(country.views)} views • {formatNumber(country.watchTimeMinutes)} mins
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{country.percentage.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
