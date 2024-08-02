export interface Routes {
    id: string
    validUntil: string
    legs: Array<{
        id: string
        routeInfo: {
            id: string
            distance: number
            from: {
                id: string
                name: string
            }
            to: {
                id: string
                name: string
            }
        }
        providers: Array<{
            id: string
            company: {
                id: string
                name: string
            }
            price: number
            flightStart: string
            flightEnd: string
        }>
    }>
}

export type AvailableRoutes = AvailableRoute[]

export interface AvailableRoute {
    id: string
    from: string
    to: string
    distance: number
    pricelist_id: string
}

export interface Pricelist {
    id: Routes['id']
    valid_until: Routes['validUntil']
}

export type Flights = Flight[]

interface Flight {
    id: string,
    route_id: string,
    company: string,
    price: number,
    start: string,
    end: string,
    pricelist_id: string
}

export type FlightsDB = FlightDB[]

interface FlightDB extends Flight {
    from: string
    to: string
    distance: number
}

export type RoutesProviders = RoutesProvider[]

export interface RoutesProvider extends AvailableRoute {
    from: string
    to: string
    distance: number
    providers: RouteProvider[]
}

export interface RouteProvider {
    id: string,
    route_id: string,
    company: string,
    price: number,
    start: string,
    end: string,
}

export interface RoutesToClient {

}