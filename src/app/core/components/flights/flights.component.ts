import { Component } from '@angular/core';
import { BookingDialogueComponent } from '../booking-dialogue/booking-dialogue.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [BookingDialogueComponent, ReactiveFormsModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  isBookingDialogueOpen: boolean = false;
  isBookingRowOpen: boolean = false

  routeForm: FormGroup
  
  constructor(private fb: FormBuilder) {
    this.routeForm = this.fb.group({
      from: null,
      to: null
    })
  }

  onSubmit(): void {

  }

  setBookingRowOpen() {
    this.isBookingRowOpen = !this.isBookingRowOpen
  }
  openBookingDialogue() {
    this.isBookingDialogueOpen = true
  }
  closeBookingDialogue() {
    this.isBookingDialogueOpen = false
  }
}
