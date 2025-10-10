import { Observable, of } from 'rxjs';
import { HTTP_INTERCEPTORS, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { SKIP_LOADING, XxxLoadingInterceptor } from './xxx-loading-interceptor';
import { TestBed } from '@angular/core/testing';
import { XxxLoadingService } from './xxx-loading-service';

describe('XxxLoadingInterceptor', () => {
  let service: XxxLoadingInterceptor;
  const url: string = 'https://dummyjson.com/users';
  let req: HttpRequest<any>;

  const mockXxxLoadingService = {
    loadingOff: jest.fn(),
    loadingOn: jest.fn(),
  }
  const mockHandler = {
    handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => of(new HttpResponse(req))
  };

  const spyHandler = jest.spyOn(mockHandler, 'handle');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: XxxLoadingInterceptor,
          multi: true
        },
        XxxLoadingInterceptor,
        {provide: XxxLoadingService, useValue: mockXxxLoadingService}
      ],
    });
    service = TestBed.inject(XxxLoadingInterceptor);
    req = new HttpRequest('GET', url);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('construction', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });
  });

  describe('intercept', () => {
    it('should call XxxLoadingService.loadingOn', () => {
      service.intercept(req, mockHandler).subscribe();
      expect(mockXxxLoadingService.loadingOn).toHaveBeenCalled();
    });

    it('should call XxxLoadingService.loadingOff when complete', () => {
      service.intercept(req, mockHandler).subscribe(() => {
        expect(mockXxxLoadingService.loadingOff).toHaveBeenCalled();
      });
    });

    it('should call next handler', () => {
      service.intercept(req, mockHandler).subscribe();
      expect(spyHandler).toHaveBeenCalled();
    });

    it('should skip loading when context SKIP_LOADING is true', () => {
      req.context.set(SKIP_LOADING, true);
      service.intercept(req, mockHandler).subscribe(() => {
        expect(mockXxxLoadingService.loadingOff).not.toHaveBeenCalled();
      });
      expect(mockXxxLoadingService.loadingOn).not.toHaveBeenCalled();
    });
  });
});
