'use client'

import { updatePrescription } from '@/actions/prescription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Prescription } from '@prisma/client'
import { useState } from 'react'
import data from '@/lib/data.json'

interface EditPrescriptionDialogProps {
    prescription: Prescription
}

export function EditPrescriptionDialog({ prescription }: EditPrescriptionDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                Edit
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Prescription">
                <form
                    action={async (formData) => {
                        await updatePrescription(prescription.id, formData)
                        setIsOpen(false)
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="medication">Medication</Label>
                        <select
                            id="medication"
                            name="medication"
                            defaultValue={prescription.medication}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {data.medications.map((m: string) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <select
                            id="dosage"
                            name="dosage"
                            defaultValue={prescription.dosage}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {data.dosages.map((d: string) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="number" defaultValue={prescription.quantity} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="refillOn">Next Refill Date</Label>
                        <Input
                            id="refillOn"
                            name="refillOn"
                            type="date"
                            defaultValue={new Date(prescription.refillOn).toISOString().slice(0, 10)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="refillSchedule">Refill Schedule</Label>
                        <select
                            id="refillSchedule"
                            name="refillSchedule"
                            defaultValue={prescription.refillSchedule}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="none">None</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
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
