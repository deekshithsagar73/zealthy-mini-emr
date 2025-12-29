const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const mark = await prisma.user.findFirst({
        where: { email: 'mark@some-email-provider.net' },
    })

    if (!mark) {
        console.log('User Mark not found')
        return
    }

    // Add 2 Appointments
    await prisma.appointment.create({
        data: {
            userId: mark.id,
            provider: 'Dr. Emily Chen',
            datetime: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
            repeat: 'none',
        },
    })

    await prisma.appointment.create({
        data: {
            userId: mark.id,
            provider: 'Dr. Michael Ross',
            datetime: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
            repeat: 'monthly',
        },
    })

    // Add 2 Prescriptions
    await prisma.prescription.create({
        data: {
            userId: mark.id,
            medication: 'Lipitor',
            dosage: '10mg',
            quantity: 1,
            refillOn: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
            refillSchedule: 'monthly',
        },
    })

    await prisma.prescription.create({
        data: {
            userId: mark.id,
            medication: 'Amoxicillin',
            dosage: '500mg',
            quantity: 1,
            refillOn: new Date(new Date().setDate(new Date().getDate() + 6)), // 6 days from now
            refillSchedule: 'none',
        },
    })

    console.log('Added 2 appointments and 2 prescriptions for Mark')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
