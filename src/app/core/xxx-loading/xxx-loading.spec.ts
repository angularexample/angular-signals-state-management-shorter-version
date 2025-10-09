import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Route, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { XxxLoading } from './xxx-loading';
import { XxxLoadingService } from './xxx-loading-service';

// To test the router events, use a mock component.
@Component({
  selector: 'xxx-dummy',
  template: ``,
})
class XxxDummyComponent {
}

// To test the input, use a mock host component.
@Component({
  imports: [XxxLoading],
  template: '<xxx-loading [detectRouteTransitions]="detectRouteTransitions"></xxx-loading>'
})
class HostComponent {
  detectRouteTransitions = true;
}

describe('XxxLoading', () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let hostComponent: HostComponent;
  let component: XxxLoading;

  const mockRoute: Route =
    {
      path: '**',
      component: XxxDummyComponent
    };

  const mockXxxLoadingService = {
    isLoading: jest.fn().mockReturnValue(signal(false)),
    loadingOff: jest.fn(),
    loadingOn: jest.fn(),
  }

  const routerEventsSubject: Subject<any> = new Subject<any>()

  const mockRouter = {
    events: routerEventsSubject.asObservable(),
    navigateByUrl: jest.fn(),
    resetConfig: jest.fn(),
    setConfig: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, MatProgressSpinner,
      ],
      providers: [
        {provide: XxxLoadingService, useValue: mockXxxLoadingService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  });

  function createComponent() {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComponent = hostFixture.componentInstance;
    // Get the instance of the component under test as a child of the host component.
    component = hostFixture.debugElement.children[0].componentInstance;
  }

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('construction', () => {
    it('should create the component', () => {
      createComponent();
      expect(component).toBeDefined();
    });
  });

  // Input is evaluated on init so async and await are needed.
  describe('detectRouteTransitions', () => {
    it('should call loadingOn when input is true and RouteConfigLoadStart event', async () => {
      createComponent();
      hostComponent.detectRouteTransitions = true;
      await hostFixture.whenStable();
      routerEventsSubject.next(new RouteConfigLoadStart(mockRoute));
      expect(mockXxxLoadingService.loadingOn).toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).not.toHaveBeenCalled();
    });

    it('should call loadingOff when input is true and RouteConfigLoadEnd event', async () => {
      createComponent();
      hostComponent.detectRouteTransitions = true;
      await hostFixture.whenStable();
      routerEventsSubject.next(new RouteConfigLoadEnd(mockRoute));
      expect(mockXxxLoadingService.loadingOn).not.toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).toHaveBeenCalled();
    });

    it('should not call loadingOn or loadingOff when input is false and RouteConfigLoadStart event', async () => {
      createComponent();
      hostComponent.detectRouteTransitions = false;
      await hostFixture.whenStable();
      routerEventsSubject.next(new RouteConfigLoadStart(mockRoute));
      expect(mockXxxLoadingService.loadingOn).not.toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).not.toHaveBeenCalled();
    });

    it('should not call loadingOn or loadingOff when input is false and RouteConfigLoadEnd event', async () => {
      createComponent();
      hostComponent.detectRouteTransitions = false;
      await hostFixture.whenStable();
      routerEventsSubject.next(new RouteConfigLoadEnd(mockRoute));
      expect(mockXxxLoadingService.loadingOn).not.toHaveBeenCalled();
      expect(mockXxxLoadingService.loadingOff).not.toHaveBeenCalled();
    });
  });

  describe('customLoadingIndicator', () => {
    it('should customLoadingIndicator be undefined when it does not exist in the host template', () => {
      createComponent();
      expect(component.customLoadingIndicator()).toBeUndefined();
    });

    it('should loadingIndicator be defined when it exists in the host template', () => {
      TestBed.overrideComponent(HostComponent, {
        set: {
          template: '<xxx-loading>\n' +
            '  <ng-template #customLoadingIndicator>\n' +
            '    <div>\n' +
            '      My Loading Indicator...\n' +
            '    </div>\n' +
            '  </ng-template>\n' +
            '</xxx-loading>\n',
        },
      });
      createComponent();
      expect(component.customLoadingIndicator()).toBeDefined();
    });
  });
});
