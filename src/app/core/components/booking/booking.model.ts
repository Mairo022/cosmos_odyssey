export interface Booking {
    firstname: string
    lastname: string
    routes: string[]
    price: number
    travelTime: number
    companyName: string
    id: string
}

export enum Views {
    OVERVIEW = "OVERVIEW",
    BOOKING = "BOOKING",
    SUCCESS = "SUCCESS"
}
