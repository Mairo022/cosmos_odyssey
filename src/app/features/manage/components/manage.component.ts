import {Component, DestroyRef, HostListener, inject} from '@angular/core';
import {ComponentsModule} from "../../../components/components.module";
import {Fetch, FetchStatus} from "../../../utils/fetch";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {noWhitespaceValidator} from "../../../validators/no-whitespace-validator";
import {ticketValidator} from "../../../validators/ticket-validator";
import emailValidator from "../../../validators/email-validator";
import getValidationError from "../../../utils/validation-messages";
import capitalise from "../../../utils/capitalise";
import {ManageService} from "../services/manage.service";
import {Booking, Views} from "../types/manage.model";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpResponse} from "@angular/common/http";
import { formatTime } from '../../../utils/time-utils';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent {
  protected readonly _SMALL_SCREEN_SIZE = 900
  protected readonly Views = Views
  protected readonly FetchStatus = FetchStatus
  protected readonly _manageService = inject(ManageService)
  protected readonly destroyRef = inject(DestroyRef)

  manageForm: FormGroup
  manageFetch = new Fetch<Booking>(undefined, 0)
  cancelFetch = new Fetch<HttpResponse<void>>(undefined, 0)

  booking: Booking | undefined = undefined
  view = Views.FORM
  open = false
  isSmallScreen = window.innerWidth <= this._SMALL_SCREEN_SIZE

  get ticket(): AbstractControl | null {
    return this.manageForm.get('ticket')
  }

  get email(): AbstractControl | null {
    return this.manageForm.get('email')
  }

  constructor(private fb: FormBuilder, private _route: ActivatedRoute, private _router: Router) {
    this.manageForm = this.fb.group({
      ticket: ["", Validators.required, [noWhitespaceValidator, ticketValidator]],
      email: ["", Validators.required, [noWhitespaceValidator, emailValidator]],
    }, { updateOn: 'blur' })
  }

  ngOnInit() {
    this.initHandleViews()
    this.initListenManageFetch()
    this.initListenCancelFetch()
  }

  initHandleViews() {
    this._route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const view = params['view']

        this.view = Object
          .values(Views)
          .includes(view)
          ? view
          : Views.FORM
      })
  }

  initListenManageFetch() {
    this.manageFetch.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.booking = data

        this._router.navigate([], {
          queryParams: { view: Views.BOOKING }
        })
      })
  }

  initListenCancelFetch() {
    this.cancelFetch.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.booking!.cancelled = true
      })
  }

  onManageSubmit() {
    const {email, ticket} = this.manageForm.value

    this.manageFetch.load(this._manageService.getBooking(ticket, email))
  }

  onCancel() {
    const {email, ticket} = this.manageForm.value
    this.booking!.cancelled = true

    this.cancelFetch.load(this._manageService.cancelBooking(ticket, email))
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.isSmallScreen = window.innerWidth <= this._SMALL_SCREEN_SIZE
  }

  isInputValid(property: string) {
    if (property === "ticket") {
      if (!this.ticket) return true
      return !(this.ticket && this.ticket.dirty && this.ticket.errors)
    }

    if (property === "email") {
      return !(this.email && this.email.dirty && this.email.errors)
    }

    return false
  }

  getValidationMessage(property: string): string {
    let errorKey = ""

    switch (property) {
      case 'ticket':
        property = "Ticket number"
        errorKey = Object.keys(this.ticket?.errors || {})[0] ?? ""
        break
      case 'email':
        errorKey = Object.keys(this.email?.errors || {})[0] ?? ""
        break
    }

    return getValidationError(errorKey, capitalise(property))
  }

  formatDatetimeToTime(dt: string | Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }

    return new Date(dt).toLocaleString('en-US', options)
  }

  formatDatetimeToDate(dt: string | Date, format: "long" | "short" = "short"): string {
    const isShortFormat = format === "short"

    const options: Intl.DateTimeFormatOptions = {
      year: isShortFormat ? undefined : "numeric",
      month: isShortFormat ? 'short' : 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }

    return new Date(dt).toLocaleString('en-US', options)
  }

  getDuration(startDT: string | Date, endDT: string | Date): string {
    startDT = new Date(startDT)
    endDT = new Date(endDT)

    const duration = (endDT.getTime() - startDT.getTime()) / (1000 * 60)

    return formatTime(duration)
  }

  getStatus(cancelled: boolean, checkedIn: boolean): string {
    if (cancelled) return "Cancelled"
    if (checkedIn) return "Checked in"

    return "Unknown"
  }
}
