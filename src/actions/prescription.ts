'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPrescription(userId: number, formData: FormData) {
    const medication = formData.get('medication') as string
    const dosage = formData.get('dosage') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const refillOn = formData.get('refillOn') as string
    const refillSchedule = formData.get('refillSchedule') as string

    await prisma.prescription.create({
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
    await prisma.prescription.delete({
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

    await prisma.prescription.update({
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
