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

export async function createPatient(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await db.user.create({
        data: {
            name,
            email,
            password,
        },
    })

    revalidatePath('/admin')
    redirect('/admin')
}

export async function updatePatient(id: number, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    await db.user.update({
        where: { id },
        data: {
            name,
            email,
        },
    })

    revalidatePath(`/admin/patients/${id}`)
    revalidatePath('/admin')
}
