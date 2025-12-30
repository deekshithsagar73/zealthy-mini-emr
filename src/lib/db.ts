type User = {
    id: number
    name: string
    email: string
    password: string
    appointments: Appointment[]
    prescriptions: Prescription[]
}

type Appointment = {
    id: number
    provider: string
    datetime: Date
    repeat: string
    userId: number
}

type Prescription = {
    id: number
    medication: string
    dosage: string
    quantity: number
    refillOn: Date
    refillSchedule: string
    userId: number
}

const globalForDb = globalThis as unknown as {
    __db: {
        users: User[]
        appointments: Appointment[]
        prescriptions: Prescription[]
        nextUserId: number
        nextAppointmentId: number
        nextPrescriptionId: number
    }
}


import seedData from './data.json'

function getDb() {
    if (!globalForDb.__db) {
        console.log('Initializing in-memory database...')
        globalForDb.__db = {
            users: [],
            appointments: [],
            prescriptions: [],
            nextUserId: 1,
            nextAppointmentId: 1,
            nextPrescriptionId: 1,
        }
    }

    const db = globalForDb.__db

    // Seed if empty
    if (db.users.length === 0) {
        console.log('Seeding in-memory database with dummy data...')

        seedData.users.forEach(user => {
            const userAppointments = user.appointments.map(apt => ({
                id: apt.id,
                provider: apt.provider,
                datetime: new Date(apt.datetime),
                repeat: apt.repeat,
                userId: user.id
            }))
            const userPrescriptions = user.prescriptions.map(rx => ({
                id: rx.id,
                medication: rx.medication,
                dosage: rx.dosage,
                quantity: rx.quantity,
                refillOn: new Date(rx.refill_on),
                refillSchedule: rx.refill_schedule,
                userId: user.id
            }))

            db.users.push({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                appointments: [],
                prescriptions: []
            })

            db.appointments.push(...userAppointments)
            db.prescriptions.push(...userPrescriptions)
        })

        db.nextUserId = Math.max(...db.users.map(u => u.id), 0) + 1
        db.nextAppointmentId = Math.max(...db.appointments.map(a => a.id), 0) + 1
        db.nextPrescriptionId = Math.max(...db.prescriptions.map(p => p.id), 0) + 1
        console.log(`Seeding complete. ${db.users.length} users loaded.`)
    }

    return db
}




export const db = {
    user: {
        findMany: async () => {
            const db = getDb()
            return db.users.map(user => ({
                ...user,
                appointments: db.appointments.filter(a => a.userId === user.id),
                prescriptions: db.prescriptions.filter(p => p.userId === user.id),
                _count: {
                    appointments: db.appointments.filter(a => a.userId === user.id).length,
                    prescriptions: db.prescriptions.filter(p => p.userId === user.id).length,
                }
            })).sort((a, b) => a.name.localeCompare(b.name))
        },
        findUnique: async (args: { where: { id?: number; email?: string } }) => {
            const db = getDb()
            const user = db.users.find(u =>
                args.where.id ? u.id === args.where.id : u.email === args.where.email
            )
            if (!user) return null

            return {
                ...user,
                appointments: db.appointments.filter(a => a.userId === user.id),
                prescriptions: db.prescriptions.filter(p => p.userId === user.id),
            }
        },
        create: async (args: { data: { name: string; email: string; password: string } }) => {
            const db = getDb()
            const newUser: User = {
                id: db.nextUserId++,
                name: args.data.name,
                email: args.data.email,
                password: args.data.password,
                appointments: [],
                prescriptions: []
            }
            db.users.push(newUser)
            return newUser
        },
        update: async (args: { where: { id: number }; data: { name?: string; email?: string } }) => {
            const db = getDb()
            const user = db.users.find(u => u.id === args.where.id)
            if (!user) throw new Error('User not found')

            if (args.data.name) user.name = args.data.name
            if (args.data.email) user.email = args.data.email

            return user
        },
    },
    appointment: {
        create: async (args: { data: { provider: string; datetime: Date; repeat: string; userId: number } }) => {
            const db = getDb()
            const newAppointment: Appointment = {
                id: db.nextAppointmentId++,
                provider: args.data.provider,
                datetime: args.data.datetime,
                repeat: args.data.repeat,
                userId: args.data.userId,
            }
            db.appointments.push(newAppointment)
            return newAppointment
        },
        delete: async (args: { where: { id: number } }) => {
            const db = getDb()
            const index = db.appointments.findIndex(a => a.id === args.where.id)
            if (index === -1) throw new Error('Appointment not found')
            db.appointments.splice(index, 1)
            return { id: args.where.id }
        },
        update: async (args: { where: { id: number }; data: { provider?: string; datetime?: Date; repeat?: string } }) => {
            const db = getDb()
            const appointment = db.appointments.find(a => a.id === args.where.id)
            if (!appointment) throw new Error('Appointment not found')

            if (args.data.provider) appointment.provider = args.data.provider
            if (args.data.datetime) appointment.datetime = args.data.datetime
            if (args.data.repeat) appointment.repeat = args.data.repeat

            return appointment
        },
        findMany: async () => {
            const db = getDb()
            return db.appointments.map(apt => ({
                ...apt,
                user: db.users.find(u => u.id === apt.userId)!
            }))
        },
        count: async () => {
            const db = getDb()
            return db.appointments.length
        },
    },
    prescription: {
        create: async (args: { data: { medication: string; dosage: string; quantity: number; refillOn: Date; refillSchedule: string; userId: number } }) => {
            const db = getDb()
            const newPrescription: Prescription = {
                id: db.nextPrescriptionId++,
                medication: args.data.medication,
                dosage: args.data.dosage,
                quantity: args.data.quantity,
                refillOn: args.data.refillOn,
                refillSchedule: args.data.refillSchedule,
                userId: args.data.userId,
            }
            db.prescriptions.push(newPrescription)
            return newPrescription
        },
        delete: async (args: { where: { id: number } }) => {
            const db = getDb()
            const index = db.prescriptions.findIndex(p => p.id === args.where.id)
            if (index === -1) throw new Error('Prescription not found')
            db.prescriptions.splice(index, 1)
            return { id: args.where.id }
        },
        update: async (args: { where: { id: number }; data: { medication?: string; dosage?: string; quantity?: number; refillOn?: Date; refillSchedule?: string } }) => {
            const db = getDb()
            const prescription = db.prescriptions.find(p => p.id === args.where.id)
            if (!prescription) throw new Error('Prescription not found')

            if (args.data.medication) prescription.medication = args.data.medication
            if (args.data.dosage) prescription.dosage = args.data.dosage
            if (args.data.quantity !== undefined) prescription.quantity = args.data.quantity
            if (args.data.refillOn) prescription.refillOn = args.data.refillOn
            if (args.data.refillSchedule) prescription.refillSchedule = args.data.refillSchedule

            return prescription
        },
        findMany: async () => {
            const db = getDb()
            return db.prescriptions.map(rx => ({
                ...rx,
                user: db.users.find(u => u.id === rx.userId)!
            }))
        },
        count: async () => {
            const db = getDb()
            return db.prescriptions.length
        },
    },
}

export type { User, Appointment, Prescription }

