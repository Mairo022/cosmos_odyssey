import { EMPTY, Observable, Subject, Subscription, catchError, finalize, map, of, tap, throwError } from "rxjs"

export class Fetch<TData> {
  private _isLoading = false
  private _hasError = false
  private _data = new Subject<TData>
  private _action$: Observable<TData> = EMPTY
  private _actionSubscription: Subscription | null = null

  constructor(action$: Observable<TData> | undefined = undefined) {
    if (action$) {
      this.load(action$)
    }
  }

  load(action$: Observable<TData>): void {
    if (this._actionSubscription) {
      this._actionSubscription.unsubscribe();
    }

    this._isLoading = true
    this._action$ = action$.pipe(
      tap((d) => {
        this._data.next(d)
        this._hasError = false
      }),
      catchError(() => {
        this._hasError = true
        return throwError(() => new Error("Fetch error"))
      }),
      finalize(() => {
        this._isLoading = false
      })
    )

    this._actionSubscription = this._action$.subscribe()
  }

  get data(): Subject<TData> {
    return this._data
  }

  get action$(): Observable<TData> {
    return this._action$
  }

  get isLoading(): boolean {
    return this._isLoading
  }

  get hasError(): boolean {
    return this._hasError
  }
}