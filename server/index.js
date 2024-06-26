import express from "express";
import {getRoutes} from './controller/routesController.js'

export const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200")
    next()
})
app.get("/api/routes", getRoutes)

app.listen(4400)
