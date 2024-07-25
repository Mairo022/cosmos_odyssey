// @ts-check

import express from "express";
import {getRoutes, getPlanets, getCompanies} from './controller/routesController.js'
import {getBooking, getBookings, addBooking} from './controller/bookingController.js'

export const app = express()

app.use(express.json())

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200")
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next()
})
app.get("/api/routes", getRoutes)
app.get("/api/routes/planets", getPlanets)
app.get("/api/routes/companies", getCompanies)

app.get("/api/bookings", getBookings)
app.get("/api/bookings/:routeID", getBooking)
app.post("/api/bookings", addBooking)

app.listen(4400)
