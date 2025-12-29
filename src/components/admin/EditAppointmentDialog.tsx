'use client'

import { updateAppointment } from '@/actions/appointment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Appointment } from '@prisma/client'
import { useState } from 'react'

interface EditAppointmentDialogProps {
    appointment: Appointment
}

export function EditAppointmentDialog({ appointment }: EditAppointmentDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                Edit
            </Button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Appointment">
                <form
                    action={async (formData) => {
                        await updateAppointment(appointment.id, formData)
                        setIsOpen(false)
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <Input id="provider" name="provider" defaultValue={appointment.provider} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="datetime">Date & Time</Label>
                        <Input
                            id="datetime"
                            name="datetime"
                            type="datetime-local"
                            defaultValue={new Date(appointment.datetime).toISOString().slice(0, 16)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repeat">Repeat</Label>
                        <select
                            id="repeat"
                            name="repeat"
                            defaultValue={appointment.repeat}
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
