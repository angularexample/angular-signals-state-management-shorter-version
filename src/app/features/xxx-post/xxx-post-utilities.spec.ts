import { isPostsEqual } from './xxx-post-utilities';
import { mockPost, mockPost1, mockPost2 } from './xxx-post.mocks';

describe('xxx-post-utilities', () => {
  describe('isPostsEqual', () => {
    it('should return true when post objects are equal', () => {
      expect(isPostsEqual(mockPost, mockPost1)).toBe(true);
    });

    it('should return false when post objects are not equal', () => {
      expect(isPostsEqual(mockPost1, mockPost2)).toBe(false);
    });

    it('should return false when one post object is undefined', () => {
      expect(isPostsEqual(mockPost1, undefined)).toBe(false);
    });
  });
});
