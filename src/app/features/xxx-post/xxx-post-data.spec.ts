import { firstValueFrom, Observable } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockPost, mockPosts } from './xxx-post.mocks';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { XxxPostData } from './xxx-post-data';
import { XxxPostType } from './xxx-post-types';

describe('XxxPostData', () => {
  let httpTestingController: HttpTestingController;
  const mockUserId: number = 1;
  let service: XxxPostData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        XxxPostData
      ]
    });
    service = TestBed.inject(XxxPostData);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding requests
  });

  describe('constructor phase', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getPosts', () => {
    it('should return an array of post items', async () => {
      const userId: number = 1;
      const response$: Observable<XxxPostType[]> = service.getPosts(mockUserId);
      const resultPromise: Promise<XxxPostType[]> = firstValueFrom(response$);
      const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
      const req = httpTestingController.expectOne(url, 'Request to get the posts');
      // Assert the request URL
      expect(req.request.url).toBe(url);
      // Assert the request method
      expect(req.request.method).toBe('GET');
      // Flushing the request causes it to complete, delivering the result
      req.flush(mockPosts);
      // Assert that the response was successful
      expect(await resultPromise).toEqual(mockPosts);
    });
  });

  describe('updatePost', () => {
    it('should return a the updated post items', async () => {
      const response$: Observable<XxxPostType> = service.updatePost(mockPost);
      const resultPromise: Promise<XxxPostType> = firstValueFrom(response$);
      const url = `https://jsonplaceholder.typicode.com/posts/${mockPost.id}`;
      const req = httpTestingController.expectOne(url, 'Request to update the post');
      // Assert the request URL
      expect(req.request.url).toBe(url);
      // Assert the request method
      expect(req.request.method).toBe('PUT');
      // Flushing the request causes it to complete, delivering the result
      req.flush(mockPost);
      // Assert that the response was successful
      expect(await resultPromise).toEqual(mockPost);
    });
  });
});
