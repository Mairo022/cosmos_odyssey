import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Booking } from "./app.types";
import { LocalStorage } from "../utils/local-storage-utils";

@Injectable({
    providedIn: "root"
})

export class AppState {
    private static _instance: AppState
    private readonly EMPTY_BOOKING = {overview: undefined, routes: []}
    private _booking$ = new BehaviorSubject<Booking>({...this.EMPTY_BOOKING})

    private constructor() {
        const booking = LocalStorage.getItem<Booking>("booking")

        if (booking && booking.overview && booking.routes) {
            booking.overview.startDT = new Date(booking.overview.startDT)
            booking.overview.endDT = new Date(booking.overview.endDT)
            this._booking$.next(booking)
        }
    }

    static getInstance(): AppState {
        if (!this._instance) 
            this._instance = new AppState()
        return this._instance
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