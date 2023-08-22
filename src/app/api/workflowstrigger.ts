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
import { IWorkflowtrigger } from '../interfaces/workflowtrigger';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { ICreateWorkflowtrigger } from '../interfaces/create/workflowtrigger';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class WorkflowstriggerApi {
  constructor (
    protected http: HttpClient,
    protected settingsService: SettingsService,
    protected authService: AuthService,
  ) { }

  public list (typeId: number): Observable<IWorkflowtrigger[]> {
    return this.http.get<IWorkflowtrigger[]>(this.settingsService.backendUrl + '/v1/workflows/trigger/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public get (id: number) {
    return this.http.get<IWorkflowtrigger>(this.settingsService.backendUrl + '/v1/workflows/trigger/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public create (data: ICreateWorkflowtrigger) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/trigger', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public update (id: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/trigger/' + id, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public delete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/trigger/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public updateProperty (id: number, propertyId: number, value: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/trigger/' + id + '/property/' + propertyId, { value }, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public createConnection (sourceId: number, destinationId: number) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/trigger/' + sourceId + '/connection/' + destinationId, {}, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public deleteConnection (sourceId: number, destinationId: number, connectionType: string) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/trigger/' + sourceId + '/connection/' + destinationId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public testTrigger (id: number) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/trigger/' + id + '/test', {}, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
