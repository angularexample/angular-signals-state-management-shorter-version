import { inject, Injectable, Signal } from '@angular/core';
import { XxxPostStore } from './xxx-post-store';
import { XxxPostType } from './xxx-post-types';

@Injectable({
  providedIn: 'root'
})
export class XxxPostFacade {
  private postStore: XxxPostStore = inject(XxxPostStore);
  readonly isNoSelectedPost: Signal<boolean> = this.postStore.selectIsNoSelectedPost;
  readonly isNoSelectedUser: Signal<boolean> = this.postStore.selectIsNoSelectedUser;
  readonly isPostsEmpty: Signal<boolean> = this.postStore.selectIsPostsEmpty;
  readonly isPostsLoaded: Signal<boolean> = this.postStore.selectIsPostsLoaded;
  readonly isPostsLoading: Signal<boolean> = this.postStore.selectIsPostsLoading;
  readonly isSaveButtonDisabled: Signal<boolean> = this.postStore.selectIsSaveButtonDisabled;
  readonly posts: Signal<XxxPostType[]> = this.postStore.selectPosts;
  readonly selectedPost: Signal<XxxPostType | undefined> = this.postStore.selectSelectedPost;
  readonly selectedPostId: Signal<number | undefined> = this.postStore.selectSelectedPostId;
  readonly selectedUserId: Signal<number | undefined> = this.postStore.selectSelectedUserId;

  setSelectedPostId(postId: number): void {
    this.postStore.setSelectedPostIdAction(postId);
  }

  setPostForm(post: XxxPostType): void {
    this.postStore.setPostFormAction(post)
  }

  showPosts(): void {
    this.postStore.showPostsAction();
  }

  updatePost(): void {
    this.postStore.updatePostAction()
  }
}
