import { finalize, Observable } from 'rxjs';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { XxxLoadingService } from './xxx-loading-service';

export const SkipLoading =
  new HttpContextToken<boolean>(() => false);

/**
 * This interceptor shows and hides the loading indicator automatically when http requests are made.
 * If you want to turn off loading for certain http requests, set the context as in this example
 *   this.http.get('/api/courses', {
 *     context: new HttpContext().set(SkipLoading, true)
 *   });
 */
@Injectable()
export class XxxLoadingInterceptor
  implements HttpInterceptor {
  private loadingService: XxxLoadingService = inject(XxxLoadingService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check for a context attribute to not show the loading indicator
    if (req.context.get(SkipLoading)) {
      // Pass the request directly to the next handler
      return next.handle(req);
    }
    this.loadingService.loadingOn();
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.loadingOff();
      })
    );
  }
}
