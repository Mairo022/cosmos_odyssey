import { EMPTY, Observable, catchError, finalize, tap, throwError } from "rxjs"

export class Fetch<TData> {
  private _isLoading = false
  private _hasError = false
  private _action$: Observable<TData> = EMPTY

  constructor(action$: Observable<TData> | undefined = undefined) {
    if (!action$) return
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

  load(action$: Observable<TData>): void {
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