import { routesMock } from "../data/routesMock.js"
import planets from "../data/planetsMock.js"
import { findAllRouteOffers } from "../utils/filterUtils.js"
import companies from "../data/companiesMock.js"

export function findRoutes(from, to) {
    const routes = routesMock.legs
    return findAllRouteOffers(from, to, routes)
}

export function findPlanets() {
    return planets
}

export function findCompanies() {
    return companies
}
