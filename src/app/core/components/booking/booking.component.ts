import { Component, inject } from '@angular/core';
import { AppState } from '../../store/app.state';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Fetch } from '../../services/fetch';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
}
