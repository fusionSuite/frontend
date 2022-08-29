import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

import { IItem } from 'src/app/interfaces/item';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor (
    private http: HttpClient,
    private settingsService: SettingsService,
    private authService: AuthService,
  ) { }

  public login (username: string, password: string) {
    return this.http.post(this.settingsService.backendUrl + '/v1/token', {
      login: username,
      password,
    });
  }

  public organizationCreate (name: string, parentId: number) {
    const typeId = this.settingsService.typeId('organization');
    return this.http.post(this.settingsService.backendUrl + '/v1/items', {
      name,
      parent_id: parentId,
      type_id: typeId,
    }, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public organizationDelete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public organizationGet (id: number) {
    return this.http.get<IItem>(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public organizationList () {
    const typeId = this.settingsService.typeId('organization');
    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
