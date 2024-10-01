import { HttpClient, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { Booking } from "../types/booking.model"
import { Injectable } from "@angular/core"
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
    private readonly API_URL = environment.apiUrl + "bookings"

    constructor(private httpClient: HttpClient) {}

    getBookings(): Observable<Booking[]> {
      const url = this.API_URL
      return this.httpClient.get<Booking[]>(url)
    }

    getBooking(bookingID: string): Observable<Booking> {
      const url = this.API_URL + "/" + bookingID
      return this.httpClient.get<Booking>(url)
    }

    addBooking(booking: Booking):  Observable<HttpResponse<void>> {
      const url = this.API_URL
      return this.httpClient.post<void>(url, booking, { observe: 'response'})
    }
}
