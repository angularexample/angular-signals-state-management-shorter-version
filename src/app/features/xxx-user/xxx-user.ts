import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxUserFacade } from './xxx-user-facade';
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
  private userFacade: XxxUserFacade = inject(XxxUserFacade);
  protected readonly isUsersEmpty: Signal<boolean> = this.userFacade.isUsersEmpty;
  protected readonly isUsersLoaded: Signal<boolean> = this.userFacade.isUsersLoaded;
  protected readonly isUsersLoading: Signal<boolean> = this.userFacade.isUsersLoading;
  protected readonly selectedUserId: Signal<number | undefined> = this.userFacade.selectedUserId;
  protected readonly users: Signal<XxxUserType[]> = this.userFacade.users;

  constructor() {
    this.userFacade.showUsers();
  }

  protected rowClick(user: XxxUserType): void {
    this.userFacade.setSelectedUserId(user.id);
  }
}
