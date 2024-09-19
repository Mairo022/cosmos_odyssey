import {Component, inject} from '@angular/core';
import {ComponentsModule} from "../../../components/components.module";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {noWhitespaceValidator} from "../../../validators/no-whitespace-validator";
import emailValidator from "../../../validators/email-validator";
import {ticketValidator} from "../../../validators/ticket-validator";
import getValidationError from "../../../utils/validation-messages";
import capitalise from "../../../utils/capitalise";
import {Fetch, FetchStatus} from "../../../utils/fetch";
import {HttpResponse} from "@angular/common/http";
import {CheckInService} from "../services/check-in.service";

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule
  ],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss'
})
export class CheckInComponent {
  protected readonly FetchStatus = FetchStatus
  private readonly _checkInService = inject(CheckInService)

  checkInForm: FormGroup
  checkInFetch = new Fetch<HttpResponse<any>>(undefined, 0)

  get ticket(): AbstractControl | null {
    return this.checkInForm.get('ticket')
  }

  get email(): AbstractControl | null {
    return this.checkInForm.get('email')
  }

  constructor(private fb: FormBuilder) {
    this.checkInForm = this.fb.group({
      ticket: ["", Validators.required, [noWhitespaceValidator, ticketValidator]],
      email: ["", Validators.required, [noWhitespaceValidator, emailValidator]],
    }, { updateOn: 'blur' })
  }

  onCheckInSubmit() {
    const {email, ticket} = this.checkInForm.value

    this.checkInFetch.load(this._checkInService.checkIn(ticket, email))
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
}
