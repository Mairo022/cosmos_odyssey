import { Component, inject } from '@angular/core';
import { AppState } from '../../store/app.state';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Fetch } from '../../services/fetch';
import { CompanyLogoComponent } from "../company-logo/company-logo.component";
import { RouterLink } from '@angular/router';
import { getTimegap } from '../../utils/timeUtils';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CompanyLogoComponent, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  appState = AppState.getInstance() 
  booking$ = this.appState.booking$;

  private readonly bookingService = inject(BookingService)
  private _subscriptions: Subscription[] = []

  bookingFetch = new Fetch<HttpResponse<any>>()
  bookingForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      firstname: "",
      lastname: ""
    })
  }

  onSubmit(): void {
    const {firstname, lastname} = this.bookingForm.value
    
    if (!firstname || !lastname) {
      return
    }
  }

  ngOnInit() {
    this._subscriptions.push(this.booking$.subscribe(value => {
      console.log('Booking value:', value);
    }));
  }

  ngOnDestroy() {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe()
    }
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
}
