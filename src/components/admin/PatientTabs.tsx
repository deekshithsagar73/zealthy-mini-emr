'use client'

import { useState } from 'react'
import { Calendar, Pill } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PatientTabsProps {
    appointmentsCount: number
    prescriptionsCount: number
    appointmentsContent: React.ReactNode
    prescriptionsContent: React.ReactNode
}

export function PatientTabs({ 
    appointmentsCount, 
    prescriptionsCount, 
    appointmentsContent, 
    prescriptionsContent 
}: PatientTabsProps) {
    const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions'>('appointments')

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={cn(
                            "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'appointments'
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        <Calendar className="h-5 w-5" />
                        Appointments
                        <span className={cn(
                            "ml-2 py-0.5 px-2 rounded-full text-xs font-semibold",
                            activeTab === 'appointments'
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        )}>
                            {appointmentsCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={cn(
                            "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'prescriptions'
                                ? "border-green-600 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        )}
                    >
                        <Pill className="h-5 w-5" />
                        Prescriptions
                        <span className={cn(
                            "ml-2 py-0.5 px-2 rounded-full text-xs font-semibold",
                            activeTab === 'prescriptions'
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        )}>
                            {prescriptionsCount}
                        </span>
                    </button>
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'appointments' && appointmentsContent}
                {activeTab === 'prescriptions' && prescriptionsContent}
            </div>
        </div>
    )
}

