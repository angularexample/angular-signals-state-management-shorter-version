import { mockContentApiEmpty, mockContentApiHome, mockContentHome } from './xxx-content.mocks';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XxxAlert } from '../xxx-alert/xxx-alert';
import { XxxContentData } from './xxx-content-data';
import { XxxContentStore } from './xxx-content-store';
import { XxxContentType } from './xxx-content-types';

describe('XxxContentStore', () => {
  let service: XxxContentStore;
  let contentKey: string;

  const mockXxxContentData = {
    getContent: jest.fn()
  }

  const mockXxxAlert = {
    showError: jest.fn(),
    showInfo: jest.fn(),
    showWarning: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {provide: XxxAlert, useValue: mockXxxAlert},
        {provide: XxxContentData, useValue: mockXxxContentData},
        XxxContentStore
      ],
    });
    service = TestBed.inject(XxxContentStore);
    contentKey = 'home';
    mockXxxContentData.getContent.mockReturnValue(of(mockContentApiHome));
  });

  afterEach(() => {
    mockXxxAlert.showError.mockClear();
    mockXxxContentData.getContent.mockClear();
  })

  describe('constructor phase', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should have showContent', () => {
      expect(service.showContent).toBeDefined();
    });

    it('should have contentByKey', () => {
      expect(service.contentByKey).toBeDefined();
    });

    it('should have isContentEmpty', () => {
      expect(service.isContentEmpty).toBeDefined();
    });

    it('should have isContentError', () => {
      expect(service.isContentError).toBeDefined();
    });
  })

  describe('contentByKey', () => {
    it('should return expected content by key', () => {
      service.showContent(contentKey);
      const result: Signal<XxxContentType | undefined> = service.contentByKey(contentKey);
      expect(result()).toEqual(mockContentHome);
    });
  });

  describe('isContentEmpty', () => {
    it('should return true when content is empty', () => {
      contentKey = 'empty';
      mockXxxContentData.getContent.mockReturnValue(of(mockContentApiEmpty));
      service.showContent(contentKey);
      const result: Signal<boolean> = service.isContentEmpty(contentKey);
      expect(result()).toBe(true);
    });

    it('should return false when content is not empty', () => {
      service.showContent(contentKey);
      const result: Signal<boolean> = service.isContentEmpty(contentKey);
      expect(result()).toBe(false);
    });

    it('should return false when content is not found', () => {
      service.showContent(contentKey);
      contentKey = 'none';
      const result: Signal<boolean> = service.isContentEmpty(contentKey);
      expect(result()).toBe(false);
    });
  });

  describe('isContentError', () => {
    it('should return true when content has error', () => {
      mockXxxContentData.getContent.mockReturnValue(throwError(() => new Error('some error')));
      service.showContent(contentKey);
      const result: Signal<boolean> = service.isContentError(contentKey);
      expect(result()).toBe(true);
    });

    it('should return false when content does not have error', () => {
      service.showContent(contentKey);
      const result: Signal<boolean> = service.isContentError(contentKey);
      expect(result()).toBe(false);
    });

    it('should return false when content is not found', () => {
      service.showContent(contentKey);
      contentKey = 'none';
      const result: Signal<boolean> = service.isContentError(contentKey);
      expect(result()).toBe(false);
    });
  });

  describe('showContent', () => {
    it('should handle success', () => {
      service.showContent(contentKey);
      expect(mockXxxContentData.getContent).toHaveBeenCalledWith(contentKey);
    });

    it('should handle error', () => {
      const errorMessage: string = `Error. Unable to get content for: ${contentKey}`;
      mockXxxContentData.getContent.mockReturnValue(throwError(() => new Error('some error')));
      service.showContent(contentKey);
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle case where content is loaded', () => {
      service.showContent(contentKey);
      mockXxxContentData.getContent.mockClear();
      service.showContent(contentKey);
      expect(mockXxxContentData.getContent).not.toHaveBeenCalled();
    });
  })
});
