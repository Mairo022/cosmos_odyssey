export interface FiltersForm {
  stops: -1 | 0 | 1 | 2 | 3,
  priceMin: number,
  priceMax: number,
  spacelines: Array<string>
}
