import { Component, inject } from '@angular/core';
import { AppState } from '../../store/app.state';
import { CommonModule } from '@angular/common';
import { Subscription, delay, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Fetch } from '../../services/fetch';
import { CompanyLogoComponent } from "../company-logo/company-logo.component";
import { RouterLink } from '@angular/router';
import { getTimegap } from '../../utils/timeUtils';
import { Booking, Views } from './booking.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CompanyLogoComponent, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  appState = AppState.getInstance() 
  booking$ = this.appState.booking$

  private readonly bookingService = inject(BookingService)
  private _subscriptions: Subscription[] = []

  bookingFetch = new Fetch<HttpResponse<any>>()
  bookingForm: FormGroup

  userView: Views = Views.OVERVIEW

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      firstname: ["", Validators.required, this.noWhitespaceValidator],
      lastname: ["", Validators.required, this.noWhitespaceValidator]
    })
  }

  onSubmit(): void {
    const {firstname, lastname} = this.bookingForm.value
    const bookingData = this.booking$.getValue()
    
    if (!firstname || !lastname || !bookingData.overview || !bookingData.routes) {
      return
    }

    const booking: Booking = {
      firstname: "Mickey",
      lastname: "Lincoln",
      routes: bookingData.overview.offerIDs,
      price: bookingData.overview.price,
      travelTime: bookingData.overview.duration,
      companyName: bookingData.overview.company,
      id: bookingData.overview.uuid
    }

    this.bookingFetch.load(this.bookingService.addBooking(booking)
      .pipe(delay(300))) // Simulate more realistic loading time
  }

  ngOnInit() {
    this._subscriptions.push(
      this.bookingFetch.data$.subscribe(response => {
        if (response.status === 201)
          this.setView(Views.SUCCESS)
    }))
  }

  ngOnDestroy() {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe()
    }
  }

  get firstname(): AbstractControl | null {
    return this.bookingForm.get('firstname')
  }

  get lastname(): AbstractControl | null {
    return this.bookingForm.get('lastname')
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = control.value.trim().length === 0;
    return isWhitespace ? of({'whitespace': true}) : of(null);  
  }

  isInputValid(property: string): boolean {
    if (property === "firstname") {
      return !(this.firstname && this.firstname.dirty && this.firstname.errors)
    }
    
    if (property === "lastname") {
      return !(this.lastname && this.lastname.dirty && this.lastname.errors)
    }
    
    return false
  }

  formatPrice(price: number): string {
    return "€" + price.toString().replace(".", ",")
  }
  
  DtToDayMonthDate(datetime: Date): string {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(datetime)
  }

  DtStrToTime(datetimeStr: string): string {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    }).format(new Date(datetimeStr))
  }

  getTimegap(start: string, end: string): string {
    return getTimegap(start, end)
  }

  setView(view: Views): void {
    this.userView = view
  }

  get Views() {
    return Views
  }
}
