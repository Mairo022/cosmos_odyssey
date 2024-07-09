import { Component, inject } from '@angular/core';
import { BookingDialogueComponent } from '../booking-dialogue/booking-dialogue.component';
import { RoutesService } from '../../services/routes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fetch } from '../../services/fetch';
import { CommonModule } from '@angular/common';
import { RouteOffersSort, RouteOffersSortProperty, RouteProvider, RoutesRendered } from './flights.model'
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [BookingDialogueComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  private readonly routesService = inject(RoutesService)
  planets = new Fetch<string[]>(this.routesService.getPlanets())
  routes = new Fetch<Array<RouteProvider[]>>
  routesOffers = new Array<RoutesRendered> 

  isBookingDialogueOpen: boolean = false;
  isBookingRowOpen: boolean = false

  private readonly defaultRouteOffersSort: RouteOffersSort = {
    property: "startDT",
    direction: "asc"
  }
  private routesOffersSort = {...this.defaultRouteOffersSort}

  routeForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.routeForm = this.fb.group({
      from: null,
      to: null
    })
  }
  ngOnInit() {
    this.routes.data.subscribe(routeProvidersList => {
      const from = this.routeForm.value.from
      const to = this.routeForm.value.to

      this.routesOffers = this.getRenderableOffers(routeProvidersList, from, to)
    })
  }

  ngOnDestroy() {
    this.routes.data.unsubscribe()
  }

  onSubmit(): void {
    const from = this.routeForm.value.from
    const to = this.routeForm.value.to

    if (!from || !to) {
      return
    }
    this.routes.load(this.routesService.getRoutes(from, to))
  }

  getRenderableOffers(routes: Array<RouteProvider[]>, from: string, to: string): RoutesRendered[] {
    const offers = new Array<RoutesRendered>

    for (const paths of routes) {
      const uuid = uuidv4()
      const company = paths[0].company.name
      const stops = paths.length - 1
      const stopsStr = stops > 1 ? `${stops} stops` : `${stops} stop`
      const startDT = new Date(paths[0].flightStart)
      const endDT = new Date(paths[paths.length - 1].flightEnd)
      const timeStr = this.formatDatetime(startDT) + " - " + this.formatDatetime(endDT)
      const duration = (endDT.getTime() - startDT.getTime()) / (1000 * 60)
      const durationStr = this.formatTime(duration)
      const offerIDs = paths.map(path => path.id)
      let price = paths.reduce((total, offer) => total + offer.price * 1000, 0) / 1000
      const open = false;
      
      offers.push({ 
        company, offerIDs, stops, stopsStr, startDT, endDT, timeStr, duration, durationStr, price, from, to, uuid, open
      })
    }

    const sortedOffers = this.getSortedRouteOffers(offers, this.defaultRouteOffersSort)
    return sortedOffers
  }

  getSortedRouteOffers(offers: RoutesRendered[], sort: RouteOffersSort): Array<RoutesRendered> {
    const offersCopy = offers.slice()
    const property = sort.property
    const direction = sort.direction

    this.routesOffersSort.property = property
    this.routesOffersSort.direction = direction

    if (direction == "asc") offersCopy.sort((a,b) => (a[property] as number) - (b[property] as number))
    if (direction == "desc") offersCopy.sort((a,b) => (b[property] as number) - (a[property] as number))
    
    return offersCopy
  }

  sortRouteOffers(property: RouteOffersSortProperty): void {
    const sort: RouteOffersSort = {
      property: property,
      direction: "asc"
    }
    
    if (this.routesOffersSort.property == property) {
      sort.direction = this.routesOffersSort.direction == "asc" ? "desc" : "asc"
    } else {
      sort.direction = "desc"
    }

    this.routesOffers = this.getSortedRouteOffers(this.routesOffers, sort)
  }

  formatTime(timeMinutes: number): string {
    const weekInMin = 10080
    const dayInMin = 1440
    const hourInMin = 60

    const timeWeeks = timeMinutes >= weekInMin ? Math.floor(timeMinutes / weekInMin) : 0
    const timeDays = timeMinutes >= dayInMin ? Math.floor(timeMinutes / dayInMin) : 0
    const timeHours = timeMinutes >= hourInMin ? Math.floor(timeMinutes / hourInMin) : 0

    if (timeWeeks > 0) {
      const daysLeft = timeDays - timeWeeks * 7
      return `${timeWeeks}w ${daysLeft.toFixed(0)}d`
    }
    if (timeDays > 0) {
      const hoursLeft = timeHours - timeDays * 24
      return `${timeDays}d ${hoursLeft}h`
    }
    if (timeHours > 0) {
      const minsLeft = timeMinutes - timeHours * 60
      return `${timeHours}h ${minsLeft}m`
    }

    return `${timeMinutes.toFixed(0)}m`
  }

  formatDatetime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return date.toLocaleString('en-US', options);
  }

  isSelectedPlanet(planet: string, source: "from" | "to"): boolean {
    if (source === "from" && planet === this.routeForm.value.to) return true
    if (source === "to" && planet === this.routeForm.value.from) return true
    return false
  }

  setBookingRowOpen(index: number) {
    this.routesOffers[index].open = !this.routesOffers[index].open
  }
  openBookingDialogue() {
    this.isBookingDialogueOpen = true
  }
  closeBookingDialogue() {
    this.isBookingDialogueOpen = false
  }
}
