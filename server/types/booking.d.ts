export interface BookingClient {
    id?: string
    user_id?: string
    firstname?: string
    lastname?: string
    email?: string
    flight_ids: Array<string>
    price: number
}

export interface BookingDB {
    id?: string
    user_id: string
    flight_ids: Array<string>
    route_ids: Array<string>
    price: Prisma.Decimal
}
