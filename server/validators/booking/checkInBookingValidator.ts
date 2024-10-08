import prisma from "../../db/prisma";
import {userBookingAccessValidator} from "./userBookingAccessValidator";

export async function checkInBookingValidator(req, res, next) {
  await userBookingAccessValidator(req, res, async () => {
    const bookingKey = req.params.bookingID

    const isBookingCancelled = (await prisma.bookings.findUnique({
      select: { cancelled: true },
      where: { client_key: bookingKey }
    })).cancelled

    if (isBookingCancelled) {
      return res.status(409).json("Cancelled booking can not check-in")
    }

    next()
  })
}
