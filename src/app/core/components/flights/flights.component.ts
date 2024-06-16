import { Component } from '@angular/core';
import { BookingDialogueComponent } from '../booking-dialogue/booking-dialogue.component';
import { RoutesService } from '../../services/routes.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [BookingDialogueComponent, ReactiveFormsModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.scss'
})
export class FlightsComponent {
  routes: any[] = []

  isDataLoaded = false
  isBookingDialogueOpen: boolean = false;
  isBookingRowOpen: boolean = false

  routeForm: FormGroup
  

  constructor(private routesService: RoutesService, private fb: FormBuilder) {
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

    this.getRoutes(from, to)
  }

  private getRoutes(from: string, to: string) {
    this.routesService
      .getRoutes(from, to)
      .subscribe({
        next: (routes) => {
          this.routes = routes
          this.setLoaded()
        },
        error: (e) => {
          console.log(e);
          this.setLoaded()
        }
      })
  }

  setLoaded() {
    this.isDataLoaded = true
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
