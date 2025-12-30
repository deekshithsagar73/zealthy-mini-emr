'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getPatients() {
    return await db.user.findMany()
}

export async function getPatient(id: number) {
    return await db.user.findUnique({ where: { id } })
}

export async function createPatient(_prevState: { error: string } | null, formData: FormData) {
    const name = (formData.get('name') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    if (!name) return { error: 'Name is required' }
    if (!email) return { error: 'Email is required' }
    if (!email.includes('@')) return { error: 'Invalid email format' }
    if (password.length < 6) return { error: 'Password must be at least 6 characters' }

    try {
        await db.user.create({
            data: {
                name,
                email,
                password,
            },
        })
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Failed to create patient' }
    }

    revalidatePath('/admin/patients')
    redirect('/admin/patients')
}

export async function updatePatient(id: number, formData: FormData) {
    const name = (formData.get('name') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()

    if (!name) return { error: 'Name cannot be empty' }
    if (!email) return { error: 'Email cannot be empty' }
    if (!email.includes('@')) return { error: 'Invalid email format' }

    try {
        await db.user.update({
            where: { id },
            data: {
                name,
                email,
            },
        })
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : 'Failed to update patient' }
    }

    revalidatePath(`/admin/patients/${id}`)
    revalidatePath('/admin')
    return { success: true }
}
