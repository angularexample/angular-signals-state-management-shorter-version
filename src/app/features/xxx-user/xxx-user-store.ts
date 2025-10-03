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
  private getUsersAction(): void {
    this.getUsersReducer();
    this.getUsersEffect();
  }

  private getUsersErrorAction(): void {
    this.getUsersErrorReducer();
    this.getUsersErrorEffect();
  }

  private getUsersSuccessAction(users: XxxUserType[]): void {
    this.getUsersSuccessReducer(users);
    this.getUsersSuccessEffect();
  }

  setSelectedUserIdAction(userId: number): void {
    this.setSelectUserIdReducer(userId);
    this.setSelectUserIdEffect();
  }

  showUsersAction(): void {
    this.showUsersEffect();
  }

  // Selectors
  // A selector is used to read any data from the state.
  // In a Signal-based state, it is a function that returns a signal.
  // By design, it is the only way to read the state.
  readonly selectSelectedUserId: Signal<number | undefined> = computed(() => this.userState().selectedUserId);

  readonly selectUsers: Signal<XxxUserType[]> = computed(() => this.userState().users);

  readonly selectIsUsersLoading: Signal<boolean> = computed(() => this.userState().isUsersLoading);

  readonly selectIsUsersLoaded: Signal<boolean> = computed(() => !this.selectIsUsersLoading() && this.selectUsers().length > 0);

  readonly selectIsUsersEmpty: Signal<boolean> = computed(() => this.selectIsUsersLoaded() && this.selectUsers().length === 0);

  // Reducers
  // A reducer is a function that takes the current state and an action and returns a new state.
  // It is used to update the state based on the action.
  // By design, it is the only way to change the state.
  private getUsersReducer(): void {
    this.userState.update(state =>
      ({
        ...state,
        isLoading: true,
        users: []
      })
    )
  }

  private getUsersErrorReducer(): void {
    this.userState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  private getUsersSuccessReducer(users: XxxUserType[]): void {
    this.userState.update(state =>
      ({
        ...state,
        isLoading: false,
        users
      })
    )
  }

  private setSelectUserIdReducer(userId: number): void {
    this.userState.update(state =>
      ({
        ...state,
        selectedUserId: userId
      })
    )
  }

  // Effects
  // An effect is where we run a service to access data.
  // It is also used to navigate to a new page or to display a dialog.
  private getUsersEffect(): void {
    this.loadingService.loadingOn();
    let isError: boolean = false;
    this.userDataService.getUsers().pipe(
      catchError(() => {
        isError = true;
        this.getUsersErrorAction();
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
        this.getUsersSuccessAction(apiResponse.users);
      }
    })
  }

  private getUsersErrorEffect(): void {
    this.loadingService.loadingOff();
    this.alertService.showError('Error loading users');
  }

  private getUsersSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private setSelectUserIdEffect(): void {
    void this.router.navigateByUrl('/post')
  }

  private showUsersEffect(): void {
    if (!this.selectIsUsersLoaded()) {
      this.getUsersAction();
    }
  }
}
