'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createPrescription(userId: number, formData: FormData) {
    const medication = (formData.get('medication') as string)?.trim()
    const dosage = (formData.get('dosage') as string)?.trim()
    const quantity = parseInt(formData.get('quantity') as string)
    const refillOnStr = formData.get('refillOn') as string
    const refillSchedule = formData.get('refillSchedule') as string

    if (!medication) return { error: 'Medication name is required' }
    if (!dosage) return { error: 'Dosage is required' }
    if (isNaN(quantity) || quantity <= 0) return { error: 'Quantity must be a positive number' }
    if (!refillOnStr) return { error: 'Refill date is required' }

    const refillOn = new Date(refillOnStr)
    if (isNaN(refillOn.getTime())) return { error: 'Invalid date format' }
    if (refillOn < new Date()) return { error: 'Refill date must be in the future' }

    try {
        await db.prescription.create({
            data: {
                medication,
                dosage,
                quantity,
                refillOn,
                refillSchedule,
                userId,
            },
        })
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Failed to create prescription' }
    }

    revalidatePath(`/admin/patients/${userId}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
    return { success: true }
}

export async function deletePrescription(id: number) {
    try {
        await db.prescription.delete({
            where: { id },
        })
    } catch (error: unknown) {
        console.error('Failed to delete prescription:', error)
    }
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
}

export async function updatePrescription(id: number, formData: FormData) {
    const medication = (formData.get('medication') as string)?.trim()
    const dosage = (formData.get('dosage') as string)?.trim()
    const quantity = parseInt(formData.get('quantity') as string)
    const refillOnStr = formData.get('refillOn') as string
    const refillSchedule = formData.get('refillSchedule') as string

    if (!medication) return { error: 'Medication name cannot be empty' }
    if (!dosage) return { error: 'Dosage cannot be empty' }
    if (isNaN(quantity) || quantity <= 0) return { error: 'Quantity must be a positive number' }
    if (!refillOnStr) return { error: 'Refill date is required' }

    const refillOn = new Date(refillOnStr)
    if (isNaN(refillOn.getTime())) return { error: 'Invalid date format' }
    if (refillOn < new Date()) return { error: 'Updated refill date must be in the future' }

    try {
        await db.prescription.update({
            where: { id },
            data: {
                medication,
                dosage,
                quantity,
                refillOn,
                refillSchedule,
            },
        })
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Failed to update prescription' }
    }

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
    return { success: true }
}
