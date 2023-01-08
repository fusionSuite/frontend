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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITypepanel } from '../interfaces/typepanel';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})

export class TypepanelsApi {
  constructor (
    protected http: HttpClient,
    protected settingsService: SettingsService,
    protected authService: AuthService,
  ) { }

  public list (typeId: number) {
    return this.http.get<ITypepanel[]>(this.settingsService.backendUrl + '/v1/display/type/' + typeId + '/panel', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  // public get (id: number) {
  //   return this.http.get<IType>(this.settingsService.backendUrl + '/v1/config/types/' + id, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.authService.getToken(),
  //     },
  //   });
  // }

  public create (typeId: number, data: any) {
    return this.http.post(this.settingsService.backendUrl + '/v1/display/type/' + typeId + '/panel', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  // public delete (id: number) {
  //   return this.http.delete(this.settingsService.backendUrl + '/v1/config/types/' + id, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.authService.getToken(),
  //     },
  //   });
  // }
}
