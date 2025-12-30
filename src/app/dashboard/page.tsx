import { Appointment, Prescription } from '@/lib/db'
import { getPatient } from '@/actions/patient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateAppointmentSchedule, generateRefillSchedule, ScheduleItem } from '@/lib/schedule'
import { addDays, format, startOfDay } from 'date-fns'
import { Calendar, Pill, ArrowRight, Activity } from 'lucide-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    unstable_noStore()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('patient_session')?.value

    if (!sessionId) return null

    const patient = await getPatient(parseInt(sessionId))
    if (!patient) {
        redirect('/')
    }


    const today = startOfDay(new Date())
    const nextWeek = addDays(today, 7)

    let upcomingAppointments: ScheduleItem[] = []
    patient.appointments.forEach((app: Appointment) => {
        const schedule = generateAppointmentSchedule(app, today, nextWeek)
        upcomingAppointments = [...upcomingAppointments, ...schedule]
    })

    let upcomingRefills: ScheduleItem[] = []
    patient.prescriptions.forEach((p: Prescription) => {
        const schedule = generateRefillSchedule(p, today, nextWeek)
        upcomingRefills = [...upcomingRefills, ...schedule]
    })

    upcomingAppointments.sort((a, b) => a.date.getTime() - b.date.getTime())
    upcomingRefills.sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-8 text-white shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {patient.name}</h2>
                    <p className="text-green-50 opacity-90">Here&apos;s your health overview for the week.</p>
                </div>
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 right-10 h-32 w-32 translate-y-1/3 rounded-full bg-green-400/20 blur-2xl" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Appointments (7 Days)</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Calendar className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {upcomingAppointments.length > 0 ? 'You have upcoming visits.' : 'No visits scheduled.'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Refills Due (7 Days)</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Pill className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{upcomingRefills.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {upcomingRefills.length > 0 ? 'Refills needed soon.' : 'No refills due.'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Health Status</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Activity className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-green-600">Active</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Your account is in good standing.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-gray-300 shadow overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-200">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            Appointments This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {upcomingAppointments.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground bg-white">No appointments scheduled.</div>
                        ) : (
                            <div className="divide-y">
                                {upcomingAppointments.map((item: ScheduleItem, index: number) => (
                                    <div key={`${item.originalId}-${index}`} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{(item.details as Appointment).provider}</p>
                                            <p className="text-sm text-muted-foreground">{format(item.date, 'PPP p')}</p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="p-4 bg-gray-50/50 border-t">
                            <Link href="/dashboard/appointments" className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                                View all appointments <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-300 shadow overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-200">
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-green-600" />
                            Refills This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {upcomingRefills.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground bg-white">No refills due.</div>
                        ) : (
                            <div className="divide-y">
                                {upcomingRefills.map((item: ScheduleItem, index: number) => (
                                    <div key={`${item.originalId}-${index}`} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{(item.details as Prescription).medication} ({(item.details as Prescription).dosage})</p>
                                            <p className="text-sm text-muted-foreground">Refill on: {format(item.date, 'PPP')}</p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="p-4 bg-gray-50/50 border-t">
                            <Link href="/dashboard/prescriptions" className="flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                                View all prescriptions <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
