import { getPatients } from '@/actions/patient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Pill, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    unstable_noStore()
    const patients = await getPatients()
    const totalPatients = patients.length
    const totalAppointments = await db.appointment.count()
    const totalPrescriptions = await db.prescription.count()

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-8 text-white shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h2>
                    <p className="text-green-50 opacity-90">Manage patients, appointments, and prescriptions.</p>
                </div>
                <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 right-10 h-32 w-32 translate-y-1/3 rounded-full bg-green-400/20 blur-2xl" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Users className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{totalPatients}</div>
                        <Link href="/admin/patients" className="flex items-center text-xs text-green-700 hover:text-green-800 mt-2 transition-colors">
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </CardContent>
                </Card>
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Calendar className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{totalAppointments}</div>
                        <p className="text-xs text-muted-foreground mt-2">Manage via patient records</p>
                    </CardContent>
                </Card>
                <Card className="border border-gray-300 shadow hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Prescriptions</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                            <Pill className="h-4 w-4 text-green-700" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{totalPrescriptions}</div>
                        <p className="text-xs text-muted-foreground mt-2">Manage via patient records</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
