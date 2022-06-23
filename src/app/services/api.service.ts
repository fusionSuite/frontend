import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SettingsService } from 'src/app/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private settings: SettingsService,
  ) { }

  public login(username: String, password: String) {
    return this.http.post(this.settings.backendUrl + '/v1/token', {
      login: username,
      password: password,
    });
  }
}
