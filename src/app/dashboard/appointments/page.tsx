import { getPatient } from '@/actions/patient'
import { AppointmentList } from '@/components/dashboard/AppointmentList'
import { generateAppointmentSchedule, ScheduleItem } from '@/lib/schedule'
import { addMonths, startOfDay } from 'date-fns'
import { cookies } from 'next/headers'
import { Appointment } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('patient_session')?.value

    if (!sessionId) return null

    const patient = await getPatient(parseInt(sessionId))
    if (!patient) return <div>Patient not found</div>

    const today = startOfDay(new Date())
    const threeMonthsOut = addMonths(today, 3)


    let allAppointments: ScheduleItem[] = []
    patient.appointments.forEach((app: Appointment) => {
        const schedule = generateAppointmentSchedule(app, today, threeMonthsOut)
        allAppointments = [...allAppointments, ...schedule]
    })

    allAppointments.sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Schedule</h1>
                <p className="text-muted-foreground mt-2">Upcoming appointments for the next 3 months.</p>
            </div>

            <AppointmentList appointments={allAppointments} />
        </div>
    )
}
