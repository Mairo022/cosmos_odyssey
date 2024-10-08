import prisma from "../db/prisma";

export async function generateBookingKey(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let keyExists = false
    let key = ""
    let i = 0

    do {
        i++
        if (i === 100) {
            throw new Error(`Something went wrong while generating key for booking, looped ${i} times`)
        }

        key = ""

        while (key.length < 6) {
            const j = Math.floor(Math.random() * chars.length)
            key += chars[j]
        }

        keyExists = !!(await prisma.bookings.findUnique({
            select: {client_key: true},
            where: {client_key: key}
        }))
    } while (keyExists)

    return key
}
