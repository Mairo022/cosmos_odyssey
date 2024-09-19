import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Booking} from "../types/manage.model";

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  private readonly apiURL = (id: string) => `http://localhost:4400/api/bookings/${id}/`

  constructor(private httpClient: HttpClient) {}

  getBooking(bookingID: string, email: string): Observable<Booking> {
    const url = this.apiURL(bookingID)

    return this.httpClient.post<Booking>(url, { email })
  }

  cancelBooking(bookingID: string, email: string): Observable<HttpResponse<void>> {
    const url = this.apiURL(bookingID) + "cancel"

    return this.httpClient.put<HttpResponse<void>>(url, { email })
  }
}
