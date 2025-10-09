import { XxxPostType } from './xxx-post-types';

export const mockPost: XxxPostType = {
  body: 'mockBody',
  id: 1,
  title: 'mockTitle',
  userId: 1,
};

export const mockPost1: XxxPostType = {
  id: 1,
  userId: 1,
  title: 'mockTitle',
  body: 'mockBody',
};

export const mockPost2: XxxPostType = {
  id: 2,
  userId: 1,
  title: 'mockTitle2',
  body: 'mockBody2',
};

export const mockPost3: XxxPostType = {
  id: 1,
  userId: 1,
  title: 'mockTitle3',
  body: 'mockBody',
};

export const mockPosts: XxxPostType[] = [mockPost1, mockPost2];
