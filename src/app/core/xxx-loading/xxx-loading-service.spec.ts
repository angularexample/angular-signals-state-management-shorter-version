import { TestBed } from '@angular/core/testing';
import { XxxLoadingService } from './xxx-loading-service';

describe('XxxLoadingService', () => {
  let service: XxxLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XxxLoadingService,
      ],
    });
    service = TestBed.inject(XxxLoadingService);
  })

  describe('construction', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });
  });


  describe('loadingOff', () => {
    it('should emit false', () => {
      service.loadingOff();
      const result: boolean = service.isLoading();
      expect(result).toBe(false);
    });
  });

  describe('loadingOn', () => {
    it('should emit true', () => {
      service.loadingOn();
      const result: boolean = service.isLoading();
      expect(result).toBe(true);
    });
  });
});
