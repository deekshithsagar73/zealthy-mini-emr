import { getPatients } from '@/actions/patient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@prisma/client'
import { Plus, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function PatientsPage() {
    const patients = await getPatients()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Patient Management</h2>
                    <p className="text-muted-foreground mt-1">Manage patient records and EMR data.</p>
                </div>
                <Link href="/admin/patients/new">
                    <Button className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> New Patient
                    </Button>
                </Link>
            </div>

            <Card className="border border-gray-300 shadow overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-200">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-gray-500" />
                        All Patients
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium text-center">Appointments</th>
                                    <th className="px-6 py-4 font-medium text-center">Prescriptions</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {patients.map((patient: User & { _count?: { appointments: number; prescriptions: number } }) => (
                                    <tr key={patient.id} className="bg-white hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                {patient.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{patient.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={`/admin/patients/${patient.id}`}>
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors">
                                                    {patient._count?.appointments || 0}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={`/admin/patients/${patient.id}`}>
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors">
                                                    {patient._count?.prescriptions || 0}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/patients/${patient.id}`}>
                                                <Button variant="ghost" size="sm" className="text-gray-400 group-hover:text-green-600">
                                                    Details <ChevronRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

