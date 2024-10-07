import { Prisma } from "@prisma/client"
import prisma from "../db/prisma"
import {RoutesProvider, RoutesProviders} from "../types/routes"
import {FLIGHT} from "../constants/flightConstants";
import {isOutdated} from "../utils/timeUtils";
import {TIME} from "../constants/timeConstants";
import {PRICELIST} from "../constants/pricelistConstants";

export class RoutesCache {
    static #planets = new Array<string>
    static #companies = new Array<string>
    static #routes: RoutesProviders = new Array<RoutesProvider>

    static get companies(): Array<string> {
        return this.#companies
    }

    static get planets(): Array<string> {
        return this.#planets
    }

    static get routes(): Array<RoutesProvider> {
        return this.#routes
    }

    static scheduleRoutesCleanup(): void {
        const cleanInterval = 6 * TIME.HOUR
        const cycleLength = PRICELIST.UPDATE_INTERVAL / cleanInterval
        let cyclePos = 1

        if (cycleLength % 1 !== 0) {
            console.error("Route cleanup cycle length is a float")
        }

        if (PRICELIST.UPDATE_INTERVAL % cleanInterval !== 0) {
            console.error("Route cleanup cycle interval is not divisor of pricelist update interval")
        }

        setInterval(() => {
            if (cyclePos === cycleLength) {
                cyclePos = 1
            } else {
                cyclePos++
                this.#removeOutdatedRoutes()
            }
        }, cleanInterval)
    }

    static async updateAll(): Promise<void> {
        Promise
            .all([this.updatePlanets, this.updateCompanies, this.updateRoutes])
            .catch(err => {
                console.error("Error: ", {message: err.message, stack: err.stack})
            })
    }

    static developmentSetCompaniesPlanets(): void {
        this.#companies = ["SpaceX","Explore Origin","Space Odyssey","Explore Dynamite","Galaxy Express","Spacegenix","Travel Nova","Space Piper","Spacelux","Space Voyager"]
        this.#planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]
    }

    static async updatePlanets(): Promise<void> {
        this.#planets = (await prisma.routes.groupBy({by: 'from'})).map(planet => planet.from)

        if (this.#planets.isEmpty()) {
            throw new Error("Database returned no planets")
        }
    }

    static async updateCompanies(): Promise<void> {
        this.#companies = (await prisma.flights.groupBy({by: 'company'})).map(company => company.company)

        if (this.#companies.isEmpty()) {
            throw new Error("Database returned no companies")
        }
    }

    static async updateRoutes(): Promise<void> {
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
                WHERE r.id = f.route_id AND f.start > now()
                ) AS providers
            FROM
                routes r
            INNER JOIN
                pricelists p ON r.pricelist_id = p.id
            WHERE
                p.valid_until >= now()
                AND EXISTS (
                    SELECT 1
                    FROM flights f
                    WHERE r.id = f.route_id
                )
        `

        this.#routes = await prisma.$queryRaw(query)

        if (this.#routes.isEmpty()) {
            throw new Error("Database returned no routes")
        }
    }

    static #removeOutdatedRoutes(): void {
        const filteredRoutes = this.routes.map(route => {
            const providers = route.providers.filter(provider => !isOutdated(provider.start, FLIGHT.CLIENT_BOOKING_GAP))
            return {...route, providers}
        })

        this.#routes = filteredRoutes
    }
}
