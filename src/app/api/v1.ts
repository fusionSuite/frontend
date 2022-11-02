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
import { IItemResult } from '../interfaces/item-result';

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
    const type = this.settingsService.getTypeByInternalname(typeInternalname);
    return this.http.get<IItem[]>(this.settingsService.backendUrl + '/v1/items/type/' + type?.id, {
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

  public postItem (typeInternalname: string, name: string, data: any) {
    const type = this.settingsService.getTypeByInternalname(typeInternalname);
    data.type_id = type?.id;
    data.name = name;

    return this.http.post<IItemResult>(this.settingsService.backendUrl + '/v1/items', data, {
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
      const property = this.settingsService.getPropertyByInternalname(propertyInternalname);
      if (property != null && propertyValue != null && propertyValue !== '') {
        properties.push({
          property_id: property.id,
          value: propertyValue,
        });
      }
    });
    return properties;
  }

  public postTypelinkToItem (itemId: number, linkPropertyId: number, linkItemId: number) {
    return this.http.post(
      this.settingsService.backendUrl + '/v1/items/' + itemId + '/property/' + linkPropertyId + '/typelinks',
      { value: linkItemId },
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
        },
      },
    );
  }
}
