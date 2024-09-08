import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() oneWay: boolean = true
  @Input() passengers: number = 1

  @Output() wayChanged = new EventEmitter<boolean>()
  @Output() passengersChanged = new EventEmitter<number>()

  setWay() {
    this.oneWay = !this.oneWay
    this.wayChanged.emit(this.oneWay)
  }

  setPassengers(passengers: number) {
    this.passengers = passengers
    this.passengersChanged.emit(passengers)
  }
}
