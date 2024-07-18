import { Routes } from '@angular/router';
import { FlightsComponent } from './core/components/flights/flights.component';
import { BookingComponent } from './core/components/booking/booking.component';

export const routes: Routes = [
    {
        path: '',
        component: FlightsComponent
    },
    {
        path: 'booking',
        component: BookingComponent
    }
];
