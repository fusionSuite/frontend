import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse, HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor (
    private authService: AuthService,
    protected http: HttpClient,
    private settingsService: SettingsService,
  ) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });
    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/signin') &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401Error (request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // Check if the token refreshed by another httpinterceptor instance
      const reqAuthorization = request.headers.get('Authorization');
      if (reqAuthorization !== 'Bearer ' + this.authService.getToken()) {
        request = request.clone({
          setHeaders: { Authorization: 'Bearer ' + this.authService.getToken() },
        });
        return next.handle(request);
      }
      // otherwise try refresh the token
      const refreshToken = this.authService.getRefreshToken();
      if (this.authService.getToken() !== '' && refreshToken !== '') {
        return this.http.post(this.settingsService.backendUrl + '/v1/refreshtoken', { token: this.authService.getToken(), refreshtoken: refreshToken }).pipe(
          switchMap((result: any) => {
            this.isRefreshing = false;
            this.authService.login(result.token);
            this.authService.storeRefreshToken(result.refreshtoken);

            request = request.clone({
              setHeaders: { Authorization: 'Bearer ' + this.authService.getToken() },
            });

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();

            return throwError(() => error);
          }),
        );
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
