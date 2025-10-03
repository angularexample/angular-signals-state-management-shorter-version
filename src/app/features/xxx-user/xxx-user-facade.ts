import { inject, Injectable, Signal } from '@angular/core';
import { XxxUserType } from './xxx-user-types';
import { XxxUserStore } from './xxx-user-store';

@Injectable({
  providedIn: 'root'
})
export class XxxUserFacade {
  private userStore: XxxUserStore = inject(XxxUserStore);
  readonly isUsersEmpty: Signal<boolean> = this.userStore.selectIsUsersEmpty;
  readonly isUsersLoaded: Signal<boolean> = this.userStore.selectIsUsersLoaded;
  readonly isUsersLoading: Signal<boolean> = this.userStore.selectIsUsersLoading;
  readonly selectedUserId: Signal<number | undefined> = this.userStore.selectSelectedUserId;
  readonly users: Signal<XxxUserType[]> = this.userStore.selectUsers;

  showUsers(): void {
    this.userStore.showUsersAction();
  }

  setSelectedUserId(userId: number): void {
    this.userStore.setSelectedUserIdAction(userId);
  }
}
