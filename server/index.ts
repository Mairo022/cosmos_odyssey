import express from "express";
import {getRoutes, getPlanets, getCompanies} from './controller/routesController.js'
import {getBooking, addBooking} from './controller/bookingController'
import dotenv from 'dotenv'
import { asyncHandler, errorHandler } from "./middlewares";
import schedulePricelistUpdate from "./scripts/pricelistUpdateHandler";
import {} from "./types/global";
import "./extensions"

dotenv.config()

export const app = express()
app.use(express.json())

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next()
}) 

app.get("/api/routes", asyncHandler(getRoutes))
app.get("/api/routes/planets", asyncHandler(getPlanets))
app.get("/api/routes/companies", asyncHandler(getCompanies))

app.get("/api/bookings/:routeID", asyncHandler(getBooking))
app.post("/api/bookings", asyncHandler(addBooking))

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