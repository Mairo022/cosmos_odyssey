export interface RouteProvider {
    id: string,
    company: {
        id: string
        name: string
    }
    price: number
    flightStart: string
    flightEnd: string;
    from: string,
    to: string
}

export interface RoutesRendered {
    arrayIndex: number
    company:string
    duration:number
    endDT: Date
    startDT: Date
    timeStr: string
    durationStr: string
    offerIDs: Array<string>
    price: number
    stops: number
    stopsStr: string
    from: string
    to: string
    uuid: string
    open: boolean
    visible: boolean
}

export type RouteOffersSortProperty = "startDT" | "duration" | "stops" | "price"
export type SortDirection = "asc" | "desc"

export interface RouteOffersSort {
    property: RouteOffersSortProperty
    direction: SortDirection
}

export interface Booking {
    firstname: string
    lastname: string
    routes: string[]
    price: number
    travelTime: number
    companyName: string
    id: string
}
