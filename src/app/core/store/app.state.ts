import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Booking } from "./app.types";
import { LocalStorage } from "../utils/localStorage";

@Injectable({
    providedIn: "root"
})

export class AppState {
    private static instance: AppState
    private readonly EMPTY_BOOKING = {overview: undefined, routes: []}
    private _booking$ = new BehaviorSubject<Booking>({...this.EMPTY_BOOKING})

    private constructor() {}

    static getInstance() {
        if (!this.instance) 
            this.instance = new AppState()
        return this.instance
    }

    get booking$(): BehaviorSubject<Booking> {
        return this._booking$
    }

    set booking$(booking: Booking) {
        LocalStorage.setItem("booking", booking)
        this._booking$.next(booking)
    }

    resetBooking(): void {
        LocalStorage.deleteItem("booking")
        this._booking$ = new BehaviorSubject<Booking>({...this.EMPTY_BOOKING})
    }
}