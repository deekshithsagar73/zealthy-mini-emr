'use client'

import { updatePatient } from '@/actions/patient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { User } from '@prisma/client'
import { useState } from 'react'

interface EditPatientFormProps {
    patient: User
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
                Edit Patient Info
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Patient Info">
                <form
                    action={async (formData) => {
                        await updatePatient(patient.id, formData)
                        setIsOpen(false)
                    }}
                    className="space-y-4"
                >
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
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
