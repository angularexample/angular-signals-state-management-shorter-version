import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { XxxSanitizePipe } from './xxx-sanitize-pipe';

describe('XxxSanitizePipe', () => {
  let sanitizePipe: XxxSanitizePipe;

  const mockDomSanitizer = {
    bypassSecurityTrustHtml: jest.fn().mockImplementation((value) => value)
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: DomSanitizer, useValue: mockDomSanitizer},
        XxxSanitizePipe
      ],
    });
    sanitizePipe = TestBed.inject(XxxSanitizePipe);
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('construction', () => {
    it('should be created', () => {
      expect(sanitizePipe).toBeDefined();
    });
  });

  describe('transform', () => {
    it('should be run sanitizer.bypassSecurityTrustHtml', () => {
      const mockHtml = '<div>some html</div>';
      sanitizePipe.transform(mockHtml);
      expect(mockDomSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(mockHtml);
    });

    it('should be handle undefined value', () => {
      const mockHtml = undefined;
      sanitizePipe.transform(mockHtml);
      expect(mockDomSanitizer.bypassSecurityTrustHtml).not.toHaveBeenCalled();
    });
  });
});
