import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockUser, mockUsers } from "./xxx-user.mocks";
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxUser } from './xxx-user';
import { XxxUserStore } from './xxx-user-store';
import { XxxUserType } from './xxx-user-types';

// Use extended class to test protected method.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContent,
  ],
  selector: 'extended-xxx-user',
  templateUrl: './xxx-user.html',
})
class ExtendedXxxUser extends XxxUser {
  override rowClick(user: XxxUserType) {
    super.rowClick(user);
  }
}

describe('XxxUser', () => {
  let component: ExtendedXxxUser;
  let fixture: ComponentFixture<ExtendedXxxUser>;
  const mockUserId: number = 1;

  const mockXxxContentStore = {
    contentByKey: jest.fn(),
  }

  const mockXxxUserStore = {
    isUsersEmpty: signal(false),
    isUsersLoaded: signal(false),
    isUsersLoading: signal(false),
    selectedUserId: signal(mockUserId),
    setSelectedUserId: jest.fn(),
    showUsers: jest.fn(),
    users: signal(mockUsers),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedXxxUser],
      providers: [
        {provide: XxxContentStore, useValue: mockXxxContentStore},
        {provide: XxxUserStore, useValue: mockXxxUserStore}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ExtendedXxxUser);
    component = fixture.componentInstance;
  });

  describe('construction', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  });

  describe('rowClick', () => {
    it('should call userStore.setSelectedUser', () => {
      component.rowClick(mockUser);
      expect(mockXxxUserStore.setSelectedUserId).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
