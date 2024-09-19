import prisma from "../../db/prisma";
import {isValidEmail} from "./shared";

export async function userBookingAccessValidator(req, res, next) {
  const body: unknown = req.body
  const bookingID = req.params.bookingID

  if (!isValidBookingIdentityObject(body) || !isValidBookingIdFormat(bookingID)) {
    return res.status(400).json("Invalid request data")
  }

  if (!isValidEmail(body.email)) {
    return res.status(400).json("Invalid e-mail address")
  }

  if (!await ticketEmailExists(bookingID, body.email)) {
    return res.status(400).json("Could not find the ticket")
  }

  next()
}

function isValidBookingIdentityObject(booking: any): booking is { email: string } {
  return typeof booking === "object" && booking.email
}

async function ticketEmailExists(ticketID: string, email: string): Promise<boolean> {
  try {
    return await prisma.bookings.count({
      where: {
        id: ticketID,
        user: {
          email: email,
        },
      },
    }) > 0
  } catch (e) {
    return false
  }
}

function isValidBookingIdFormat(ticketID: string): boolean {
  return ticketID.length === 36
}
