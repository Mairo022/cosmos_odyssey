import { RouteProvider, RoutesProviders } from "../types/routes"

export function findAllFlightOffers(routes: RoutesProviders, from: string, to: string) {
  const fullRoutes = findRoutes(routes, from, to)
  const allOffers = getLinkedProviderOffers(fullRoutes)

  return allOffers
}

function findRoutes(
  routes: RoutesProviders, 
  from: string, 
  to: string, 
  beenTo = new Array<string>, 
  exploredRoutes: RoutesProviders = []
  ): Array<RoutesProviders> 
  {
  let fullRoute: Array<RoutesProviders> = []
  const nextRoutes = routes.filter(route => route.from === from && !beenTo.includes(route.to))

  for (const route of nextRoutes) {
      const exploredRoutesUpdated = exploredRoutes.concat(route)
      const beenToUpdated = beenTo.concat(from)

      if (to === route.to)
          fullRoute.push(exploredRoutesUpdated)
      else
          fullRoute = fullRoute.concat(findRoutes(routes, route.to, to, beenToUpdated, exploredRoutesUpdated))
  }

  return fullRoute
}

function getLinkedProviderOffers(fullRoutes: Array<RoutesProviders>): Array<any> {
  const providers = new Array()

  for (const route of fullRoutes) {
    const fullRouteCompanies = getFullRouteProvidingCompanies(route)

    for (const provider of route[0].providers) {
      if (!fullRouteCompanies.has(provider.company))
          continue

      const from = route[0].from
      const to = route[0].to
      const distance = route[0].distance

      const linkedProviderOffer = getLinkedProviderOffer(route, {...provider, from, to, distance: distance.toString()})

      if (linkedProviderOffer.length > 0)
          providers.push(linkedProviderOffer)
    }
  }
  
  return providers
}

interface ProviderFirst extends RouteProvider {
  from: string
  to: string
  end: string
  distance: number | string
}

function getLinkedProviderOffer(routes: RoutesProviders, providerFirst: ProviderFirst): Array<any> {
  const MAX_TIME_GAP = 1000 * 60 * 15
  const company = providerFirst.company
  let lastFlightEnd = new Date(providerFirst.end).getTime()

  let history = new Array(providerFirst)
  let timegaps = new Array()
  let timegapsIndexes = new Array()

  let isFirstRoute = 1;
  for (const route of routes) {
      if (isFirstRoute == 1) {
          isFirstRoute = 0
          continue
      }

      const providers = route.providers.filter(provider =>
          provider.company === company
      )

      providers.forEach((provider, i) => {
          let flightStart = new Date(provider.start).getTime()
          let timegap =  flightStart - lastFlightEnd
          let enoughTime = timegap >= MAX_TIME_GAP

          if (enoughTime) {
              timegaps.push(timegap)
              timegapsIndexes.push(i)
          }
      })

      if (timegaps.length == 0) {
          history = []
          break;
      }

      const closestFlightStart = Math.min(...timegaps)
      const timegapIndex = timegaps.indexOf(closestFlightStart)
      const flightIndex = timegapsIndexes[timegapIndex]
      lastFlightEnd = new Date(providers[flightIndex].end).getTime()

      history.push({...providers[flightIndex], from: route.from, to: route.to, distance: route.distance.toString()})

      timegaps = new Array()
      timegapsIndexes = new Array()
  }

  const isOfferComplete = history.length == routes.length

  return isOfferComplete ? history : []
}

function getFullRouteProvidingCompanies(route: RoutesProviders): Set<string> {
  let providers = new Set<string>

  for (let i = 0; i < route.length; i++) {
      const tempProviders = new Set<string>

      for (let j = 0; j < route[i].providers.length; j++) {
          const provider = route[i].providers[j].company
          tempProviders.add(provider)
      }

      if (i == 0) providers = tempProviders
      else providers.forEach(provider => {
          !tempProviders.has(provider) && providers.delete(provider)
      })
  }

  return providers
}
