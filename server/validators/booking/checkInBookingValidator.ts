import prisma from "../../db/prisma";
import {userBookingAccessValidator} from "./userBookingAccessValidator";

export async function checkInBookingValidator(req, res, next) {
  await userBookingAccessValidator(req, res, async () => {
    const bookingID = req.params.bookingID

    const isBookingCancelled = (await prisma.bookings.findUnique({
      select: { cancelled: true },
      where: { id: bookingID }
    })).cancelled

    if (isBookingCancelled) {
      return res.status(409).json("Cancelled booking can not check-in")
    }

    next()
  })
}
