import {AbstractControl} from "@angular/forms";
import {of} from "rxjs";
import { validate as uuidValidate } from 'uuid';

export function ticketValidator(control: AbstractControl) {
  const isValidUUID = uuidValidate(control.value)

  return isValidUUID ? of(null) : of({'tickedId-valid': false})
}
