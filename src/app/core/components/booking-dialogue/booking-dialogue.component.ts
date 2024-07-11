import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Booking, RoutesRendered } from '../flights/flights.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Fetch } from '../../services/fetch';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-dialogue',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking-dialogue.component.html',
  styleUrl: './booking-dialogue.component.scss'
})
export class BookingDialogueComponent {
  @Input() isOpen: boolean = false;
  @Output() openChangeEvent = new EventEmitter<void>()
  @Input() offer: RoutesRendered | undefined

  private readonly bookingService = inject(BookingService)
  booking = new Fetch<HttpResponse<any>>()

  bookingForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      firstname: "",
      lastname: ""
    })
  }

  onSubmit(): void {
    const {firstname, lastname} = this.bookingForm.value
    
    if (!firstname || !lastname || !this.offer) {
      return
    }
    
    const booking: Booking = {
      firstname: "jim",
      lastname: "carrey",
      routes: this.offer.offerIDs,
      price: this.offer.price,
      travelTime: this.offer.duration,
      companyName: this.offer.company,
      id: this.offer.uuid
    }

    this.booking.load(this.bookingService.addBooking(booking))

    setTimeout(() => {
      this.closeDialogue()
    }, 800)
  }

  closeDialogue(): void {
    this.openChangeEvent.emit()
    this.isOpen = false;
    this.booking.reset()
  }
}
