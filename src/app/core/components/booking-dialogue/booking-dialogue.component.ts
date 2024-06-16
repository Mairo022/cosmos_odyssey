import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-dialogue',
  standalone: true,
  imports: [],
  templateUrl: './booking-dialogue.component.html',
  styleUrl: './booking-dialogue.component.scss'
})
export class BookingDialogueComponent {
  @Input() isOpen: boolean = false;
  @Output() openChangeEvent = new EventEmitter<void>()

  closeDialogue() {
    this.openChangeEvent.emit()
    this.isOpen = false;
  }
}
