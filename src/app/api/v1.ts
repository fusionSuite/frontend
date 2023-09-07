/**
 * FusionSuite - Frontend
 * Copyright (C) 2022 FusionSuite
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  public postRefreshToken (refreshtoken: string) {
    return this.http.post(this.settingsService.backendUrl + '/v1/token', {
      refreshtoken,
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

  protected listItemsWithHeaders (typeInternalname: string, suffix: string) {
    const typeId = this.settingsService.getTypeIdByInternalname(typeInternalname);
    if (suffix !== '') {
      suffix = '?' + suffix;
    }

    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + typeId + suffix, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
      observe: 'response',
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
