// @ts-check

import { findBookings, findBooking, createBooking } from '../services/bookingsService.js'

export function getBookings(_, res) {
    return res.status(200).json(findBookings())
}

export function getBooking(req, res) {
    const bookingID = req.params.bookingID
    
    return res.status(200).json(findBooking(bookingID))
}

export function addBooking(req, res) {
    const booking = req.body
    createBooking(booking)

    return res.status(201).json()
}