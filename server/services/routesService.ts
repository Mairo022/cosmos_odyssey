import { findAllFlightOffers } from "../utils/routesUtils"
import { RoutesCache } from "../data/RoutesCache";

export async function findRoutes(from: string, to: string): Promise<Array<any>> {
    if (RoutesCache.routes.isEmpty()) {
        await RoutesCache.updateRoutes()
    }

    return findAllFlightOffers(RoutesCache.routes, from, to)
}

export async function findPlanets(): Promise<Array<string>> {
    if (RoutesCache.planets.isEmpty()) {
        await RoutesCache.updatePlanets()
    }

    return RoutesCache.planets
}

export async function findCompanies(): Promise<Array<string>> {
    if (RoutesCache.companies.isEmpty()) {
        await RoutesCache.updateCompanies()
    }

    return RoutesCache.companies
}
