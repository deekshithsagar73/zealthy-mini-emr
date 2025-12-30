import { getPatient } from '@/actions/patient'
import { Card, CardContent } from '@/components/ui/card'
import { generateRefillSchedule, ScheduleItem } from '@/lib/schedule'
import { addMonths, format, isToday, isPast, differenceInDays, startOfDay } from 'date-fns'
import { cookies } from 'next/headers'
import { Prescription } from '@/lib/db'
import { Pill, Calendar, AlertCircle, Clock, Package } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function PrescriptionsPage() {
    unstable_noStore()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('patient_session')?.value

    if (!sessionId) return null

    const patient = await getPatient(parseInt(sessionId))
    if (!patient) return <div>Patient not found</div>

    const today = startOfDay(new Date())
    const threeMonthsOut = addMonths(today, 3)


    let allRefills: ScheduleItem[] = []
    patient.prescriptions.forEach((rx: Prescription) => {
        const schedule = generateRefillSchedule(rx, today, threeMonthsOut)
        allRefills = [...allRefills, ...schedule]
    })

    allRefills.sort((a, b) => a.date.getTime() - b.date.getTime())

    const getRefillUrgency = (date: Date) => {
        const daysUntil = differenceInDays(date, today)
        if (daysUntil < 0) return { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200' }
        if (daysUntil <= 3) return { label: 'Due Soon', color: 'bg-orange-100 text-orange-700 border-orange-200' }
        if (daysUntil <= 7) return { label: 'This Week', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
        return { label: 'Upcoming', color: 'bg-green-100 text-green-700 border-green-200' }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Medications & Refills</h1>
                <p className="text-muted-foreground mt-2">Manage your prescriptions and view upcoming refills for the next 3 months.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Pill className="h-5 w-5 text-green-700" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Active Prescriptions</h2>
                    </div>
                    <div className="space-y-4">
                        {patient.prescriptions.length === 0 ? (
                            <Card className="border border-gray-200">
                                <CardContent className="p-6 text-center">
                                    <Pill className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No active prescriptions</p>
                                </CardContent>
                            </Card>
                        ) : (
                            patient.prescriptions.map((rx: Prescription) => (
                                <Card key={rx.id} className="border border-gray-300 shadow-sm hover:shadow-md transition-all bg-white group">
                                    <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500" />
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-gray-900">{rx.medication}</h3>
                                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                                                {rx.dosage}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                <span>Quantity: <span className="font-medium">{rx.quantity}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span>Schedule: <span className="font-medium capitalize">{rx.refillSchedule}</span></span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-xs text-gray-500">
                                                    Next refill: <span className="font-medium text-gray-700">{format(new Date(rx.refillOn), 'MMM d, yyyy')}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-700" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming Refills</h2>
                    </div>

                    {allRefills.length === 0 ? (
                        <Card className="border border-gray-200">
                            <CardContent className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No refills scheduled</h3>
                                <p className="text-sm text-gray-500">No refills are scheduled for the next 3 months.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {allRefills.map((item, index) => {
                                const prescription = item.details as Prescription
                                const urgency = getRefillUrgency(item.date)
                                const isPastRefill = isPast(item.date) && !isToday(item.date)

                                return (
                                    <Card
                                        key={`${item.originalId}-${index}`}
                                        className={`border transition-all group overflow-hidden ${isPastRefill
                                            ? 'border-red-200 bg-red-50/30'
                                            : 'border-gray-300 shadow-sm hover:shadow-md bg-white'
                                            }`}
                                    >
                                        <div className={`h-1 w-full ${isPastRefill
                                            ? 'bg-gradient-to-r from-red-400 to-red-500'
                                            : 'bg-gradient-to-r from-green-400 to-emerald-500'
                                            }`} />
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${urgency.color}`}>
                                                            {urgency.label}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                                                        {prescription.medication}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        {prescription.dosage}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className={`text-2xl font-bold ${isPastRefill ? 'text-red-600' : 'text-gray-900'
                                                        }`}>
                                                        {format(item.date, 'd')}
                                                    </div>
                                                    <div className="text-xs text-gray-500 uppercase font-medium">
                                                        {format(item.date, 'MMM')}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {format(item.date, 'yyyy')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                                                <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                                                <span>Contact pharmacy 2 days prior to refill date</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
