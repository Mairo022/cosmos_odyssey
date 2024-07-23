import { AbstractControl } from "@angular/forms";
import { of } from "rxjs";

export function noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = control.value.trim().length === 0
    return isWhitespace ? of({'whitespace': true}) : of(null)
}