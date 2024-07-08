export interface RouteProvider {
    id: string,
    company: {
        id: string
        name: string
    }
    price: number
    flightStart: string
    flightEnd: string;
}

export interface RoutesRendered {
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
}