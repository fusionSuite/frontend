import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

interface Configuration {
  backendUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private configuration: Configuration = {
    backendUrl: '',
  };

  constructor(
    private http: HttpClient,
  ) { }

  public async loadConfiguration() {
    await this.http.get<Configuration>('config.json')
      .pipe(map((configuration: Configuration) => {
        this.configuration = configuration;
      }))
      .toPromise();
  }

  get backendUrl() {
    return this.configuration.backendUrl;
  }
}
