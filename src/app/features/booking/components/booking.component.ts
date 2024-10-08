import { Component, inject } from '@angular/core';
import { AppState } from '../../../store/app.state';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import {Fetch, FetchStatus} from '../../../utils/fetch';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { getTimegap } from '../../../utils/time-utils';
import { Booking, Views } from '../types/booking.model';
import { noWhitespaceValidator } from '../../../validators/no-whitespace-validator';
import emailValidator from "../../../validators/email-validator";
import getValidationError from "../../../utils/validation-messages";
import capitalise from "../../../utils/capitalise";
import {ComponentsModule} from "../../../components/components.module";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ComponentsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
  protected readonly FetchStatus = FetchStatus
  private readonly _bookingService = inject(BookingService)
  private _subscriptions: Subscription[] = []

  bookingFetch = new Fetch<HttpResponse<any>>(undefined, 200)
  bookingForm: FormGroup

  booking$ = this._appState.booking$

  userView: Views = Views.OVERVIEW

  constructor(private fb: FormBuilder,
              private _router: Router,
              private _route: ActivatedRoute,
              private readonly _appState: AppState
  ) {
    this.bookingForm = this.fb.group({
      firstname: ["", Validators.required, noWhitespaceValidator],
      lastname: ["", Validators.required, noWhitespaceValidator],
      email: ["", Validators.required, [noWhitespaceValidator, emailValidator]],
    }, { updateOn: 'blur' })
  }

  onSubmit(): void {
    const {firstname, lastname, email} = this.bookingForm.value
    const bookingData = this.booking$.getValue()

    if (!firstname || !lastname || !bookingData.overview || !bookingData.routes) {
      return
    }

    const booking: Booking = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      flight_ids: bookingData.overview.offerIDs,
      price: bookingData.overview.price,
      travelTime: bookingData.overview.duration,
      id: bookingData.overview.uuid
    }

    this.bookingFetch.load(this._bookingService.addBooking(booking))
  }

  ngOnInit() {
    this.initRedirect()

    this._subscriptions.push(
      this.bookingFetch.data$.subscribe(response => {
        if (response.status === 201) {
          this.changeView(Views.SUCCESS)
          this._appState.resetBooking()
        }
    }))

    this._route.queryParams.subscribe(params => {
      this.userView = params['view'] ?? this.userView
    })
  }

  ngOnDestroy() {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe()
    }
  }

  private initRedirect(): void {
    if (!this.booking$.getValue().overview || !this.booking$.getValue().routes) {
      this._router.navigateByUrl("/")
    }
  }

  get firstname(): AbstractControl | null {
    return this.bookingForm.get('firstname')
  }

  get lastname(): AbstractControl | null {
    return this.bookingForm.get('lastname')
  }

  get email(): AbstractControl | null {
    return this.bookingForm.get('email')
  }

  isInputValid(property: string): boolean {
    if (property === "firstname") {
      return !(this.firstname && this.firstname.dirty && this.firstname.errors)
    }

    if (property === "lastname") {
      return !(this.lastname && this.lastname.dirty && this.lastname.errors)
    }

    if (property === "email") {
      return !(this.email && this.email.dirty && this.email.errors)
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

  getValidationMessage(property: string): string {
    let errorKey = ""

    switch (property) {
      case 'first name':
        errorKey = Object.keys(this.firstname?.errors || {})[0] ?? ""
        break
      case 'last name':
        errorKey = Object.keys(this.lastname?.errors || {})[0] ?? ""
        break
      case 'email':
        errorKey = Object.keys(this.email?.errors || {})[0] ?? ""
        break
    }

    return getValidationError(errorKey, capitalise(property))
  }

  getTimegap(start: string, end: string): string {
    return getTimegap(start, end)
  }

  changeView(view: Views): void {
    this._router.navigate([], {
      queryParams: { view }
    })
  }

  get Views(): typeof Views {
    return Views
  }
}
