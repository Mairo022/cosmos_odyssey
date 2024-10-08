import {BookingClient, FindBooking} from "../types/booking";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";
import {generateBookingKey} from "../utils/bookingUtils";

export async function findBookingByKey(bookingKey: string): Promise<FindBooking> {
  const query = Prisma.sql`
    SELECT
      id,
      cancelled,
      checked_in,
      price,
      created_at,
      (SELECT
        json_agg(json_build_object(
          'from', r.from,
          'to', r.to,
          'distance', r.distance,
          'company', f.company,
          'start', f.start,
          'end', f.end
        ))
        FROM flights f
        INNER JOIN routes r ON r.id = f.route_id
        WHERE f.id = ANY(bookings.flight_ids)
      ) as flights
    FROM bookings
    WHERE client_key = ${bookingKey}
    LIMIT 1`

  return (await prisma.$queryRaw<FindBooking>(query))[0]
}

export async function cancelBookingService(clientKey: string): Promise<void> {
  await prisma.bookings.update({
    where: {client_key: clientKey},
    data: {cancelled: true}
  })
}

export async function checkInBookingService(clientKey: string): Promise<void> {
  await prisma.bookings.update({
    where: {client_key: clientKey},
    data: {checked_in: true}
  })
}

export async function createBooking(booking: BookingClient): Promise<{client_key: string}> {
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

    const bookingKey = await generateBookingKey()

    await prisma.bookings.create({data: {
        user_id: userID,
        flight_ids: booking.flight_ids,
        route_ids: sortedRouteIDs,
        pricelist_id: pricelistID,
        price: booking.price,
        client_key: bookingKey,
    }})

    return {client_key: bookingKey}
}
