import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RateLimitService } from '../../services/rate-limit/rate-limit.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private rateLimitService: RateLimitService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 429) {
          this.rateLimitService.setRateLimitData(true, error.error.cooldownTime);
        }
        return throwError(error);
      }));
  }
}
