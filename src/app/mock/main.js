const routesFull = require("./routesFull")
const routes = routesFull.legs

const DESTINATION_PLANET = "Venus"
const START_PLANET = "Saturn"

function getRoutes(planet, currentRoute = null, recursivePlanetHistory = [], recursiveRouteHistory = []) {
    const history = []
    const routeHistory = currentRoute ? recursiveRouteHistory.concat(currentRoute) : []
    const planetHistory = recursivePlanetHistory.concat(planet)
    
    const nextRoutes = routes.filter(route => route.routeInfo.from.name == planet)

    for (route of nextRoutes) {
        const nextPlanet = route.routeInfo.to.name

        if (DESTINATION_PLANET == nextPlanet) {
            routeHistory.push(route)
            history.push(routeHistory)
            continue
        }
        if (planetHistory.includes(nextPlanet)) continue
        history.push(...getRoutes(nextPlanet, route, planetHistory, routeHistory))
    }

    return history;
}

