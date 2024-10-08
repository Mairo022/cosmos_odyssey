import {findBookingByKey, createBooking, cancelBookingService, checkInBookingService} from '../services/bookingsService'
import { BookingClient } from '../types/booking'

export async function getBooking(req, res) {
    const bookingKey = req.params.bookingID

    return res.status(200).json(await findBookingByKey(bookingKey))
}

export async function cancelBooking(req, res) {
  const id = req.params.bookingID
  await cancelBookingService(id)

  return res.status(204).json()
}

export async function checkInBooking(req, res) {
  const id = req.params.bookingID
  await checkInBookingService(id)

  return res.status(204).json()
}

export async function addBooking(req, res) {
    const booking: BookingClient = req.body

    return res.status(201).json(await createBooking(booking))
}
