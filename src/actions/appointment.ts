'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createAppointment(userId: number, formData: FormData) {
    const provider = (formData.get('provider') as string)?.trim()
    const datetimeStr = formData.get('datetime') as string
    const repeat = formData.get('repeat') as string

    if (!provider) return { error: 'Provider name is required' }
    if (!datetimeStr) return { error: 'Appointment date and time are required' }

    const datetime = new Date(datetimeStr)
    if (isNaN(datetime.getTime())) return { error: 'Invalid date format' }
    if (datetime < new Date()) return { error: 'Appointment must be in the future' }

    try {
        await db.appointment.create({
            data: {
                provider,
                datetime,
                repeat,
                userId,
            },
        })
    } catch (error: any) {
        return { error: error.message || 'Failed to schedule appointment' }
    }

    revalidatePath(`/admin/patients/${userId}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
    return { success: true }
}

export async function deleteAppointment(id: number) {
    try {
        await db.appointment.delete({
            where: { id },
        })
    } catch (error: any) {
        console.error('Failed to delete appointment:', error)
    }
    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
}

export async function updateAppointment(id: number, formData: FormData) {
    const provider = (formData.get('provider') as string)?.trim()
    const datetimeStr = formData.get('datetime') as string
    const repeat = formData.get('repeat') as string

    if (!provider) return { error: 'Provider name cannot be empty' }
    if (!datetimeStr) return { error: 'Appointment date and time are required' }

    const datetime = new Date(datetimeStr)
    if (isNaN(datetime.getTime())) return { error: 'Invalid date format' }
    if (datetime < new Date()) return { error: 'Updated appointment must be in the future' }

    try {
        await db.appointment.update({
            where: { id },
            data: {
                provider,
                datetime,
                repeat,
            },
        })
    } catch (error: any) {
        return { error: error.message || 'Failed to update appointment' }
    }

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/appointments')
    return { success: true }
}
