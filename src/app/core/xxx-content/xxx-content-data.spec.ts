import { firstValueFrom, Observable } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockContentHome } from './xxx-content.mocks';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { XxxContentApi } from './xxx-content-types';
import { XxxContentData } from './xxx-content-data';

describe('XxxContentData', () => {
  let service: XxxContentData;
  let httpTestingController: HttpTestingController;
  const key: string = 'content-key';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        XxxContentData
      ]
    });
    service = TestBed.inject(XxxContentData);
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

  describe('getContent', () => {
    it('should return a content item', async () => {
      const response$: Observable<XxxContentApi> = service.getContent('content-key');
      const resultPromise: Promise<XxxContentApi> = firstValueFrom(response$);
      const url = `/data/content/${key}.json`;
      const req = httpTestingController.expectOne(url, 'Request to get the content');
      // Assert the request URL
      expect(req.request.url).toBe(url);
      // Assert the request method
      expect(req.request.method).toBe('GET');
      // Flushing the request causes it to complete, delivering the result
      req.flush(mockContentHome);
      // Assert that the response was successful
      expect(await resultPromise).toEqual(mockContentHome);
    });
  });
});
