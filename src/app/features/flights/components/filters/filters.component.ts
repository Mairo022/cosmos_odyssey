import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FiltersForm} from "../../types/filters.model";
import {AppState} from "../../../../store/app.state";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent {
  @Input() spacelines = new Array<string>
  @Output() filtersChanged = new EventEmitter<FiltersForm>()

  filtersForm!: FormGroup
  dropdown_open = false

  readonly STOPS_RADIO_OPTIONS = [
    {key: "All", value: -1},
    {key: "Non-Transit", value: 0},
    {key: "1 stop", value: 1},
    {key: "2 stops", value: 2},
    {key: "3 stops", value: 3},
  ]

  constructor(private fb: FormBuilder, private readonly _appState: AppState) {
    this.initFiltersForm()
  }

  initFiltersForm() {
    const filters = this._appState.offerFilters

    this.filtersForm = this.fb.group({
      stops: filters?.stops ?? -1,
      priceMin: filters?.priceMin ?? 0,
      priceMax: filters?.priceMax ?? null,
      spacelines: this.fb.array(filters?.spacelines ?? [])
    })
  }

  ngAfterViewInit() {
    const filters = this._appState.offerFilters

    if (filters) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>

      checkboxes.forEach(checkbox => {
        if (filters.spacelines.includes(checkbox.value)) checkbox.checked = true
      })
    }
  }

  onSpacelineChange(e: Event) {
    const target = e.target as HTMLInputElement
    const selectedSpacelines = (this.filtersForm.controls['spacelines'] as FormArray)

    if (target.checked) {
      selectedSpacelines.push(this.fb.control(target.value))
      return
    }

    const index = selectedSpacelines.controls.findIndex(line => line.value === target.value)
    selectedSpacelines.removeAt(index)
  }

  onApplyFilters() {
    this.filtersChanged.emit(this.filtersForm.value)
    this._appState.offerFilters = this.filtersForm.value
  }

  resetFilters() {
    this.filtersForm.reset({
      stops: -1,
      priceMin: 0,
      priceMax: null
    });

    (this.filtersForm.get('spacelines') as FormArray).clear()

    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>
    checkboxes.forEach(checkbox => {
      checkbox.checked = false
    })
  }
}
