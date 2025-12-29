'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getPatients() {
    return await prisma.user.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: {
                    appointments: true,
                    prescriptions: true,
                },
            },
        },
    })
}

export async function getPatient(id: number) {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            appointments: true,
            prescriptions: true,
        },
    })
}

export async function createPatient(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    await prisma.user.create({
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

    await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
        },
    })

    revalidatePath(`/admin/patients/${id}`)
    revalidatePath('/admin')
}
