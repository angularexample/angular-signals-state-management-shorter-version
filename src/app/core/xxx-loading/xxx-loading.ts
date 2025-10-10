import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  TemplateRef
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgTemplateOutlet } from '@angular/common';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { XxxLoadingService } from './xxx-loading-service';

/**
 * This component can show and hide the loading spinner automatically when:
 * 1. router route transitions are detected - if the detectRouteTransitions input is true.
 * 2. http requests are made - if the interceptor is used.
 *
 * The loading indicator can be customized by adding a template inside the loading component.
 *   <xxx-loading>
 *     <ng-template #customLoadingIndicator>
 *       <div>
 *         My Loading Indicator...
 *       </div>
 *     </ng-template>
 *   </xxx-loading>>
 *
 * To show loading during router route transitions,
 * add the attribute to the loading element as in this example
 *   <xxx-loading [detectRouteTransitions]='true'></xxx-loading>
 *
 * The loading indicator will be shown only the first time the route uses lazy loading.
 *
 * To use the http interceptor, add this to the app module providers
 *   {
 *     provide: HTTP_INTERCEPTORS,
 *     useClass: XxxLoadingInterceptor,
 *     multi: true,
 *   }
 *
 * To turn off loading for certain http requests, set the context as in this example
 *   this.http.get('/api/courses', {
 *     context: new HttpContext().set(SKIP_LOADING, true)
 *   });
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinner,
    NgTemplateOutlet,
  ],
  selector: 'xxx-loading',
  styleUrl: './xxx-loading.scss',
  templateUrl: './xxx-loading.html',
})
export class XxxLoading implements OnInit {
  customLoadingIndicator: Signal<TemplateRef<unknown> | undefined> = contentChild('customLoadingIndicator');
  private destroyRef: DestroyRef = inject(DestroyRef);
  detectRouteTransitions: InputSignal<boolean> = input<boolean>(false);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  protected readonly isLoading: Signal<boolean> = this.loadingService.isLoading;
  private router: Router = inject(Router);

  ngOnInit(): void {
    if (this.detectRouteTransitions()) {
      this.router.events
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(
          (event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          }
        );
    }
  }
}
