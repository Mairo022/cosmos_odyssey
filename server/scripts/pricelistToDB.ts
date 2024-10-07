import { Prisma } from "@prisma/client";
import prisma from "../db/prisma";
import {AvailableRoute, AvailableRoutes, Flight, Flights, Pricelist, Routes} from "../types/routes";
import {PRICELIST} from "../constants/pricelistConstants";

export async function addPricelistToDB(routes: Routes): Promise<void> {
    const pricelist: Pricelist = {
        // Using manually generated valid time. As it is a demo project, updating pricelist every 10 minutes
        // due to its original expiration time does not provide any practical value.
        // Original valid time is accessible via: routes.validUntil
        valid_until: generateValidUntil(),
        id: routes.id
    }
    const availableRoutes = getAvailableRoutes(routes.legs, routes.id)
    const flights = getFlights(routes.legs, routes.id)

    try {
        await prisma.$transaction(async tx => {
            await insertToPricelists(tx, pricelist)
            await insertToRoutes(tx, availableRoutes)
            await insertToFlights(tx, flights)
        })
    } catch (e) {
        console.error(e.message)
    }
}

async function insertToFlights(tx: Prisma.TransactionClient, data: Flights): Promise<{count: number}> {
    return tx.flights.createMany({data})
}

async function insertToPricelists(tx: Prisma.TransactionClient, data: Pricelist): Promise<{id: string}> {
    return tx.pricelists.create({data, select: {id: true}})
}

async function insertToRoutes(tx: Prisma.TransactionClient, data: AvailableRoutes): Promise<{count: number}> {
    return tx.routes.createMany({data})
}

function getAvailableRoutes(routes: Routes['legs'], pricelistID: string): AvailableRoutes {
    const availableRoutes = new Array<AvailableRoute>

    for (const route of routes) {
        availableRoutes.push({
            id: route.id,
            from: route.routeInfo.from.name,
            to: route.routeInfo.to.name,
            distance: route.routeInfo.distance,
            pricelist_id: pricelistID
        })
    }

    return availableRoutes
}

function getFlights(routes: Routes['legs'], pricelistID: string): Flights {
    const flights = new Array<Flight>

    for (const route of routes) {
        for (const provider of route.providers) {
            flights.push({
                id: provider.id,
                route_id: route.id,
                company: provider.company.name,
                price: provider.price,
                start: provider.flightStart,
                end: provider.flightEnd,
                pricelist_id: pricelistID
            })
        }
    }

    return flights
}

function generateValidUntil(): string {
    return new Date((new Date().getTime() + PRICELIST.MAX_AGE)).toISOString()
}
