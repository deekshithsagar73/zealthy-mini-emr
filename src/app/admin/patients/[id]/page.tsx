import { Appointment, Prescription, UserWithRelations } from '@/lib/db'
import { deleteAppointment } from '@/actions/appointment'
import { getPatient } from '@/actions/patient'
import { deletePrescription } from '@/actions/prescription'
import { AppointmentForm } from '@/components/admin/AppointmentForm'
import { PrescriptionForm } from '@/components/admin/PrescriptionForm'
import { EditPatientForm } from '@/components/admin/EditPatientForm'
import { EditAppointmentDialog } from '@/components/admin/EditAppointmentDialog'
import { EditPrescriptionDialog } from '@/components/admin/EditPrescriptionDialog'
import { PatientTabs } from '@/components/admin/PatientTabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Trash2, Calendar, Pill, ArrowLeft, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const patient = await getPatient(parseInt(id))

    if (!patient) {
        return <div>Patient not found</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-green-700" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{patient.name}</h2>
                        <p className="text-muted-foreground">{patient.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <EditPatientForm patient={patient} />
                    <Link href="/admin/patients">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                        </Button>
                    </Link>
                </div>
            </div>

            <PatientTabs
                appointmentsCount={patient.appointments.length}
                prescriptionsCount={patient.prescriptions.length}
                appointmentsContent={
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border border-gray-300 shadow overflow-hidden flex flex-col">
                            <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-green-800">
                                    <Calendar className="h-5 w-5" />
                                    Current Appointments ({patient.appointments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                {patient.appointments.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No appointments scheduled.</div>
                                ) : (
                                    <div className="divide-y max-h-[500px] overflow-y-auto">
                                        {patient.appointments.map((app: Appointment) => (
                                            <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{app.provider}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                            {format(new Date(app.datetime), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            {format(new Date(app.datetime), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                    {app.repeat !== 'none' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-2">
                                                            Repeats: {app.repeat}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <EditAppointmentDialog appointment={app} />
                                                    <form action={deleteAppointment.bind(null, app.id)}>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-300 shadow-sm bg-green-50/30">
                            <CardHeader className="pb-3 border-b border-green-100">
                                <CardTitle className="text-base font-semibold text-green-800">Schedule New Appointment</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <AppointmentForm userId={patient.id} />
                            </CardContent>
                        </Card>
                    </div>
                }
                prescriptionsContent={
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border border-gray-300 shadow overflow-hidden flex flex-col">
                            <CardHeader className="bg-green-50/50 border-b border-green-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-green-800">
                                    <Pill className="h-5 w-5" />
                                    Active Prescriptions ({patient.prescriptions.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                {patient.prescriptions.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">No prescriptions.</div>
                                ) : (
                                    <div className="divide-y max-h-[500px] overflow-y-auto">
                                        {patient.prescriptions.map((rx: Prescription) => (
                                            <div key={rx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{rx.medication} <span className="text-green-600">({rx.dosage})</span></p>
                                                    <p className="text-sm text-muted-foreground mt-1">Quantity: {rx.quantity}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded font-medium">
                                                            Refill: {format(new Date(rx.refillOn), 'MMM d, yyyy')}
                                                        </span>
                                                        {rx.refillSchedule !== 'none' && (
                                                            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded font-medium">
                                                                {rx.refillSchedule}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <EditPrescriptionDialog prescription={rx} />
                                                    <form action={deletePrescription.bind(null, rx.id)}>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-300 shadow-sm bg-green-50/30">
                            <CardHeader className="pb-3 border-b border-green-100">
                                <CardTitle className="text-base font-semibold text-green-800">Prescribe Medication</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <PrescriptionForm userId={patient.id} />
                            </CardContent>
                        </Card>
                    </div>
                }
            />
        </div>
    )
}
