import { Component, inject } from '@angular/core';
import { BookingDialogueComponent } from '../booking-dialogue/booking-dialogue.component';
import { RoutesService } from '../../services/routes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fetch } from '../../services/fetch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [BookingDialogueComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  private readonly routesService = inject(RoutesService)
  planets = new Fetch<string[]>(this.routesService.getPlanets())

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
    const from = this.routeForm.value.from
    const to = this.routeForm.value.to

    if (!from || !to) {
      return
    }
  }

  isSelectedPlanet(planet: string, source: "from" | "to"): boolean {
    if (source === "from" && planet === this.routeForm.value.to) return true
    if (source === "to" && planet === this.routeForm.value.from) return true
    return false
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
