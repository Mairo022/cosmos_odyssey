import {AbstractControl} from "@angular/forms";
import {of} from "rxjs";

export function ticketValidator(control: AbstractControl) {
  return control.value.length === 6 ? of(null) : of({'tickedId-valid': false})
}
