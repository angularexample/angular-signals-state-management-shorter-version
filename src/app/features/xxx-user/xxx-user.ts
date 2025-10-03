import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxUserStore } from './xxx-user-store';
import { XxxUserType } from './xxx-user-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContent,
  ],
  selector: 'xxx-user',
  templateUrl: './xxx-user.html',
})
export class XxxUser {
  protected readonly contentKey: string = 'user';
  private contentStore: XxxContentStore = inject(XxxContentStore);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentStore.contentByKey(this.contentKey);
  private userStore: XxxUserStore = inject(XxxUserStore);
  protected readonly isUsersEmpty: Signal<boolean> = this.userStore.isUsersEmpty;
  protected readonly isUsersLoaded: Signal<boolean> = this.userStore.isUsersLoaded;
  protected readonly isUsersLoading: Signal<boolean> = this.userStore.isUsersLoading;
  protected readonly selectedUserId: Signal<number | undefined> = this.userStore.selectedUserId;
  protected readonly users: Signal<XxxUserType[]> = this.userStore.users;

  constructor() {
    this.userStore.showUsers();
  }

  protected rowClick(user: XxxUserType): void {
    this.userStore.setSelectedUserId(user.id);
  }
}
