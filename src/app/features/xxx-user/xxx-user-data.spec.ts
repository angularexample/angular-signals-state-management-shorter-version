import { firstValueFrom, Observable } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockXxxUserApiResponse } from './xxx-user.mocks';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { XxxUserApiResponse } from './xxx-user-types';
import { XxxUserData } from './xxx-user-data';

describe('XxxUserData', () => {
  let service: XxxUserData;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        XxxUserData
      ]
    });
    service = TestBed.inject(XxxUserData);
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

  describe('getUsers', () => {
    it('should return an array of user items', async () => {
      const response$: Observable<XxxUserApiResponse> = service.getUsers();
      const resultPromise: Promise<XxxUserApiResponse> = firstValueFrom(response$);
      const url = 'https://dummyjson.com/users/?delay=1000'
      const req = httpTestingController.expectOne(url, 'Request to get the users');
      // Assert the request URL
      expect(req.request.url).toBe(url);
      // Assert the request method
      expect(req.request.method).toBe('GET');
      // Flushing the request causes it to complete, delivering the result
      req.flush(mockXxxUserApiResponse);
      // Assert that the response was successful
      expect(await resultPromise).toEqual(mockXxxUserApiResponse);
    });
  });
});
