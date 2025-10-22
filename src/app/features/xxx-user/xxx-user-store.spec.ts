import { Component, Signal } from '@angular/core';
import { mockXxxUserApiResponse } from './xxx-user.mocks';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { XxxUserData } from './xxx-user-data';
import { XxxUserStore } from './xxx-user-store';

@Component({
  selector: 'xxx-dummy',
  template: ``,
})
class XxxDummyComponent {
}

describe('XxxUserStore', () => {
  const mockUserId = 1;
  let router: Router;
  let spyRouterNavigate: jest.SpyInstance;
  let store: XxxUserStore;

  const mockRoutes: Route[] = [
    {
      path: '**',
      component: XxxDummyComponent
    },
  ];

  const mockXxxAlert: Partial<XxxAlert> = {
    showError: jest.fn(),
    showInfo: jest.fn(),
    showWarning: jest.fn(),
  }

  const mockXxxLoadingService: Partial<XxxLoadingService> = {
    loadingOff: jest.fn(),
    loadingOn: jest.fn(),
  }

  const mockXxxUserData = {
    getUsers: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter(mockRoutes),
        {provide: XxxAlert, useValue: mockXxxAlert},
        {provide: XxxLoadingService, useValue: mockXxxLoadingService},
        {provide: XxxUserData, useValue: mockXxxUserData},
        XxxUserStore
      ],
    });
    router = TestBed.inject(Router);
    store = TestBed.inject(XxxUserStore);
    spyRouterNavigate = jest.spyOn(router, 'navigateByUrl');
    mockXxxUserData.getUsers.mockReturnValue(of(mockXxxUserApiResponse));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor phase', () => {
    it('should be created', () => {
      expect(store).toBeDefined();
    });

    it('should have setSelectedUserId', () => {
      expect(store.setSelectedUserId).toBeDefined();
    });

    it('should have showUsers', () => {
      expect(store.showUsers).toBeDefined();
    });

    it('should have isUsersEmpty', () => {
      expect(store.isUsersEmpty).toBeDefined();
    });

    it('should have isUsersLoaded', () => {
      expect(store.isUsersLoaded).toBeDefined();
    });

    it('should have isUsersLoading', () => {
      expect(store.isUsersLoading).toBeDefined();
    });

    it('should have selectedUserId', () => {
      expect(store.selectedUserId).toBeDefined();
    });

    it('should have users', () => {
      expect(store.users).toBeDefined();
    });
  })

  describe('isUsersEmpty', () => {
    it('should be true after initial state', () => {
      const result: Signal<boolean> = store.isUsersEmpty;
      expect(result()).toBe(true);
    });

    it('should false after loading users', () => {
      store.showUsers();
      const result: Signal<boolean> = store.isUsersEmpty;
      expect(result()).toBe(false);
    });
  })

  describe('setSelectedUserId', () => {
    it('should have expected selected user id', () => {
      store.setSelectedUserId(mockUserId);
      const result: Signal<number | undefined> = store.selectedUserId;
      expect(result()).toEqual(mockUserId);
    });

    it('should run router navigate', () => {
      store.setSelectedUserId(mockUserId);
      expect(spyRouterNavigate).toHaveBeenCalledWith('/post');
    });
  });

  describe('showUsers', () => {
    it('should call XxxUserData.getUsers when users are not loaded', () => {
      store.showUsers();
      expect(mockXxxUserData.getUsers).toHaveBeenCalled();
    });

    it('should not call loadUsers when users are loaded', () => {
      store.showUsers();
      mockXxxUserData.getUsers.mockClear();
      store.showUsers();
      expect(mockXxxUserData.getUsers).not.toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should run XxxUserData.getUsers', () => {
      store.showUsers();
      expect(mockXxxUserData.getUsers).toHaveBeenCalled();
    });

    it('should run XxxLoadingService.loadingOn and loadingOff', () => {
      store.showUsers();
      expect(mockXxxLoadingService.loadingOn).toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).toHaveBeenCalled();
    });

    it('should run XxxAlert.showError on error', () => {
      const errorMessage: string = `Error. Unable to get users`;
      mockXxxUserData.getUsers.mockReturnValue(throwError(() => new Error('some error')));
      store.showUsers();
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });
  })
});
