import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private API_URL = "http://localhost:4400/api/routes"

  constructor(private httpClient: HttpClient) {}

  getRoutes(from: string, to: string): Observable<any> {
    const url = this.API_URL + `?from=${from}&to=${to}`
    return this.httpClient.get<any>(url)
  }

  getPlanets(): Observable<string[]> {
    const url = this.API_URL + "/planets"
    return this.httpClient.get<string[]>(url)
      .pipe(
        map((planets: string[]) => planets.sort())
      )
  }

  getCompanies(): Observable<string[]> {
    const url = this.API_URL + "/companies"
    return this.httpClient.get<string[]>(url)
      .pipe(
        map((companies: string[]) => companies.sort())
      )
  }
}
