import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/flights/components/flights/flights.component').then(m => m.FlightsComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('./features/booking/components/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'check-in',
    loadComponent: () => import('./features/check-in/components/check-in.component').then(m => m.CheckInComponent)
  }
];
