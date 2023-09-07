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
import { IWorkflowaction } from '../interfaces/workflowaction';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { Observable } from 'rxjs';
import { ICreateWorkflowaction } from '../interfaces/create/workflowaction';

@Injectable({
  providedIn: 'root',
})

export class WorkflowsactionApi {
  constructor (
    protected http: HttpClient,
    protected settingsService: SettingsService,
    protected authService: AuthService,
  ) { }

  public list (typeId: number): Observable<IWorkflowaction[]> {
    return this.http.get<IWorkflowaction[]>(this.settingsService.backendUrl + '/v1/workflows/action/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public get (id: number): Observable<IWorkflowaction> {
    return this.http.get<IWorkflowaction>(this.settingsService.backendUrl + '/v1/workflows/action/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public create (data: ICreateWorkflowaction) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/action', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public update (id: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/action/' + id, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public updateProperty (id: number, propertyId: number, value: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/action/' + id + '/property/' + propertyId, { value }, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public delete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/action/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public createConnection (sourceId: number, destinationId: number, success: boolean = true) {
    const payload = {
      success,
    };
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/action/' + sourceId + '/connection/' + destinationId, payload, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public deleteConnection (sourceId: number, destinationId: number, connectionType: string) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/action/' + sourceId + '/connection/' + connectionType + '/' + destinationId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public deleteDefinition (id: number, defId: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/action/' + id + '/definition/' + defId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public addGroup (id: number) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/action/' + id + '/group', {}, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public deleteGroup (id: number, groupId: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/action/' + id + '/group/' + groupId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public updateVariable (id: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/action/' + id + '/variable', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
