import { createPatient } from '@/actions/patient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewPatientPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Patient</h2>
                <Link href="/admin">
                    <Button variant="outline">Cancel</Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <form action={createPatient} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="John Doe" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required placeholder="Secret123!" />
                        <p className="text-xs text-muted-foreground">
                            Set a temporary password for the patient.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full">Create Patient</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
