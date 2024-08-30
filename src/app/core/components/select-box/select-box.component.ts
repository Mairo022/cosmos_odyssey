import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subject, take} from "rxjs";

@Component({
  selector: 'app-select-box',
  standalone: true,
  template: `
    <div class="select_box">
      <div [attr.class]="'selected ' + name"  (click)="onTriggerDropdown()">
        <span [attr.class]="'value ' + name">{{selectedValue}}</span>
      </div>
      <ul class="options" [class.closed]="!open">
        @for (option of options; track option) {
          @if (option !== selectedValue && option !== hiddenOption) {
            <li class="option" (click)="handleSelectChange(option)">{{option}}</li>
          }
        }
      </ul>
    </div>
  `,
  styleUrl: './select-box.component.scss'
})
export class SelectBoxComponent {
  @Input() name = ""
  @Input() hiddenOption = ""
  @Input() optionsSubject: Subject<string[]> = new Subject()

  @Input() placeholder = ""
  @Input() defaultValue = ""

  @Output() selectChanged = new EventEmitter<string>()

  open = false
  selectedValue = ""
  options = new Array<string>

  ngOnInit() {
    this.optionsSubject.pipe(take(1)).subscribe(options => {
      this.initAssignValues(options)
    })

    this.onWindowClick = this.onWindowClick.bind(this)
    document.addEventListener('click', this.onWindowClick)
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onWindowClick)
  }

  initAssignValues(options: Array<string>) {
    if (this.defaultValue) {
      const isAdditionalOption = !options.includes(this.defaultValue)

      this.options = isAdditionalOption
        ? [this.defaultValue].concat(options)
        : options

      this.selectedValue = this.defaultValue
      return
    }

    this.options = options
    this.selectedValue = this.placeholder
  }

  onWindowClick(e: MouseEvent) {
    if (!this.open && !e.target && !this.open) return

    const classname = (e.target as HTMLElement).className
    const isSelectElement =
         classname == "option"
      || classname == `selected ${this.name}`
      || classname == `value ${this.name}`

    if (!isSelectElement) {
      this.open = false
    }
  }

  onTriggerDropdown() {
    this.open = !this.open
  }

  handleSelectChange(value: string) {
    if (this.selectedValue === value) return

    this.selectedValue = value
    this.open = false
    this.selectChanged.emit(value)
  }
}
