'use client'

import { updatePatient } from '@/actions/patient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { User } from '@/lib/db'
import { useState } from 'react'

import { AlertCircle } from 'lucide-react'

interface EditPatientFormProps {
    patient: User
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    return (
        <>
            <Button variant="outline" onClick={() => {
                setError(null)
                setIsOpen(true)
            }}>
                Edit Patient Info
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Patient Info">
                <form
                    action={async (formData) => {
                        setIsPending(true)
                        setError(null)
                        const result = await updatePatient(patient.id, formData)
                        setIsPending(false)
                        if (result?.error) {
                            setError(result.error)
                        } else {
                            setIsOpen(false)
                        }
                    }}
                    className="space-y-4"
                >
                    {error && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={patient.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={patient.email} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
