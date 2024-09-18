import {Component, HostListener, inject} from '@angular/core';
import {FlightsService} from '../../services/flights.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Fetch, FetchStatus} from '../../../../utils/fetch';
import {CommonModule} from '@angular/common';
import {
  RouteOffersSort,
  RouteOffersSortProperty,
  RouteProvider,
  RoutesRendered,
} from '../../types/flights.model'
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AppState} from '../../../../store/app.state';
import {getRenderableOffers, getSortedRouteOffers} from './flights.component.utils';
import {formatTime} from '../../../../utils/time-utils';
import {animate, style, transition, trigger} from '@angular/animations';
import {ComponentsModule} from "../../../../components/components.module";
import {FiltersComponent} from "../filters/filters.component";
import {Subject, take} from "rxjs";
import {FiltersForm} from "../../types/filters.model";

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [ComponentsModule, ReactiveFormsModule, CommonModule, RouterLink, FiltersComponent],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [style({maxHeight: '0'}), animate('800ms', style({maxHeight: '1000px'}))]),
      transition(':leave', [animate('400ms ease-out', style({maxHeight: '0'}))]),
    ]),
  ],
})
export class FlightsComponent {
  protected readonly FetchStatus = FetchStatus
  private readonly _SMALL_SCREEN_SIZE = 1100
  private readonly _routesService = inject(FlightsService)

  planets = new Fetch<string[]>(this._routesService.getPlanets())
  companiesFetch = new Fetch<string[]>(this._routesService.getCompanies())
  companies = new Array<string>

  routes = new Fetch<Array<RouteProvider[]>>
  private _routesData = new Array<RouteProvider[]>
  routesOffers = new Array<RoutesRendered>

  private readonly _defaultRouteOffersSort: RouteOffersSort = {
    property: "startDT",
    direction: "asc"
  }
  private _routesOffersSort = {...this._defaultRouteOffersSort}

  routeForm: FormGroup
  forcedFromLocation$ = new Subject<string>
  forcedToLocation$ = new Subject<string>

  isSmallScreen = window.innerWidth <= this._SMALL_SCREEN_SIZE

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private readonly _appState: AppState) {
    this.routeForm = this.fb.group({
      from: null,
      to: null
    })
  }

  ngOnInit() {
    this.initLoadByQueryParams()

    this.routes.data$.subscribe(routeProvidersList => {
      const from = this.routeForm.value.from
      const to = this.routeForm.value.to

      this.routesOffers = getRenderableOffers(routeProvidersList, from, to, this._defaultRouteOffersSort, this._routesOffersSort)
      this._routesData = routeProvidersList

      if (this._appState.offerFilters) {
        this.applyFilters(this._appState.offerFilters)
      }
    })

    this.companiesFetch.data$.pipe(take(1)).subscribe(data => {this.companies = data})
  }

  ngOnDestroy() {
    this.routes.data$.unsubscribe()
  }

  initLoadByQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const from: string | undefined = params['from']
      const to: string | undefined = params['to']

      if (!from || !to) return
      if (this.routeForm.value.from !== from) this.routeForm.patchValue({ from })
      if (this.routeForm.value.to !== to) this.routeForm.patchValue({ to })

      this.routes.load(this._routesService.getRoutes(from, to))
    })
  }

  getRouteInfo(index: number, pathIndex: number): RouteProvider | undefined {
    if (this._routesData == null) return undefined
    const route = this._routesData[index][pathIndex]

    return route
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

  switchLocations() {
    const from = this.routeForm.value.from
    const to = this.routeForm.value.to

    this.forcedFromLocation$.next(to)
    this.forcedToLocation$.next(from)
  }

  onLocationChanged(selected: string, controller: string) {
    this.routeForm.get(controller)?.setValue(selected)
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

  getTimegap(start: string, end: string): string {
    const startDT = new Date(start)
    const endDT = new Date(end)

    const gapInMin = (endDT.getTime() - startDT.getTime()) / (1000 * 60)
    const gap = formatTime(gapInMin)

    return gap
  }

  DtStrToTime(datetimeStr: string): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(datetimeStr))
  }

  setBookingRowOpen(index: number): void {
    this.routesOffers[index].open = !this.routesOffers[index].open
  }

  saveBookingToState(routeIndex: number, routeOverview: RoutesRendered): void {
    const booking = this._routesData[routeIndex]
    const savedBooking = {overview: routeOverview, routes: booking}

    this._appState.booking$ = savedBooking
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.isSmallScreen = window.innerWidth <= this._SMALL_SCREEN_SIZE
  }

  onFiltersChanged(filters: FiltersForm) {
    this.applyFilters(filters)
  }

  applyFilters(filters: FiltersForm) {
    this.filterOffersByStops(filters.stops)
    this.filterOffersByCompany(filters.spacelines)
    this.filterOffersByPrice(filters.priceMin, filters.priceMax)
  }

  filterOffersByStops(stops: number) {
    this.routesOffers.forEach(offer => {
      if (stops === -1) offer.visible = true
      else offer.visible = offer.stops === stops
    })
  }

  filterOffersByCompany(companies: Array<string>) {
    if (companies.length === 0) return

    this.routesOffers.forEach(offer => {
      if (!offer.visible) return
      if (!companies.includes(offer.company)) offer.visible = false
    })
  }

  filterOffersByPrice(priceMin: number | null, priceMax: number | null) {
    priceMin = priceMin ?? 0
    priceMax = priceMax ?? Number.MAX_SAFE_INTEGER

    const isPriceWithinRange = (price: number) => price >= priceMin && price <= priceMax

    this.routesOffers.forEach(offer => {
      if (!offer.visible) return
      offer.visible = isPriceWithinRange(offer.price)
    })
  }
}
