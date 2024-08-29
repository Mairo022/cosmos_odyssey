import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-select-box',
  standalone: true,
  template: `
    <div class="select_box">
      <div [attr.class]="'selected ' + name"  (click)="onTriggerDropdown()">
        <span [attr.class]="'value ' + name">{{selectedValue}}</span>
      </div>
      <ul class="options" [class.closed]="!open">
        @if (showDefaultOption && defaultOption !== selectedValue) {
          <li class="option" (click)="handleSelectChange(defaultOption)">{{defaultOption}}</li>
        }
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
  @Input() defaultOption = "CHANGE ME"
  @Input() options: Array<string> | null = null ?? []
  @Input() showDefaultOption = false

  @Output() selectChanged = new EventEmitter<string>()

  open = false
  selectedValue = this.defaultOption

  ngOnInit() {
    this.onWindowClick = this.onWindowClick.bind(this)
    document.addEventListener('click', this.onWindowClick)
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onWindowClick)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultOption']) {
      this.selectedValue = changes['defaultOption'].currentValue;
    }
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
