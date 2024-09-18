import {Decimal} from "@prisma/client/runtime/library";
import prisma from "../../db/prisma";
import {BookingClient} from "../../types/booking";

export async function createBookingValidator(req, res, next) {
  const booking: unknown = req.body

  if (!isValidBookingObject(booking)) {
    return res.status(400).json("Invalid booking request")
  }

  if (booking.user_id && !await userExists(booking.user_id)) {
    return res.status(400).json("User not found")
  }

  if (!booking.user_id) {
    if (!isValidEmail(booking.email)) {
      return res.status(400).json("Invalid e-mail address")
    }

    if (!isValidName(booking.firstname) || !isValidName(booking.lastname)) {
      return res.status(400).json("Invalid name format")
    }
  }

  const flights = await getFlights(booking.flight_ids)

  if (flights.length !== booking.flight_ids.length) {
    return res.status(400).json("Flight id(s) doesn't exist")
  }

  if (await isValidPricelist(flights[0].pricelist_id)) {
    return res.status(404).json("Flight is expired")
  }

  const flightsPrice = flights.reduce((total, flight) => total.add(flight.price), new Decimal(0))
  const pricesEqual = new Decimal(booking.price).equals(flightsPrice)

  if (!pricesEqual) {
    return res.status(400).json("Client and server side prices do not match")
  }

  next()
}

async function getFlights(flightIDs: Array<string>) {
  try {
    return await prisma.flights.findMany({
      select: {
        id: true,
        route_id: true,
        pricelist_id: true,
        price: true
      },
      where: {
        id: {
          in: flightIDs
        }
      }
    })
  } catch {
    return []
  }
}

async function isValidPricelist(pricelistID: string): Promise<boolean> {
  const pricelist = await prisma.pricelists.findUnique({
    select: {
      valid_until: true
    },
    where: {
      id: pricelistID
    }
  })

  return new Date(pricelist.valid_until) <= new Date()
}

function isValidName(name: string): boolean {
  const lettersRegex = /^[\p{L}]+$/u

  return name.length >= 2 && lettersRegex.test(name)
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

  return emailRegex.test(email)
}

async function userExists(userID: string): Promise<boolean> {
  try {
    return !!prisma.users.findUnique({
      select: {
        id: true
      },
      where: {
        id: userID
      }
    })
  } catch {
    return false
  }
}

function isValidBookingObject(booking: any): booking is BookingClient {
  return (
    typeof booking === 'object' &&
    (
      typeof booking.user_id === 'string' ||
      (
        typeof booking.firstname === 'string' &&
        typeof booking.lastname === 'string' &&
        typeof booking.email === 'string'
      )
    ) &&
    typeof booking.price === 'number' &&
    Array.isArray(booking.flight_ids) &&
    !booking.flight_ids.isEmpty()
  )
}
