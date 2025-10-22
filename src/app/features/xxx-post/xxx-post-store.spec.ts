import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { mockPost, mockPost1, mockPost2, mockPosts } from './xxx-post.mocks';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { XxxPostData } from './xxx-post-data';
import { XxxPostStore } from './xxx-post-store';
import { XxxUserStore } from '../xxx-user/xxx-user-store';
import { XxxPostType } from './xxx-post-types';

@Component({
  selector: 'xxx-dummy',
  template: ``,
})
class XxxDummyComponent {
}

describe('XxxPostStore', () => {
  let router: Router;
  let spyRouterNavigate: jest.SpyInstance;
  let store: any;
  const userId: number = mockPost.userId;

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

  const mockXxxPostData = {
    getPosts: jest.fn(),
    updatePost: jest.fn()
  }

  const mockXxxUserStore = {
    selectedUserId: <WritableSignal<number | undefined>> signal(userId)
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter(mockRoutes),
        {provide: XxxAlert, useValue: mockXxxAlert},
        {provide: XxxLoadingService, useValue: mockXxxLoadingService},
        {provide: XxxPostData, useValue: mockXxxPostData},
        {provide: XxxUserStore, useValue: mockXxxUserStore},
        XxxPostStore
      ],
    });
    router = TestBed.inject(Router);
    store = TestBed.inject(XxxPostStore);
    spyRouterNavigate = jest.spyOn(router, 'navigateByUrl');
    mockXxxPostData.getPosts.mockReturnValue(of(mockPosts));
    mockXxxPostData.updatePost.mockReturnValue(of(mockPost));
    mockXxxUserStore.selectedUserId = signal(userId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor phase', () => {
    it('should be created', () => {
      expect(store).toBeDefined();
    });

    it('should have isNoSelectedPost', () => {
      expect(store.isNoSelectedPost).toBeDefined();
    });

    it('should have isNoSelectedUser', () => {
      expect(store.isNoSelectedUser).toBeDefined();
    });

    it('should have isPostsEmpty', () => {
      expect(store.isPostsEmpty).toBeDefined();
    });

    it('should have isPostsLoaded', () => {
      expect(store.isPostsLoaded).toBeDefined();
    });

    it('should have isPostsLoading', () => {
      expect(store.isPostsLoading).toBeDefined();
    });

    it('should have isSaveButtonDisabled', () => {
      expect(store.isSaveButtonDisabled).toBeDefined();
    });

    it('should have postForm', () => {
      expect(store.postForm).toBeDefined();
    });

    it('should have posts', () => {
      expect(store.posts).toBeDefined();
    });

    it('should have showPosts', () => {
      expect(store.showPosts).toBeDefined();
    });

    it('should have selectedPost', () => {
      expect(store.selectedPost).toBeDefined();
    });

    it('should have selectedPostId', () => {
      expect(store.selectedPostId).toBeDefined();
    });

    it('should have setPostForm', () => {
      expect(store.setPostForm).toBeDefined();
    });

    it('should have setSelectedPostId', () => {
      expect(store.setSelectedPostId).toBeDefined();
    });

    it('should have setSelectedUserId', () => {
      expect(store.setSelectedUserId).toBeDefined();
    });

    it('should have updatePost', () => {
      expect(store.updatePost).toBeDefined();
    });
  })

  describe('isNoSelectedUser', () => {
    it('should be true when there is no selected user id', () => {
      const result = store.isNoSelectedUser
      expect(result()).toBe(true);
    });

    it('should be false when there is a selected user id', () => {
      store.setSelectedUserId(userId);
      const result = store.isNoSelectedUser
      expect(result()).toBe(false);
    });
  });

  describe('isPostsEmpty', () => {
    it('should be true on initial state', () => {
      const result: Signal<boolean> = store.isPostsEmpty;
      expect(result()).toBe(true);
    });

    it('should be false when there are posts', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      const result: Signal<boolean> = store.isPostsEmpty;
      expect(result()).toBe(false);
    });
  })

  describe('isPostsLoaded', () => {
    it('should be false on initial state', () => {
      const result: Signal<boolean> = store.isPostsLoaded;
      expect(result()).toBe(false);
    });

    it('should be true when there are posts', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      const result: Signal<boolean> = store.isPostsLoaded;
      expect(result()).toBe(true);
    });
  })

  describe('selectedPost', () => {
    it('should be undefined when there is no selected post id', () => {
      const result: Signal<XxxPostType | undefined> = store.selectedPost;
      expect(result()).toBeUndefined();
    });

    it('should be true when there are posts', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      store.setSelectedPostId(mockPost.id);
      const result: Signal<XxxPostType | undefined> = store.selectedPost;
      expect(result()).toEqual(mockPost);
    });
  })

  describe('isNoSelectedPost', () => {
    it('should be true when there is no selected post id', () => {
      const result = store.isNoSelectedPost;
      expect(result()).toBe(true);
    });

    it('should be true when posts is empty', () => {
      mockXxxPostData.getPosts.mockReturnValue(of([]));
      store.setSelectedUserId(userId);
      store.setSelectedPostId(mockPost.id);
      const result = store.isNoSelectedPost;
      expect(result()).toBe(true);
    });

    it('should be true when selected post id does not match any of the posts', () => {
      store.setSelectedUserId(userId);
      // store.getPosts();
      store.setSelectedPostId(0);
      const result = store.isNoSelectedPost;
      expect(result()).toBe(true);
    });

    it('should be false when there is a selected post id and it matches a post', () => {
      store.setSelectedUserId(userId);
      //store.getPosts();
      store.setSelectedPostId(mockPost.id);
      const result = store.isNoSelectedPost;
      expect(result()).toBe(false);
    });
  });

  describe('isSaveButtonDisabled and setPostForm', () => {
    it('should be true when there is selected post and it equals the form post', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      store.setSelectedPostId(mockPost.id);
      store.setPostForm(mockPost1);
      const result = store.isSaveButtonDisabled;
      expect(result()).toBe(true);
    });

    it('should be false when there is a selected post and it doe not equal the form post', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      store.setSelectedPostId(mockPost.id);
      store.setPostForm(mockPost2);
      const result = store.isSaveButtonDisabled;
      expect(result()).toBe(false);
    });
  })

  describe('getPosts', () => {
    it('should run XxxPostData.getPosts', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      expect(mockXxxPostData.getPosts).toHaveBeenCalled();
    });

    it('should run XxxLoadingService.loadingOn and loadingOff', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      expect(mockXxxLoadingService.loadingOn).toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).toHaveBeenCalled();
    });

    it('should run XxxAlert.showError on error', () => {
      const errorMessage: string = `Error. Unable to get posts for user: ${userId}`;
      mockXxxPostData.getPosts.mockReturnValue(throwError(() => new Error('some error')));
      store.setSelectedUserId(userId);
      store.getPosts();
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });

    it('should not run XxxPostData.getPosts when userId is undefined', () => {
      store.getPosts();
      expect(mockXxxPostData.getPosts).not.toHaveBeenCalled();
    });
  })

  describe('setSelectedPostId', () => {
    it('should have expected selected post id', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      store.setSelectedPostId(mockPost1.id);
      const result: Signal<number | undefined> = store.selectedPostId;
      expect(result()).toBe(mockPost1.id);
    });

    it('should run router navigate', () => {
      store.setSelectedPostId(userId);
      expect(spyRouterNavigate).toHaveBeenCalledWith('/post/edit');
    });
  });

  describe('setSelectedUserId', () => {
    it('should have expected selected user id', () => {
      store.setSelectedUserId(userId);
      const result: Signal<number | undefined> = store.selectedUserId;
      expect(result()).toBe(userId);
    });

    it('should set selectedPostId to undefined', () => {
      store.setSelectedPostId(mockPost.id);
      store.setSelectedUserId(userId);
      const result: Signal<number | undefined> = store.selectedPostId;
      expect(result()).toBe(undefined);
    });

    it('should set postForm to undefined', () => {
      store.setPostForm(mockPost);
      store.setSelectedUserId(userId);
      const result: Signal<number | undefined> = store.postForm;
      expect(result()).toBe(undefined);
    });
  });

  describe('updatePost', () => {
    it('should run XxxAlert.showError when there is no post form', () => {
      const errorMessage: string =  'Error. Unable to update post: 0';
      store.updatePost();
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });

    it('should run XxxPostData.updatePost', () => {
      store.setPostForm(mockPost);
      store.updatePost();
      expect(mockXxxPostData.updatePost).toHaveBeenCalled();
    });

    it('should run XxxLoadingService.loadingOn and loadingOff', () => {
      store.setPostForm(mockPost);
      store.updatePost();
      expect(mockXxxLoadingService.loadingOn).toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).toHaveBeenCalled();
    });

    it('should run XxxAlert.showError on error', () => {
      store.setPostForm(mockPost);
      const errorMessage: string = `Error. Unable to update post: ${mockPost.id}`;
      mockXxxPostData.updatePost.mockReturnValue(throwError(() => new Error('some error')));
      store.updatePost();
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('showPosts', () => {
    it('should call getPosts when posts are empty', () => {
      store.setSelectedUserId(userId);
      store.showPosts();
      expect(mockXxxPostData.getPosts).toHaveBeenCalled();
    });

    it('should not call getPosts when posts is not empty', () => {
      store.setSelectedUserId(userId);
      store.getPosts();
      mockXxxPostData.getPosts.mockClear();
      store.showPosts();
      expect(mockXxxPostData.getPosts).not.toHaveBeenCalled();
    });

    it('should call setSelectedUserId when userId is not the same from user ', () => {
      store.setSelectedUserId(0);
      store.showPosts();
      const result = store.selectedUserId();
      expect(result).toBe(mockPost.userId);
    });
  });
});
