import { catchError, of } from 'rxjs';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { isPostsEqual } from "./xxx-post-utilities";
import { Router } from '@angular/router';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { XxxPostData } from './xxx-post-data'
import { xxxPostInitialState, XxxPostState, XxxPostType } from './xxx-post-types';
import { XxxUserStore } from '../xxx-user/xxx-user-store';

/**
 * XxxPostStore is the feature state for the post page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx, then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxPostStore {
  private alertService: XxxAlert = inject(XxxAlert);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private postDataService: XxxPostData = inject(XxxPostData);
  private router: Router = inject(Router);
  private userStore: XxxUserStore = inject(XxxUserStore);

  // State
  private postState: WritableSignal<XxxPostState> = signal<XxxPostState>(xxxPostInitialState);

  // Actions
  // In this version the actions are all in one method.
  // The reducer part runs first to update the state.
  // Then the effect part runs the data service.
  // After the data service completes, the success or error reducer part runs, followed by the effect part.

  private getPosts(): void {
    const userId: number | undefined = this.selectedUserId() || 0;
    this.postState.update(state =>
      ({
        ...state,
        isPostsLoading: true,
        Posts: []
      })
    );
    this.loadingService.loadingOn();
    let isError = false;
    this.postDataService.getPosts(userId).pipe(
      catchError(() => {
        isError = true;
        this.postState.update(state =>
          ({
            ...state,
            isPostsLoading: false
          })
        );
        this.alertService.showError(`Error. Unable to get posts for user: ${userId}`);
        return of([]);
      })
    ).subscribe((response: unknown) => {
      if (!isError) {
        const posts: XxxPostType[] = response as XxxPostType[];
        this.postState.update(state =>
          ({
            ...state,
            isPostsLoading: false,
            posts
          })
        );
     }
      this.loadingService.loadingOff();
    })
  }

  setPostForm(post: XxxPostType): void {
    // Create a new object for immutability
    const postForm: XxxPostType = <XxxPostType>JSON.parse(JSON.stringify(post));
    this.postState.update(state =>
      ({
        ...state,
        postForm
      })
    );
  }

  setSelectedPostId(postId: number): void {
    // make sure the post exists
    if (this.postState().posts.some(item => item.id === postId)) {
      this.postState.update(state =>
        ({
          ...state,
          postForm: undefined,
          selectedPostId: postId
        })
      );
    }
    void this.router.navigateByUrl('/post/edit')
  }

  setSelectedUserId(userId: number): void {
    // Use signal set instead of update when setting and not updating the state.
    this.postState.set(
      ({
        ...xxxPostInitialState,
        selectedUserId: userId,
      })
    );
    this.getPosts()
  }

  showPosts(): void {
    const selectedUserId: number | undefined = this.userStore.selectedUserId();
    const postSelectedUserId: number | undefined = this.selectedUserId();
    if (selectedUserId !== undefined) {
      if (selectedUserId !== postSelectedUserId) {
        this.setSelectedUserId(selectedUserId);
      }
    }
  }

  updatePost(): void {
    this.loadingService.loadingOn();
    const post: XxxPostType | undefined = this.postForm();
    if (post === undefined) {
      //unexpected error, post should not be undefined
      this.postState.update(state =>
        ({
          ...state,
          isPostUpdating: false
        })
      );
      this.alertService.showError('Error. Unable to update post: 0');
      return;
    } else {
      let isError: boolean = false;
      this.postDataService.updatePost(post).pipe(
        catchError(() => {
          isError = true;
          this.postState.update(state =>
            ({
              ...state,
              isPostUpdating: false
            })
          );
          this.alertService.showError(`Error. Unable to update post: ${post.id}`);
          return of({});
        })
      ).subscribe((postResponse: XxxPostType | {}) => {
        if (!isError && Object.keys(postResponse).length > 0) {
          this.postState.update(state => {
              // remove the old post, add the new one, sort by id
              let posts = state.posts.filter(item => item.id !== post.id);
              const updatedPost: XxxPostType = {...post};
              posts.push(updatedPost);
              posts.sort((a: XxxPostType, b: XxxPostType) => a.id - b.id);
              return {
                ...state,
                isPostUpdating: false,
                posts
              };
            }
          );
          this.alertService.showInfo('Successfully updated post ' + post.id);
          void this.router.navigateByUrl('/post')
        }
        this.loadingService.loadingOff();
      })
    }
  }

  // Selectors
  // A selector is used to read any data from the state.
  // In a Signal-based state, it is a function that returns a signal.
  // By design, it is the only way to read the state.
  // This version does not use the prefix "select" in the name of the selector.

  readonly isNoSelectedPost: Signal<boolean> = computed(() => this.postState().selectedPostId === undefined ||
    !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly isPostsEmpty: Signal<boolean> = computed(() => !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly isPostsLoaded: Signal<boolean> = computed(() => this.postState().posts.length > 0);

  readonly isPostsLoading: Signal<boolean> = computed(() => this.postState().isPostsLoading);

  readonly selectedPostId: Signal<number | undefined> = computed(() => this.postState().selectedPostId);

  readonly selectedUserId: Signal<number | undefined> = computed(() => this.postState().selectedUserId);

  readonly isNoSelectedUser: Signal<boolean> = computed(() => this.selectedUserId() === undefined);

  private readonly postForm: Signal<XxxPostType | undefined> = computed(() => this.postState().postForm);

  readonly posts: Signal<XxxPostType[]> = computed(() => this.postState().posts);

  readonly selectedPost: Signal<XxxPostType | undefined> = computed(() => {
    let post: XxxPostType | undefined;
    const posts: XxxPostType[] = this.posts();
    const postId: number | undefined = this.selectedPostId();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  readonly isSaveButtonDisabled: Signal<boolean> = computed(() => {
    const postForm: XxxPostType | undefined = this.postForm();
    const selectedPost: XxxPostType | undefined = this.selectedPost();
    const isPostFormEqual: boolean = isPostsEqual(postForm, selectedPost);
    return (!this.isPostsLoaded()) || (this.selectedPost() === undefined) || (postForm === undefined) || isPostFormEqual;
  });
}
