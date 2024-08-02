import { findAllFlightOffers } from "../utils/routesUtils"
import prisma from "../db/prisma"
import { RoutesProviders } from "../types/routes";
import { Prisma } from "@prisma/client";

const planetsCache = new Array<string>
const companiesCache = new Array<string>

export async function findRoutes(from: string, to: string) {
    const query = Prisma.sql`
        SELECT 
            r.id, 
            r.from, 
            r.to, 
            r.distance,
            r.pricelist_id,
            (SELECT
                json_agg(json_build_object(
                    'pricelist_id', f.pricelist_id,
                    'id', f.id,
                    'company', f.company, 
                    'price', f.price,
                    'start', f.start,
                    'end', f.end
                ))
            FROM flights f
            WHERE r.id = f.route_id
            ) AS providers
        FROM
            routes r
        INNER JOIN
            pricelists p ON r.pricelist_id = p.id
        WHERE 
            r.to != ${from} 
            AND p.valid_until >= now()
            AND EXISTS (
                SELECT 1 
                FROM flights f 
                WHERE r.id = f.route_id
            )
    `
    const routes: RoutesProviders = await prisma.$queryRaw(query)
    const allRouteOffers = findAllFlightOffers(routes, from, to)

    return allRouteOffers
}

export async function findPlanets(): Promise<Array<string>> {
    if (planetsCache.length != 0) {
        return planetsCache
    }

    const planets = (await prisma.routes.groupBy({by: 'from'})).map(planet => planet.from)
    planetsCache.push(...planets)

    return planetsCache
}

export async function findCompanies(): Promise<Array<string>> {
    if (companiesCache.length != 0) {
        return companiesCache
    }

    const companies = (await prisma.flights.groupBy({by: 'company'})).map(company => company.company)
    companiesCache.push(...companies)

    return companiesCache
}
