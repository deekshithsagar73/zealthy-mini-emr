'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ScheduleItem } from '@/lib/schedule'
import { Appointment } from '@prisma/client'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { Calendar, Clock, MapPin, ChevronDown, Repeat } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AppointmentListProps {
    appointments: ScheduleItem[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
    const [visibleCount, setVisibleCount] = useState(10)

    const visibleAppointments = appointments.slice(0, visibleCount)
    const hasMore = visibleCount < appointments.length

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 10)
    }

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today'
        if (isTomorrow(date)) return 'Tomorrow'
        return format(date, 'EEEE, MMMM do')
    }

    const getDateBadgeColor = (date: Date) => {
        if (isPast(date) && !isToday(date)) return 'bg-gray-100 text-gray-600'
        if (isToday(date)) return 'bg-green-100 text-green-700'
        if (isTomorrow(date)) return 'bg-blue-100 text-blue-700'
        return 'bg-gray-100 text-gray-700'
    }

    if (appointments.length === 0) {
        return (
            <Card className="border border-gray-200 shadow-sm">
                <CardContent className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
                    <p className="text-sm text-gray-500">You&apos;re all caught up! Check back later for new appointments.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {visibleAppointments.map((item, index) => {
                    const appointment = item.details as Appointment
                    const isPastAppointment = isPast(item.date) && !isToday(item.date)
                    
                    return (
                        <Card 
                            key={`${item.originalId}-${index}`} 
                            className={`border transition-all duration-200 group overflow-hidden ${
                                isPastAppointment 
                                    ? 'border-gray-200 bg-gray-50/50' 
                                    : 'border-gray-300 shadow-sm hover:shadow-md bg-white'
                            }`}
                        >
                            <div className={`h-full w-1 absolute left-0 top-0 ${
                                isPastAppointment ? 'bg-gray-300' : 'bg-gradient-to-b from-green-500 to-emerald-500'
                            }`} />
                            <CardContent className="p-6 pl-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDateBadgeColor(item.date)}`}>
                                                {getDateLabel(item.date)}
                                            </span>
                                            {appointment.repeat !== 'none' && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                    <Repeat className="h-3 w-3" />
                                                    {appointment.repeat}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{appointment.provider}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">{format(item.date, 'h:mm a')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>{format(item.date, 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100 transition-colors border border-green-100">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={handleShowMore}
                        variant="outline"
                        className="min-w-[200px] gap-2 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                    >
                        Show More <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="text-center text-xs text-gray-500 pt-2">
                Showing {visibleAppointments.length} of {appointments.length} appointments
            </div>
        </div>
    )
}
