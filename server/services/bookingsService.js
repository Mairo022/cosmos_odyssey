// @ts-check

import { log } from "@angular-devkit/build-angular/src/builders/ssr-dev-server/index.js";
import bookings from "../data/bookings.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {import('../data/bookings').Booking} Booking
 */

export function findBooking(bookingID) {
    return bookings.filter(booking => booking.id === bookingID)
}

export function findBookings() {
    return bookings
}

/**
 * 
 * @param {Booking} booking 
 */
export function createBooking(booking) {
    booking.id = uuidv4()
    bookings.push(booking)
}