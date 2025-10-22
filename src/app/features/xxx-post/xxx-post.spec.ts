import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { mockPost, mockPosts } from './xxx-post.mocks';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxPost } from './xxx-post';
import { XxxPostStore } from './xxx-post-store';
import { XxxPostType } from './xxx-post-types';

// Use extended class to test protected method.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContent,
  ],
  selector: 'extended-xxx-post',
  templateUrl: './xxx-post.html',
})
class ExtendedXxxPost extends XxxPost {
  override selectPost(post: XxxPostType) {
    super.selectPost(post);
  }
}

describe('XxxPost', () => {
  let component: ExtendedXxxPost;
  let fixture: ComponentFixture<ExtendedXxxPost>;

  const mockXxxContentStore = {
    contentByKey: jest.fn(),
  }

  const mockXxxPostStore = {
    isNoSelectedPost: signal(false),
    isNoSelectedUser: signal(false),
    isPostsEmpty: signal(false),
    isPostsLoaded: signal(false),
    isPostsLoading: signal(false),
    isSaveButtonDisabled: signal(false),
    posts: signal(mockPosts),
    selectedPost: signal(mockPost),
    selectedPostId: signal(mockPost.id),
    selectedUserId: signal(mockPost.userId),
    setPostForm: jest.fn(),
    setSelectedPostId: jest.fn(),
    showPosts: jest.fn(),
    updatePost: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedXxxPost],
      providers: [
        {provide: XxxContentStore, useValue: mockXxxContentStore},
        {provide: XxxPostStore, useValue: mockXxxPostStore}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ExtendedXxxPost);
    component = fixture.componentInstance;
  });

  describe('construction', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  });

  describe('selectPost', () => {
    it('should call postFacade.setSelectedPostId', () => {
      component.selectPost(mockPost);
      expect(mockXxxPostStore.setSelectedPostId).toHaveBeenCalledWith(mockPost.id);
    });
  });
});
