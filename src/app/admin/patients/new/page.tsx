'use client'

import { createPatient } from '@/actions/patient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useActionState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function NewPatientPage() {
    const [state, formAction, isPending] = useActionState(createPatient, null)

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Patient</h2>
                <Link href="/admin/patients">
                    <Button variant="outline">Cancel</Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {state.error}
                        </div>
                    )}

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
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create Patient'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
