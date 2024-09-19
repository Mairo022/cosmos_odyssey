export interface Booking {
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

export enum Views {
  BOOKING = "booking",
  FORM = "form"
}
