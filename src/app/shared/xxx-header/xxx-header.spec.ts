import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxHeader } from './xxx-header';

describe('XxxHeader', () => {
  let fixture: ComponentFixture<XxxHeader>;
  let component: XxxHeader;
  const mockXxxContentStore = {
    contentByKey: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XxxHeader],
      providers: [
        {provide: XxxContentStore, useValue: mockXxxContentStore},
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(XxxHeader);
    component = fixture.componentInstance;
  });

  describe('construction', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  });
});
