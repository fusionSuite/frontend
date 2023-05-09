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
import { IWorkflowengine } from '../interfaces/workflowengine';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root',
})

export class WorkflowsengineApi {
  constructor (
    protected http: HttpClient,
    protected settingsService: SettingsService,
    protected authService: AuthService,
  ) { }

  public list (typeId: number) {
    return this.http.get<IWorkflowengine[]>(this.settingsService.backendUrl + '/v1/workflows/engine/type/' + typeId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public get (id: number) {
    return this.http.get<IWorkflowengine>(this.settingsService.backendUrl + '/v1/workflows/engine/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public create (data: any) {
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/engine', data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public update (id: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/workflows/engine/' + id, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public delete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/engine/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public createConnectionEngine (sourceId: number, destinationId: number, validate: boolean = true) {
    const payload = {
      validate,
    };
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/engine/' + sourceId + '/connection/engine/' + destinationId, payload, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public createConnectionAction (sourceId: number, destinationId: number, validate: boolean = true) {
    const payload = {
      validate,
    };
    return this.http.post(this.settingsService.backendUrl + '/v1/workflows/engine/' + sourceId + '/connection/action/' + destinationId, payload, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public deleteConnection (sourceId: number, destinationId: number, worlflowtype: 'engine'|'action') {
    return this.http.delete(this.settingsService.backendUrl + '/v1/workflows/engine/' + sourceId + '/connection/' + worlflowtype + '/' + destinationId, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
