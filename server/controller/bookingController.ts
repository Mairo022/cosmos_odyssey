import { findBooking, createBooking } from '../services/bookingsService'

export async function getBooking(req, res) {
    const bookingID = req.params.bookingID
    
    return res.status(200).json(findBooking(bookingID))
}

export async function addBooking(req, res) {
    const booking = req.body
    await createBooking(booking)

    return res.status(201).json()
}