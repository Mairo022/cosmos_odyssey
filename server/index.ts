import express from "express";
import {getRoutes, getPlanets, getCompanies} from './controller/routesController.js'
import {getBooking, addBooking, cancelBooking, checkInBooking} from './controller/bookingController'
import dotenv from 'dotenv'
import { asyncHandler, errorHandler } from "./middlewares";
import schedulePricelistUpdate from "./scripts/pricelistUpdateHandler";
import {} from "./types/global";
import "./extensions"
import { routesValidator } from "./validators/routes/routesValidator";
import {getPutBookingValidator} from "./validators/booking/getPutBookingValidator";
import {createBookingValidator} from "./validators/booking/createBookingValidator";
import {checkInBookingValidator} from "./validators/booking/checkInBookingValidator";

dotenv.config()

export const app = express()
app.use(express.json())

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next()
})

app.get("/api/routes", routesValidator, asyncHandler(getRoutes))
app.get("/api/routes/planets", asyncHandler(getPlanets))
app.get("/api/routes/companies", asyncHandler(getCompanies))

app.get("/api/bookings/:bookingID", getPutBookingValidator, asyncHandler(getBooking))
app.put("/api/bookings/:bookingID/cancel", getPutBookingValidator, asyncHandler(cancelBooking))
app.put("/api/bookings/:bookingID/check-in", checkInBookingValidator, asyncHandler(checkInBooking))
app.post("/api/bookings", createBookingValidator, asyncHandler(addBooking))

app.listen(process.env.SERVER_PORT, schedulePricelistUpdate)

app.use(errorHandler)

process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught exception:', error)
    process.exit(1)
})

process.on('unhandledRejection', (reason: string, promise: Promise<any>) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason)
    process.exit(1)
})
