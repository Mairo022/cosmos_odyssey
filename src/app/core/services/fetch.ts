import { Observable, catchError, finalize, tap, throwError } from "rxjs"

export class Fetch<TData> {
  private _isLoading = false
  private _hasError = false
  private _action$: Observable<TData>

  constructor(action$: Observable<TData>) {
    this._isLoading = true
    this._action$ = action$.pipe(
      tap(() => {
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