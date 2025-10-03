import { catchError, of } from 'rxjs';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { xxxPostInitialState, XxxPostState, XxxPostType } from './xxx-post-types';
import { XxxPostData } from './xxx-post-data'
import { XxxUserFacade } from '../xxx-user/xxx-user-facade';
import { isPostsEqual } from "./xxx-post-utilities";

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
  private userFacade: XxxUserFacade = inject(XxxUserFacade);

  // State
  private postState: WritableSignal<XxxPostState> = signal<XxxPostState>(xxxPostInitialState);

  // Actions
  private getPostsAction(): void {
    this.getPostsReducer();
    this.getPostsEffect();
  }

  private getPostsErrorAction(userId: number): void {
    this.getPostsErrorReducer();
    this.getPostsErrorEffect(userId);
  }

  private getPostsSuccessAction(posts: XxxPostType[]): void {
    this.getPostsSuccessReducer(posts);
    this.getPostsSuccessEffect();
  }

  setPostFormAction(post: XxxPostType): void {
    this.setPostFormReducer(post);
  }

  setSelectedPostIdAction(postId: number): void {
    this.setSelectedPostIdReducer(postId);
    this.setSelectedPostIdEffect();
  }

  setSelectedUserIdAction(userId: number): void {
    this.setSelectedUserIdReducer(userId);
    this.setSelectedUserIdEffect();
  }

  showPostsAction(): void {
    this.showPostsEffect();
  }

  updatePostAction(): void {
    this.updatePostEffect();
  }

  private updatePostErrorAction(postId: number): void {
    this.updatePostErrorReducer();
    this.updatePostErrorEffect(postId);
  }

  private updatePostSuccessAction(post: XxxPostType): void {
    this.updatePostSuccessReducer(post);
    this.updatePostSuccessEffect();
  }

  // Selectors
  readonly selectIsNoSelectedPost: Signal<boolean> = computed(() => this.postState().selectedPostId === undefined ||
    !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly selectIsPostsEmpty: Signal<boolean> = computed(() => !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly selectIsPostsLoaded: Signal<boolean> = computed(() => this.postState().posts.length > 0);

  readonly selectIsPostsLoading: Signal<boolean> = computed(() => this.postState().isPostsLoading);

  readonly selectSelectedPostId: Signal<number | undefined> = computed(() => this.postState().selectedPostId);

  readonly selectSelectedUserId: Signal<number | undefined> = computed(() => this.postState().selectedUserId);

  readonly selectIsNoSelectedUser: Signal<boolean> = computed(() => this.selectSelectedUserId() === undefined);

  private readonly selectPostForm: Signal<XxxPostType | undefined> = computed(() => this.postState().postForm);

  readonly selectPosts: Signal<XxxPostType[]> = computed(() => this.postState().posts);

  readonly selectSelectedPost: Signal<XxxPostType | undefined> = computed(() => {
    let post: XxxPostType | undefined;
    const posts: XxxPostType[] = this.selectPosts();
    const postId: number | undefined = this.selectSelectedPostId();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  readonly selectIsSaveButtonDisabled: Signal<boolean> = computed(() => {
    const postForm: XxxPostType | undefined = this.selectPostForm();
    const selectedPost: XxxPostType | undefined = this.selectSelectedPost();
    const isPostFormEqual: boolean = isPostsEqual(postForm, selectedPost);
    return (!this.selectIsPostsLoaded()) || (this.selectSelectedPost() === undefined) || (postForm === undefined) || isPostFormEqual;
  });

// Reducers
  private getPostsReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isLoading: true,
        Posts: []
      })
    );
  }

  private getPostsErrorReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    );
  }

  private getPostsSuccessReducer(posts: XxxPostType[]): void {
    this.postState.update(state =>
      ({
        ...state,
        isLoading: false,
        posts
      })
    );
  }

  private setSelectedPostIdReducer(postId: number): void {
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
  }

  private setPostFormReducer(post: XxxPostType): void {
    // Create a new object for immutability
    const postForm: XxxPostType = <XxxPostType>JSON.parse(JSON.stringify(post));
    this.postState.update(state =>
      ({
        ...state,
        postForm
      })
    );
  }

  private setSelectedUserIdReducer(userId: number) {
    // Use signal set instead of update when setting and not updating the state.
    this.postState.set(
      ({
        ...xxxPostInitialState,
        selectedUserId: userId,
      })
    );
  }

  private updatePostErrorReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    );
  }

  private updatePostSuccessReducer(post: XxxPostType): void {
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
  }

  // Effects
  private getPostsEffect(): void {
    const userId: number | undefined = this.userFacade.selectedUserId();
    if (userId === undefined) {
      return;
    }
    this.loadingService.loadingOn();
    let isError = false;
    this.postDataService.getPosts(userId).pipe(
      catchError(() => {
        isError = true;
        this.getPostsErrorAction(userId);
        return of([]);
      })
    ).subscribe((response: unknown) => {
      if (!isError) {
        const posts: XxxPostType[] = response as XxxPostType[];
        this.getPostsSuccessAction(posts);
      }
    })
  }

  private getPostsErrorEffect(userId: number): void {
    this.loadingService.loadingOff();
    this.alertService.showError('Error loading posts for user: ' + userId);
  }

  private getPostsSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private setSelectedPostIdEffect(): void {
    void this.router.navigateByUrl('/post/edit')
  }

  private setSelectedUserIdEffect() {
    this.getPostsAction()
  }

  // Logic to show user posts
  // 1. If there is no selected user, then do nothing
  // 2. If the selected user is different from the user id in the Post state,
  //    then set the user id in the Post state to the selected user id
  // 3. If posts are not loaded and the user id in the Post state is the same as the user id,
  //    then get the user posts
  private showPostsEffect(): void {
    const selectedUserId: number | undefined = this.userFacade.selectedUserId();
    const postSelectedUserId: number | undefined = this.selectSelectedUserId();
    if (selectedUserId !== undefined) {
      if (selectedUserId !== postSelectedUserId) {
        this.setSelectedUserIdAction(selectedUserId);
      } else if (!this.selectIsPostsLoaded()) {
        this.getPostsAction();
      }
    }
  }

  private updatePostEffect(): void {
    this.loadingService.loadingOn();
    const post: XxxPostType | undefined = this.selectPostForm();
    if (post === undefined) {
      //unexpected error, post should not be undefined
      this.updatePostErrorAction(0);
      return;
    } else {
      let isError: boolean = false;
      this.postDataService.updatePost(post).pipe(
        catchError(() => {
          isError = true;
          this.updatePostErrorAction(post.id);
          return of({});
        })
      ).subscribe((postResponse: XxxPostType | {}) => {
        if (!isError && Object.keys(postResponse).length > 0) {
          this.updatePostSuccessAction(postResponse as XxxPostType);
        }
      })
    }
  }

  private updatePostErrorEffect(postId: number): void {
    this.loadingService.loadingOff();
    this.alertService.showError('Error occurred. Unable to update post: ' + postId);
  }

  private updatePostSuccessEffect(): void {
    this.loadingService.loadingOff();
    this.alertService.showInfo('Successfully updated post');
    void this.router.navigateByUrl('/post')
  }
}
