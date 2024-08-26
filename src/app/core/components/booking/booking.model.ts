export interface Booking {
    firstname: string
    lastname: string
    flight_ids: string[]
    price: number
    travelTime: number
    email: string
    id: string
}

export enum Views {
    OVERVIEW = "overview",
    BOOKING = "booking",
    SUCCESS = "success"
}
