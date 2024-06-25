import { routesMock } from "../data/routesMock.js"
import planets from "../data/planetsMock.js"

const routes = routesMock.legs

export function findRoutes(planet, destinationPlanet, currentRoute = null, recursivePlanetHistory = [], recursiveRouteHistory = []) {
    const history = []
    const routeHistory = currentRoute ? recursiveRouteHistory.concat(currentRoute) : []
    const planetHistory = recursivePlanetHistory.concat(planet)
    
    const nextRoutes = routes.filter(route => route.routeInfo.from.name == planet)

    for (const route of nextRoutes) {
        const nextPlanet = route.routeInfo.to.name

        if (destinationPlanet == nextPlanet) {
            routeHistory.push(route)
            history.push(routeHistory)
            continue
        }
        if (planetHistory.includes(nextPlanet)) continue
        history.push(...findRoutes(nextPlanet, destinationPlanet, route, planetHistory, routeHistory))
    }

    return history;
}

export function findPlanets() {
    return planets
}
