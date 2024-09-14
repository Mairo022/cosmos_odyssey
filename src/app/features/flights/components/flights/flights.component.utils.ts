import { formatTime } from "../../../../utils/time-utils"
import { RouteOffersSort, RouteProvider, RoutesRendered } from "../../types/flights.model"
import { v4 as uuidv4 } from 'uuid'


export function getRenderableOffers(routes: Array<RouteProvider[]>, from: string, to: string, defaultRouteOffersSort: RouteOffersSort, routesOffersSort: RouteOffersSort): RoutesRendered[] {
    const offers = new Array<RoutesRendered>

    routes.forEach((paths, i) => {
      const arrayIndex = i
      const uuid = uuidv4()
      const company = paths[0].company
      const stops = paths.length - 1
      const stopsStr = formatStops(stops)
      const startDT = new Date(paths[0].start)
      const endDT = new Date(paths[paths.length - 1].end)
      const timeStr = formatDatetime(startDT) + " - " + formatDatetime(endDT)
      const duration = (endDT.getTime() - startDT.getTime()) / (1000 * 60)
      const durationStr = formatTime(duration)
      const offerIDs = paths.map(path => path.id)
      const visible = true
      let price = paths.reduce((total, offer) => total + offer.price * 1000, 0) / 1000
      const open = false;

      offers.push({
        arrayIndex, uuid, offerIDs,
        company, from, to, price,
        stops, stopsStr,
        startDT, endDT, timeStr,
        duration, durationStr,
        open, visible
      })
    })

    const sortedOffers = getSortedRouteOffers(offers, defaultRouteOffersSort, routesOffersSort)

    return sortedOffers
}

export function getSortedRouteOffers(offers: RoutesRendered[], sort: RouteOffersSort, routesOffersSort: RouteOffersSort): Array<RoutesRendered> {
    const offersCopy = offers.slice()
    const property = sort.property
    const direction = sort.direction

    routesOffersSort.property = property
    routesOffersSort.direction = direction

    if (direction == "asc") offersCopy.sort((a,b) => (a[property] as number) - (b[property] as number))
    if (direction == "desc") offersCopy.sort((a,b) => (b[property] as number) - (a[property] as number))

    return offersCopy
}

export function formatDatetime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }
    return date.toLocaleString('en-US', options)
}

export function formatStops(stops: number): string {
    if (stops > 1) return `${stops} stops`
    if (stops === 1) return `${stops} stop`
    return `No stops`
}
