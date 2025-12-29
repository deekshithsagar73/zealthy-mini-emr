import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
    const dataPath = path.join(__dirname, 'data.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

    for (const user of data.users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: user.password,
                appointments: {
                    create: user.appointments.map(a => ({
                        provider: a.provider,
                        datetime: new Date(a.datetime),
                        repeat: a.repeat
                    }))
                },
                prescriptions: {
                    create: user.prescriptions.map(p => ({
                        medication: p.medication,
                        dosage: p.dosage,
                        quantity: p.quantity,
                        refillOn: new Date(p.refill_on),
                        refillSchedule: p.refill_schedule
                    }))
                }
            }
        })
    }
    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
