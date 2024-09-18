import {HttpClient, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private readonly apiURL = (id: string) => `http://localhost:4400/api/bookings/${id}/check-in`

  constructor(private httpClient: HttpClient) {}

  checkIn(bookingID: string, email: string): Observable<HttpResponse<void>> {
    const url = this.apiURL(bookingID)
    return this.httpClient.put<void>(url, { email }, { observe: 'response'})
  }
}
