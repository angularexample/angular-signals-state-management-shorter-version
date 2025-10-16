import { App } from './app';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { XxxHeader } from './shared/xxx-header/xxx-header';
import { XxxLoading } from './core/xxx-loading/xxx-loading';

// Mock the child components
@Component({
  selector: 'xxx-header', // Same selector as the real child component
  template: ''
})
class MockXxxHeader {
}

@Component({
  selector: 'xxx-loading', // Same selector as the real child component
  template: ''
})
class MockXxxLoading {
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideZonelessChangeDetection()
      ]
    }).overrideComponent(App, {
      remove: {
        imports: [
          XxxHeader,
          XxxLoading
        ]
      },
      add: {
        imports: [
          MockXxxHeader,
          MockXxxLoading
        ]
      }
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });
});
