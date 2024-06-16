import { Component } from '@angular/core';
import { BookingDialogueComponent } from '../booking-dialogue/booking-dialogue.component';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [BookingDialogueComponent],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  isBookingDialogueOpen: boolean = false;
  isBookingRowOpen: boolean = false

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
