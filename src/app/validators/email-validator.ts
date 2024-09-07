import {AbstractControl} from "@angular/forms";
import {of} from "rxjs";

export default function emailValidator(control: AbstractControl) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    return emailRegex.test(control.value) ? of(null) : of({'email-valid': false})
}
