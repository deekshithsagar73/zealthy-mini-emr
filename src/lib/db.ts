import { PrismaClient, User, Appointment, Prescription } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export type UserWithRelations = User & {
    appointments: Appointment[]
    prescriptions: Prescription[]
    _count?: {
        appointments: number
        prescriptions: number
    }
}

const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}

export const db = {
    user: {
        findMany: async (): Promise<UserWithRelations[]> => {
            return await prisma.user.findMany({
                include: {
                    appointments: true,
                    prescriptions: true,
                    _count: {
                        select: {
                            appointments: true,
                            prescriptions: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            }) as UserWithRelations[]
        },
        findUnique: async (args: { where: { id?: number; email?: string } }): Promise<UserWithRelations | null> => {
            return await prisma.user.findUnique({
                where: args.where as any,
                include: {
                    appointments: true,
                    prescriptions: true,
                },
            }) as UserWithRelations | null
        },
        create: async (args: { data: { name: string; email: string; password: string } }) => {
            if (!args.data.name.trim()) throw new Error('Name is required.')
            if (!args.data.email.trim()) throw new Error('Email is required.')
            if (!validateEmail(args.data.email)) throw new Error('Invalid email format.')
            if (args.data.password.length < 6) throw new Error('Password must be at least 6 characters.')

            const existing = await prisma.user.findUnique({ where: { email: args.data.email } })
            if (existing) {
                throw new Error('A patient with this email already exists.')
            }
            return await prisma.user.create({
                data: args.data,
            })
        },
        update: async (args: { where: { id: number }; data: { name?: string; email?: string } }) => {
            if (args.data.name !== undefined && !args.data.name.trim()) throw new Error('Name cannot be empty.')
            if (args.data.email !== undefined) {
                if (!args.data.email.trim()) throw new Error('Email cannot be empty.')
                if (!validateEmail(args.data.email)) throw new Error('Invalid email format.')

                const existing = await prisma.user.findUnique({ where: { email: args.data.email } })
                if (existing && existing.id !== args.where.id) {
                    throw new Error('This email is already in use by another patient.')
                }
            }
            return await prisma.user.update({
                where: args.where,
                data: args.data,
            })
        },
    },
    appointment: {
        create: async (args: { data: { provider: string; datetime: Date; repeat: string; userId: number } }) => {
            if (!args.data.provider.trim()) throw new Error('Provider name is required.')
            if (args.data.datetime < new Date()) throw new Error('Appointment must be in the future.')

            return await prisma.appointment.create({
                data: args.data,
            })
        },
        delete: async (args: { where: { id: number } }) => {
            return await prisma.appointment.delete({
                where: args.where,
            })
        },
        update: async (args: { where: { id: number }; data: { provider?: string; datetime?: Date; repeat?: string } }) => {
            if (args.data.provider !== undefined && !args.data.provider.trim()) throw new Error('Provider name cannot be empty.')
            if (args.data.datetime !== undefined && args.data.datetime < new Date()) {
                throw new Error('Updated appointment time must be in the future.')
            }

            return await prisma.appointment.update({
                where: args.where,
                data: args.data,
            })
        },
        findMany: async () => {
            return await prisma.appointment.findMany({
                include: {
                    user: true,
                },
            })
        },
        count: async () => {
            return await prisma.appointment.count()
        },
    },
    prescription: {
        create: async (args: { data: { medication: string; dosage: string; quantity: number; refillOn: Date; refillSchedule: string; userId: number } }) => {
            if (!args.data.medication.trim()) throw new Error('Medication name is required.')
            if (!args.data.dosage.trim()) throw new Error('Dosage is required.')
            if (args.data.quantity <= 0) throw new Error('Quantity must be greater than 0.')
            if (args.data.refillOn < new Date()) throw new Error('Refill date must be in the future.')

            return await prisma.prescription.create({
                data: args.data,
            })
        },
        delete: async (args: { where: { id: number } }) => {
            return await prisma.prescription.delete({
                where: args.where,
            })
        },
        update: async (args: { where: { id: number }; data: { medication?: string; dosage?: string; quantity?: number; refillOn?: Date; refillSchedule?: string } }) => {
            if (args.data.medication !== undefined && !args.data.medication.trim()) throw new Error('Medication name cannot be empty.')
            if (args.data.dosage !== undefined && !args.data.dosage.trim()) throw new Error('Dosage cannot be empty.')
            if (args.data.quantity !== undefined && args.data.quantity <= 0) throw new Error('Quantity must be greater than 0.')
            if (args.data.refillOn !== undefined && args.data.refillOn < new Date()) {
                throw new Error('Updated refill date must be in the future.')
            }

            return await prisma.prescription.update({
                where: args.where,
                data: args.data,
            })
        },
        findMany: async () => {
            return await prisma.prescription.findMany({
                include: {
                    user: true,
                },
            })
        },
        count: async () => {
            return await prisma.prescription.count()
        },
    },
}

export type { User, Appointment, Prescription }
