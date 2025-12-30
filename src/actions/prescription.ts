'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createPrescription(userId: number, formData: FormData) {
    const medication = formData.get('medication') as string
    const dosage = formData.get('dosage') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const refillOn = formData.get('refillOn') as string
    const refillSchedule = formData.get('refillSchedule') as string

    await db.prescription.create({
        data: {
            medication,
            dosage,
            quantity,
            refillOn: new Date(refillOn),
            refillSchedule,
            userId,
        },
    })

    revalidatePath(`/admin/patients/${userId}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
}

export async function deletePrescription(id: number) {
    await db.prescription.delete({
        where: { id },
    })
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
}

export async function updatePrescription(id: number, formData: FormData) {
    const medication = formData.get('medication') as string
    const dosage = formData.get('dosage') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const refillOn = formData.get('refillOn') as string
    const refillSchedule = formData.get('refillSchedule') as string

    await db.prescription.update({
        where: { id },
        data: {
            medication,
            dosage,
            quantity,
            refillOn: new Date(refillOn),
            refillSchedule,
        },
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/prescriptions')
}
