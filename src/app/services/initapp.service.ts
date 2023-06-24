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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { map, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IType } from 'src/app/interfaces/type';

import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from './settings.service';
import { IProperty } from '../interfaces/property';
import { MenusApi } from '../api/menus';
import { IMenu } from '../interfaces/menu';
import { MenucustomsApi } from '../api/menucustoms';
import { IMenucustom } from '../interfaces/menucustom';

interface Configuration {
  backendUrl: string;
}

@Injectable({
  providedIn: 'root',
})

export class InitappService {
  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private menusApi: MenusApi,
    private menucustomsApi: MenucustomsApi,
    public SettingsService: SettingsService,
  ) { }

  public async loadConfiguration () {
    await this.http.get<Configuration>('config.json')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            // The configuration file is optional, so it's safe to ignore (404)
            // error here.
            return of({});
          } else {
            return throwError(() => new Error(error.error.message));
          }
        }),
      ).pipe(map((configuration: Configuration | {}) => {
        // Merge the default configuration with the configuration from the server.
        this.SettingsService.configuration = {
          ...this.SettingsService.configuration,
          ...configuration,
        };
      }))
      .toPromise();

    if (this.authService.isLoggedIn()) {
      await this.loadTypes();
      await this.loadMenu();
      await this.loadMenuCustom();
    }
  }

  public loadTypes () {
    return this.http.get<IType[]>(this.SettingsService.configuration.backendUrl + '/v1/config/types', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = error.message;
          if (error.error.message) {
            errorMessage = error.error.message;
          }

          return throwError(() => new Error(errorMessage));
        }),
      ).pipe(map((types: IType[]) => {
        this.SettingsService.resetTypes();
        this.SettingsService.resetProperties();

        types.forEach((type: IType) => {
          this.SettingsService.setTypeIndex(type.internalname, type);

          type.properties.forEach((property: IProperty) => {
            this.SettingsService.setPropertyIndex(property.internalname, property);
          });
        });
      }))
      .toPromise();
  }

  public loadMenu () {
    return this.menusApi.list()
      .pipe(map((res: IMenu[]) => {
        this.authService.menu = [];
        for (const menu of res) {
          this.authService.menu.push(menu);
        }
      }))
      .toPromise();
  }

  public loadMenuCustom () {
    return this.menucustomsApi.list()
      .pipe(map((res: IMenucustom[]) => {
        for (const item of res) {
          this.authService.menucustom.push(item);
        }
      }))
      .toPromise();
  }
}
