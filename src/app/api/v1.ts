import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { IItem } from 'src/app/interfaces/item';

@Injectable()
export class ApiV1 {
  constructor (
    protected http: HttpClient,
    protected settingsService: SettingsService,
    protected authService: AuthService,
  ) { }

  public postToken (login: string, password: string) {
    return this.http.post(this.settingsService.backendUrl + '/v1/token', {
      login,
      password,
    });
  }

  protected listItems (typeInternalname: string) {
    const typeId = this.settingsService.getTypeIdByInternalname(typeInternalname);
    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  protected getItem (id: number) {
    return this.http.get<IItem>(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  protected postItem (typeInternalname: string, name: string, data: any) {
    data.type_id = this.settingsService.getTypeIdByInternalname(typeInternalname);
    data.name = name;

    return this.http.post(this.settingsService.backendUrl + '/v1/items', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  protected deleteItem (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  protected buildProperties (data: {[index: string]: any}) {
    const properties: {
      property_id: number;
      value: any;
    }[] = [];

    Object.entries(data).forEach(([propertyInternalname, propertyValue]) => {
      // Unknown properties and empty values are not returned.
      const propertyId = this.settingsService.getPropertyIdByInternalname(propertyInternalname);
      if (propertyId != null && propertyValue != null && propertyValue !== '') {
        properties.push({
          property_id: propertyId,
          value: propertyValue,
        });
      }
    });
    return properties;
  }
}
