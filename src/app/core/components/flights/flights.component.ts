import { Component, inject } from '@angular/core';
import { RoutesService } from '../../services/routes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fetch } from '../../services/fetch';
import { CommonModule } from '@angular/common';
import { RouteOffersSort, RouteOffersSortProperty, RouteProvider, RoutesRendered } from './flights.component.model'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompanyLogoComponent } from '../company-logo/company-logo.component';
import { AppState } from '../../store/app.state';
import { getRenderableOffers, getSortedRouteOffers } from './flights.component.utils';
import { formatTime } from '../../utils/time-utils';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CompanyLogoComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [style({maxHeight: '0'}), animate('800ms', style({maxHeight: '1000px'}))]),
      transition(':leave', [animate('400ms ease-out', style({maxHeight: '0'}))]),
    ]),
  ]
})
export class FlightsComponent {
  private readonly _appState = AppState.getInstance()
  private readonly _routesService = inject(RoutesService)

  planets = new Fetch<string[]>(this._routesService.getPlanets())
  companies = new Fetch<string[]>(this._routesService.getCompanies())

  private _routes = new Fetch<Array<RouteProvider[]>>
  private _routesData = new Array<RouteProvider[]>
  routesOffers = new Array<RoutesRendered> 

  private readonly _defaultRouteOffersSort: RouteOffersSort = {
    property: "startDT",
    direction: "asc"
  }
  private _routesOffersSort = {...this._defaultRouteOffersSort}

  routeForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.routeForm = this.fb.group({
      from: null,
      to: null
    })
  }

  ngOnInit() {
    this.initLoadByQueryParams()

    this._routes.data$.subscribe(routeProvidersList => {
      const from = this.routeForm.value.from
      const to = this.routeForm.value.to

      this.routesOffers = getRenderableOffers(routeProvidersList, from, to, this._defaultRouteOffersSort, this._routesOffersSort)
      this._routesData = routeProvidersList
    })
  }

  ngOnDestroy() {
    this._routes.data$.unsubscribe()
  }

  initLoadByQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const from: string | undefined = params['from']
      const to: string | undefined = params['to']

      if (!from || !to) return
      if (this.routeForm.value.from !== from) this.routeForm.patchValue({ from })
      if (this.routeForm.value.to !== to) this.routeForm.patchValue({ to })

      this._routes.load(this._routesService.getRoutes(from, to))
    })
  }

  getRouteInfo(index: number, pathIndex: number): RouteProvider | undefined {
    if (this._routesData == null) return undefined
    const route = this._routesData[index][pathIndex]

    return route
  }

  getRoutePlanet(index: number, pathIndex: number, type: "start" | "end"): string {
    if (this._routesData == null) return ""

    const route = this._routesData[index][pathIndex]
    const from = route.from
    const to = route.to

    if (type === "start") return from
    return to
  }

  onSubmit(): void {
    const from = this.routeForm.value.from
    const to = this.routeForm.value.to

    if (!from || !to) {
      return
    }

    this.router.navigate(['.'], {
      queryParams: {from, to}
    })
  }

  sortRouteOffers(property: RouteOffersSortProperty): void {
    const sort: RouteOffersSort = {
      property: property,
      direction: "asc"
    }
    
    if (this._routesOffersSort.property == property) {
      sort.direction = this._routesOffersSort.direction == "asc" ? "desc" : "asc"
    } else {
      sort.direction = "desc"
    }

    this.routesOffers = getSortedRouteOffers(this.routesOffers, sort, this._routesOffersSort)
  }

  filterRouteOffersByCompany(company: string): void {
    this.routesOffers.forEach(offer => {
      if (company === "all")
        offer.visible = true
      else if (offer.company !== company)
        offer.visible = false
    })
  }

  getTimegap(start: string, end: string): string {
    const startDT = new Date(start)
    const endDT = new Date(end)

    const gapInMin = (endDT.getTime() - startDT.getTime()) / (1000 * 60)
    const gap = formatTime(gapInMin)

    return gap
  }
  
  formatTimeHHMM(time: string): string {
    const date = new Date(time);
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  DtStrToTime(datetimeStr: string): string {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    }).format(new Date(datetimeStr))
  }

  isActivePath(planet: string, source: "from" | "to"): boolean {
    if (source === "to") return this.routeForm.value.to === planet
    if (source === "from") return this.routeForm.value.from === planet
    return false
  }

  isSelectedPlanet(planet: string, source: "from" | "to"): boolean {
    if (source === "from" && planet === this.routeForm.value.to) return true
    if (source === "to" && planet === this.routeForm.value.from) return true
    return false
  }

  setBookingRowOpen(index: number): void {
    this.routesOffers[index].open = !this.routesOffers[index].open
  }

  saveBookingToState(routeIndex: number, routeOverview: RoutesRendered): void {
    const booking = this._routesData[routeIndex]
    const savedBooking = {overview: routeOverview, routes: booking}

    this._appState.booking$ = savedBooking
  }
}
