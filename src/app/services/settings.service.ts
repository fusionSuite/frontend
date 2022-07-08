import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Configuration {
  backendUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private configuration: Configuration = {
    backendUrl: '/api',
  };

  constructor (
    private http: HttpClient,
  ) { }

  public async loadConfiguration () {
    await this.http.get<Configuration>('config.json')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            // The configuration file is optional, so it's safe to ignore (404)
            // error here.
            return of(null);
          } else {
            return throwError(() => new Error(error.error.message));
          }
        }),
      ).pipe(map((configuration: Configuration | null) => {
        if (configuration && configuration.backendUrl) {
          this.configuration = configuration;
        }
      }))
      .toPromise();
  }

  get backendUrl () {
    return this.configuration.backendUrl;
  }
}
