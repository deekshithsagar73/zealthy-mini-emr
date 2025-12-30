'use client'

import { createPrescription } from '@/actions/prescription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import data from '@/lib/data.json'

export function PrescriptionForm({ userId }: { userId: number }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    return (
        <form
            action={async (formData: FormData) => {
                setIsPending(true)
                setError(null)
                const result = await createPrescription(userId, formData)
                setIsPending(false)
                if (result?.error) {
                    setError(result.error)
                } else {
                    formRef.current?.reset()
                }
            }}
            ref={formRef}
            className="space-y-4 border p-4 rounded-md bg-gray-50"
        >
            <h3 className="font-medium">Prescribe Medication</h3>

            {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <select
                        id="medication"
                        name="medication"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {data.dosages.map((d: string) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="refillOn">Refill On</Label>
                    <Input id="refillOn" name="refillOn" type="date" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="refillSchedule">Refill Schedule</Label>
                    <select
                        id="refillSchedule"
                        name="refillSchedule"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Prescription'}
            </Button>
        </form>
    )
}
