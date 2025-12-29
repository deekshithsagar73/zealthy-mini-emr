import { Appointment, Prescription } from '@prisma/client'
import { addMonths, addWeeks, isBefore, isSameDay } from 'date-fns'

export type ScheduleItem = {
    date: Date
    originalId: number
    type: 'appointment' | 'refill'
    details: Appointment | Prescription
}

export function generateAppointmentSchedule(
    appointment: Appointment,
    startDate: Date,
    endDate: Date
): ScheduleItem[] {
    const items: ScheduleItem[] = []
    let currentDate = new Date(appointment.datetime)

    while (isBefore(currentDate, endDate)) {
        if (currentDate >= startDate || isSameDay(currentDate, startDate)) {
            items.push({
                date: currentDate,
                originalId: appointment.id,
                type: 'appointment',
                details: appointment,
            })
        }

        if (appointment.repeat === 'weekly') {
            currentDate = addWeeks(currentDate, 1)
        } else if (appointment.repeat === 'monthly') {
            currentDate = addMonths(currentDate, 1)
        } else {
            break
        }
    }

    return items
}

export function generateRefillSchedule(
    prescription: Prescription,
    startDate: Date,
    endDate: Date
): ScheduleItem[] {
    const items: ScheduleItem[] = []
    let currentDate = new Date(prescription.refillOn)

    while (isBefore(currentDate, endDate)) {
        if (currentDate >= startDate || isSameDay(currentDate, startDate)) {
            items.push({
                date: currentDate,
                originalId: prescription.id,
                type: 'refill',
                details: prescription,
            })
        }

        if (prescription.refillSchedule === 'weekly') {
            currentDate = addWeeks(currentDate, 1)
        } else if (prescription.refillSchedule === 'monthly') {
            currentDate = addMonths(currentDate, 1)
        } else {
            break
        }
    }

    return items
}
