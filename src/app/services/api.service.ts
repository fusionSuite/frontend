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
    const typeId = this.settingsService.getTypeIdByInternalname('organization');
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
    const typeId = this.settingsService.getTypeIdByInternalname('organization');
    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public userCreate (name: string, firstname: string, lastname: string, organizationId: number) {
    const typeId = this.settingsService.getTypeIdByInternalname('users');

    const properties = [];
    if (firstname) {
      const firstnamePropertyId = this.settingsService.getPropertyIdByInternalname('userfirstname');
      properties.push({
        property_id: firstnamePropertyId,
        value: firstname,
      });
    }

    if (lastname) {
      const lastnamePropertyId = this.settingsService.getPropertyIdByInternalname('userlastname');
      properties.push({
        property_id: lastnamePropertyId,
        value: lastname,
      });
    }

    return this.http.post(this.settingsService.backendUrl + '/v1/items', {
      name,
      organization_id: organizationId,
      type_id: typeId,
      properties,
    }, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public userDelete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public userList () {
    const typeId = this.settingsService.getTypeIdByInternalname('users');
    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
