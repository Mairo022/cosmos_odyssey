import { HttpClient, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { Booking } from "../components/booking/booking.model"
import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class BookingService {
    private API_URL = "http://localhost:4400/api/bookings"

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
      return this.httpClient.post<void>(url, {body: booking}, { observe: 'response'})
    }
}