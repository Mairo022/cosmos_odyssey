import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: false,
  templateUrl: './spinner.svg',
})
export class LoadingComponent {
  @Input() fillColor = 'rgb(255, 0, 0)'
  @Input() height = '3rem'
  @Input() width = '3rem'
}
