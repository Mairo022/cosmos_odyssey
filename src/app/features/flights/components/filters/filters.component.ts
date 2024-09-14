import {Component, Input } from '@angular/core';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  @Input() spacelines = new Array<string>

  dropdown_open = false

  readonly STOPS_RADIO_OPTIONS = [
    {key: "All", value: -1},
    {key: "Non-Transit", value: 0},
    {key: "1 stop", value: 1},
    {key: "2 stops", value: 2},
    {key: "3 stops", value: 3},
  ]
}
