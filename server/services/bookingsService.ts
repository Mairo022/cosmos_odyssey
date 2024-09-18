import {BookingClient, BookingDB} from "../types/booking";
import prisma from "../db/prisma";

export async function findBooking(bookingID: string): Promise<BookingDB> {
    return prisma.bookings.findFirst({
        where: {
            id: bookingID
        }
    })
}

export async function cancelBookingService(bookingID: string): Promise<void> {
  await prisma.bookings.update({
    where: {id: bookingID},
    data: {cancelled: true}
  })
}

export async function createBooking(booking: BookingClient): Promise<void> {
    const routeIDs = await prisma.flights.findMany({
        select: {
            id: true,
            route_id: true,
            pricelist_id: true
        },
        where: {
            id: {
                in: booking.flight_ids
            }
        }
    })

    if (routeIDs.isEmpty()) {
        throw Error("Invalid flight ID(s)")
    }

    const sortedRouteIDs = booking.flight_ids
        .map(flight_id =>
            routeIDs.find(path => path.id == flight_id).route_id
        )

    const pricelistID = routeIDs[0].pricelist_id

    const userID = booking.user_id
        ? booking.user_id
        : (await prisma.users.create({data: {
            firstname: booking.firstname,
            lastname: booking.lastname,
            email: booking.email
          }})).id


    await prisma.bookings.create({data: {
        user_id: userID,
        flight_ids: booking.flight_ids,
        route_ids: sortedRouteIDs,
        pricelist_id: pricelistID,
        price: booking.price
    }})
}
