import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  ) {
    this.loadConfiguration();
  }

  private async loadConfiguration() {
    await this.http.get<Configuration>('config.json')
      .subscribe((configuration: Configuration) => {
        this.configuration = configuration;
      });
  }

  get backendUrl() {
    return this.configuration.backendUrl;
  }
}
