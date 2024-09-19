import {Prisma} from "@prisma/client";

export interface BookingClient {
    id?: string
    user_id?: string
    firstname?: string
    lastname?: string
    email?: string
    flight_ids: Array<string>
    price: number
}

export interface FindBooking {
  id: string
  price: number
  cancelled: boolean
  checked_in: boolean
  created_at: string
  flights: {
    from: string
    to: string
    distance: number
    company: string
    start: string
    end: string
  }[]
}
