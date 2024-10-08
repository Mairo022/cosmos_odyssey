import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
  catchError,
  finalize,
  tap,
  throwError
} from "rxjs"

export class Fetch<TData> {
  private _status$ = new BehaviorSubject(FetchStatus.None)
  private _error$ = new BehaviorSubject<any>(null)
  private _data$ = new Subject<TData>
  private _dataBS$ = new BehaviorSubject<any>(null)
  private _action$: Observable<TData> = EMPTY
  private _actionSubscription: Subscription | null = null

  private _loadingDelayTimer: null | ReturnType<typeof setTimeout> = null

  constructor(action$: Observable<TData> | undefined = undefined, private _loadingDisplayDelay: number = 0) {
    if (action$) {
      this.load(action$)
    }
  }

  load(action$: Observable<TData>): void {
    if (this._actionSubscription) {
      this._actionSubscription.unsubscribe()
    }

    this._handleLoadingState(true, this._loadingDisplayDelay)

    this._action$ = action$.pipe(
      tap((data) => {
        this._data$.next(data)
        this._dataBS$.next(data)
        this._error$.next(null)

        if (this.isDataNotEmpty(data)) {
          this._status$.next(FetchStatus.Loaded)
        } else {
          this._status$.next(FetchStatus.LoadedEmpty)
        }
      }),
      catchError((e) => {
        this._handleLoadingState(false)
        this._status$.next(FetchStatus.Error)
        this._error$.next(e)

        return throwError(() => new Error(e))
      }),
      finalize(() => {
        this._handleLoadingState(false)
      })
    )

    this._actionSubscription = this._action$.subscribe()
  }

  reset(): void {
    this._status$.next(FetchStatus.None)
    this._data$ = new Subject<TData>
    this._dataBS$.next(null)
    this._error$.next(null)
    this._action$ = EMPTY

    if (this._actionSubscription) {
      this._actionSubscription.unsubscribe()
    }
  }

  private _handleLoadingState(isLoading: boolean, delay: number = 0) {
    if (isLoading) {
      if (this._loadingDelayTimer !== null) {
        clearTimeout(this._loadingDelayTimer)
      }

      this._loadingDelayTimer = setTimeout(() => {
        this._status$.next(FetchStatus.Loading)
      }, delay)
    }

    if (!isLoading) {
      if (this._loadingDelayTimer !== null) {
        clearTimeout(this._loadingDelayTimer)
        this._loadingDelayTimer = null
      }
    }
  }

  isDataNotEmpty(data: unknown): boolean {
    if (data === null) {
      return false
    }

    if (typeof data === "string") {
      return data.trim().length > 0
    }

    if (Array.isArray(data)) {
      return data.length > 0
    }

    if (typeof data === 'object') {
      return Object.keys(data).length > 0
    }

    return true
  }

  get status$(): BehaviorSubject<FetchStatus> {
    return this._status$
  }

  get data$(): Subject<TData> {
    return this._data$
  }

  get dataBS$(): BehaviorSubject<TData> {
    return this._dataBS$
  }

  get error(): BehaviorSubject<any> {
    return this._error$
  }
}

export enum FetchStatus {
  None = "None",
  Error = "Error",
  Loading = "Loading",
  Loaded = "Loaded",
  LoadedEmpty = "LoadedEmpty"
}
