import { findBooking, createBooking } from '../services/bookingsService'
import { BookingClient } from '../types/booking'

export async function getBooking(req, res) {
    const bookingID = req.params.bookingID
    
    return res.status(200).json(findBooking(bookingID))
}

export async function addBooking(req, res) {
    const booking: BookingClient = req.body
    await createBooking(booking)

    return res.status(201).json()
}