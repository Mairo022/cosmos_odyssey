import express from "express";
import {getRoutes} from './controller/routesController.js'

export const app = express()

app.use(express.json())

app.get("/api/routes", getRoutes)

app.listen(4400)
