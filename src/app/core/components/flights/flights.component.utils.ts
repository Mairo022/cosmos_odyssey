import { RouteOffersSort, RouteProvider, RoutesRendered } from "./flights.component.model"
import { v4 as uuidv4 } from 'uuid'


export function getRenderableOffers(routes: Array<RouteProvider[]>, from: string, to: string, defaultRouteOffersSort: RouteOffersSort, routesOffersSort: RouteOffersSort): RoutesRendered[] {
    const offers = new Array<RoutesRendered>

    routes.forEach((paths, i) => {
      const arrayIndex = i
      const uuid = uuidv4()
      const company = paths[0].company.name
      const stops = paths.length - 1
      const stopsStr = formatStops(stops)
      const startDT = new Date(paths[0].flightStart)
      const endDT = new Date(paths[paths.length - 1].flightEnd)
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


export function formatTime(timeMinutes: number): string {
    const weekInMin = 10080
    const dayInMin = 1440
    const hourInMin = 60

    const timeWeeks = timeMinutes >= weekInMin ? Math.floor(timeMinutes / weekInMin) : 0
    const timeDays = timeMinutes >= dayInMin ? Math.floor(timeMinutes / dayInMin) : 0
    const timeHours = timeMinutes >= hourInMin ? Math.floor(timeMinutes / hourInMin) : 0

    if (timeWeeks > 0) {
      const daysLeft = timeDays - timeWeeks * 7
      if (daysLeft === 0) return `${timeWeeks}w`
      return `${timeWeeks}w ${daysLeft}d`
    }
    if (timeDays > 0) {
      const hoursLeft = timeHours - timeDays * 24
      if (hoursLeft === 0) return `${timeDays}d`
      return `${timeDays}d ${hoursLeft}h`
    }
    if (timeHours > 0) {
      const minsLeft = timeMinutes - timeHours * 60
      if (minsLeft === 0) return `${timeHours}h`
      return `${timeHours}h ${minsLeft}m`
    }

    return `${timeMinutes.toFixed(0)}m`
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
