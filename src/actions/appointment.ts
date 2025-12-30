'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createAppointment(userId: number, formData: FormData) {
    const provider = formData.get('provider') as string
    const datetime = formData.get('datetime') as string
    const repeat = formData.get('repeat') as string

    await db.appointment.create({
        data: {
            provider,
            datetime: new Date(datetime),
            repeat,
            userId,
        },
    })

    revalidatePath(`/admin/patients/${userId}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
}

export async function deleteAppointment(id: number) {
    await db.appointment.delete({
        where: { id },
    })
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
}

export async function updateAppointment(id: number, formData: FormData) {
    const provider = formData.get('provider') as string
    const datetime = formData.get('datetime') as string
    const repeat = formData.get('repeat') as string

    await db.appointment.update({
        where: { id },
        data: {
            provider,
            datetime: new Date(datetime),
            repeat,
        },
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
}
