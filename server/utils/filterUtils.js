export function findAllRouteOffers(from, to, routes) {
    const routesList = findRoutes(routes, from, to)
    const allOffers = getLinkedProviderOffers(routesList)

    return allOffers
}

function findRoutes(routes, planet, destinationPlanet, currentRoute = null, recursivePlanetHistory = [], recursiveRouteHistory = []) {
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

// Input Route[][]
// Output Array<RouteProvider[]>
function getLinkedProviderOffers(routesList) {
    const providers = new Array()

    // Get individual route paths
    for (const routes of routesList) {
      const fullRouteCompanies = getRouteProviders(routes)
      
      for (const provider of routes[0].providers) {
        if (!fullRouteCompanies.has(provider.company.name))
            continue

        const linkedProviderOffer = getLinkedProviderOffer(routes, provider)
        if (linkedProviderOffer.length > 0) 
            providers.push(linkedProviderOffer)
      }
    }

    return providers
}

// Input routes - Route[], providerFirst - RouteProvider
// Output Array<RouteProvider>
function getLinkedProviderOffer(routes, providerFirst) {
    const MAX_TIME_GAP = 1000 * 60 * 15
    const company = providerFirst.company.name
    let lastFlightEnd = new Date(providerFirst.flightEnd).getTime()

    let history = new Array(providerFirst)
    let timegaps = new Array()
    let timegapIndexes = new Array()

    let isFirstRoute = 1;
    for (const route of routes) {
        if (isFirstRoute == 1) {
            isFirstRoute = 0
            continue
        }
        
        const providers = route.providers.filter(provider => 
            provider.company.name === company
        )

        providers.forEach((provider, i) => {
            let flightStart = new Date(provider.flightStart).getTime()
            let timegap =  flightStart - lastFlightEnd
            let enoughTime = timegap >= MAX_TIME_GAP

            if (enoughTime) {
                timegaps.push(timegap)
                timegapIndexes.push(i)
            }
        })

        if (timegaps.length == 0) {
            history = []
            break;
        }

        const closestFlightStart = Math.min(...timegaps)
        const flightIndex = timegaps.indexOf(closestFlightStart)
        lastFlightEnd = new Date(providers[flightIndex].flightEnd).getTime()

        history.push(providers[flightIndex])

        timegaps = new Array()
        timegapIndexes = new Array()
    }

    const isOfferComplete = history.length == routes.length

    return isOfferComplete ? history : []
}

  // Finds all companies that offer transportation
  // from start planet till end planet
  // Input Route[] (the starting point)
  // Output Set<string>
function getRouteProviders(route) {
    let providers = new Set()

    for (let i = 0; i < route.length; i++) {
        const tempProviders = new Set()

        for (let j = 0; j < route[i].providers.length; j++) {
            const provider = route[i].providers[j].company.name
            tempProviders.add(provider)
        }

        if (i == 0) providers = tempProviders
        else providers.forEach(provider => {
            !tempProviders.has(provider) && providers.delete(provider)
        })
    }
    
    return providers
}

/*
interface Route {
    id: string
    routeInfo: {
        id: string
        from: {
            id: string
            name: string
        }
        to: {
            id: string
            name: string
        }
        distance: number
    }
    providers: {
        id: string,
        company: {
            id: string
            name: string
        }
        price: number
        flightStart: string
        flightEnd: string;
    }[]
}
*/