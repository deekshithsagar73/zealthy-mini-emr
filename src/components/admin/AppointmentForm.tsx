'use client'

import { createAppointment } from '@/actions/appointment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef } from 'react'

export function AppointmentForm({ userId }: { userId: number }) {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form
            action={async (formData: FormData) => {
                await createAppointment(userId, formData)
                formRef.current?.reset()
            }}
            ref={formRef}
            className="space-y-4 border p-4 rounded-md bg-gray-50"
        >
            <h3 className="font-medium">Schedule New Appointment</h3>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" name="provider" required placeholder="Dr. Smith" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="datetime">Date & Time</Label>
                    <Input id="datetime" name="datetime" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="repeat">Repeat</Label>
                    <select
                        id="repeat"
                        name="repeat"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="none">None</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>
            <Button type="submit" size="sm">Schedule Appointment</Button>
        </form>
    )
}
