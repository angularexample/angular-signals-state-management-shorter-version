import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';
import { XxxPostStore } from './xxx-post-store';
import { XxxPostType } from './xxx-post-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContent,
  ],
  selector: 'xxx-post',
  templateUrl: './xxx-post.html',
})
export class XxxPost {
  protected readonly contentKey: string = 'post';
  private contentStore: XxxContentStore = inject(XxxContentStore);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentStore.contentByKey(this.contentKey);
  private postStore: XxxPostStore = inject(XxxPostStore);
  protected readonly isNoSelectedUser: Signal<boolean> = this.postStore.isNoSelectedUser;
  protected readonly isPostsEmpty: Signal<boolean> = this.postStore.isPostsEmpty;
  protected readonly isPostsLoaded: Signal<boolean> = this.postStore.isPostsLoaded;
  protected readonly isPostsLoading: Signal<boolean> = this.postStore.isPostsLoading;
  protected readonly posts: Signal<XxxPostType[]> = this.postStore.posts;
  protected readonly selectedPostId: Signal<number | undefined> = this.postStore.selectedPostId;
  protected readonly selectedUserId: Signal<number | undefined> = this.postStore.selectedUserId;

  constructor() {
    this.postStore.showPosts();
  }

  protected selectPost(post: XxxPostType): void {
    this.postStore.setSelectedPostId(post.id);
  }
}
