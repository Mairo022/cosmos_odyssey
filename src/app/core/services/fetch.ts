import { EMPTY, Observable, Subject, Subscription, catchError, finalize, map, of, tap, throwError } from "rxjs"

export class Fetch<TData> {
  private _isLoading = new Subject<boolean>
  private _hasError = new Subject<boolean>
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
      this._actionSubscription.unsubscribe()
    }
    
    this._isLoading.next(true)
    this._action$ = action$.pipe(
      tap((d) => {
        this._data.next(d)
        this._hasError.next(false)
      }),
      catchError(() => {
        this._hasError.next(true)
        return throwError(() => new Error("Fetch error"))
      }),
      finalize(() => {
        this._isLoading.next(false)
      })
    )

    this._actionSubscription = this._action$.subscribe()
  }

  reset(): void {
    this._isLoading.next(false)
    this._hasError.next(false)
    this._data = new Subject<TData>
    this._action$ = EMPTY

    if (this._actionSubscription) {
      this._actionSubscription.unsubscribe()
    }
  }

  get data(): Subject<TData> {
    return this._data
  }

  get action$(): Observable<TData> {
    return this._action$
  }

  get isLoading(): Subject<boolean> {
    return this._isLoading
  }

  get hasError(): Subject<boolean> {
    return this._hasError
  }
}