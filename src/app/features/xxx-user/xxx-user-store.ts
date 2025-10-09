import { catchError, of } from 'rxjs';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { XxxUserApiResponse, xxxUserInitialState, XxxUserState, XxxUserType } from './xxx-user-types';
import { XxxUserData } from './xxx-user-data'

/**
 * XxxUserStore is the feature state for the user page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx, then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxUserStore {
  private alertService: XxxAlert = inject(XxxAlert);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private router: Router = inject(Router);
  private userDataService: XxxUserData = inject(XxxUserData);

  // State
  // It is a single data object to store all the properties needed to support the view.
  private userState: WritableSignal<XxxUserState> = signal<XxxUserState>(xxxUserInitialState);

  // Actions
  // An action is what triggers a change in the state or runs an effect.
  // This version uses a single method for all actions.
  // The reducer part runs first to update the state.
  // Then the effect part runs the data service.
  // After the data service completes, the success or error reducer part runs, followed by the effect part.

  private getUsers(): void {
    this.userState.update(state =>
      ({
        ...state,
        isLoading: true,
        users: []
      })
    )
    this.loadingService.loadingOn();
    let isError: boolean = false;
    this.userDataService.getUsers().pipe(
      catchError(() => {
        isError = true;
        this.userState.update(state =>
          ({
            ...state,
            isLoading: false
          })
        )
        this.alertService.showError('Error. Unable to get users');
        const emptyResponse: XxxUserApiResponse = {
          limit: 0,
          skip: 0,
          total: 0,
          users: []
        };
        return of(emptyResponse);
      })
    ).subscribe((response: unknown): void => {
      if (!isError) {
        const apiResponse: XxxUserApiResponse = response as XxxUserApiResponse;
        this.userState.update(state =>
          ({
            ...state,
            isLoading: false,
            users: apiResponse.users
          })
        )
      }
      this.loadingService.loadingOff();
    })
  }

  setSelectedUserId(userId: number): void {
    this.userState.update(state =>
      ({
        ...state,
        selectedUserId: userId
      })
    )
    void this.router.navigateByUrl('/post')
  }

  showUsers(): void {
    if (!this.isUsersLoaded()) {
      this.getUsers();
    }
  }

  // Selectors
  // A selector is used to read any data from the state.
  // In a Signal-based state, it is a function that returns a signal.
  // By design, it is the only way to read the state.
  readonly selectedUserId: Signal<number | undefined> = computed(() => this.userState().selectedUserId);

  readonly users: Signal<XxxUserType[]> = computed(() => this.userState().users);

  readonly isUsersLoading: Signal<boolean> = computed(() => this.userState().isUsersLoading);

  readonly isUsersLoaded: Signal<boolean> = computed(() => !this.isUsersLoading() && this.users().length > 0);

  readonly isUsersEmpty: Signal<boolean> = computed(() => !this.isUsersLoading() && this.users().length === 0);
}
