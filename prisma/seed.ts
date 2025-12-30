import { PrismaClient } from '@prisma/client'
import seedData from '../src/lib/data.json'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    for (const user of seedData.users) {
        const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        })

        console.log(`Seeded user: ${createdUser.name}`)

        for (const apt of user.appointments) {
            await prisma.appointment.create({
                data: {
                    provider: apt.provider,
                    datetime: new Date(apt.datetime),
                    repeat: apt.repeat,
                    userId: createdUser.id,
                },
            })
        }

        for (const rx of user.prescriptions) {
            await prisma.prescription.create({
                data: {
                    medication: rx.medication,
                    dosage: rx.dosage,
                    quantity: rx.quantity,
                    refillOn: new Date(rx.refill_on),
                    refillSchedule: rx.refill_schedule,
                    userId: createdUser.id,
                },
            })
        }
    }

    console.log('Seed complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
