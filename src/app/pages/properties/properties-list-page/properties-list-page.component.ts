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

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { PropertiesApi } from 'src/app/api/properties';
import { IProperty } from 'src/app/interfaces/property';

@Component({
  selector: 'app-properties-list-page',
  templateUrl: './properties-list-page.component.html',
  styleUrls: [],
})
export class PropertiesListPageComponent implements OnInit {
  propertiesLoaded = false;
  properties: IProperty[] = [];
  propertiesByIds: {[index: number]: IProperty} = {};

  deleteForm = new FormGroup({});

  constructor (
    private propertiesApi: PropertiesApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.propertiesApi.list()
      .subscribe((result: IProperty[]) => {
        const properties = result;
        this.properties = properties;
        this.propertiesByIds = this.indexProperties(this.properties);
        this.propertiesLoaded = true;
      });
  }

  deleteProperty (property: IProperty) {
    if (!window.confirm($localize `Do you really want to delete the property “${property.name}”?`)) {
      return;
    }
    this.propertiesApi.delete(property.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.propertiesByIds = this.indexProperties(this.properties);

        this.notificationsService.success($localize `The property has been deleted successfully.`);
      });
  }

  indexProperties (properties: IProperty[]) {
    const propsByIds: {[index: number]: IProperty} = {};
    properties.forEach((property) => {
      propsByIds[property.id] = property;
    });
    return propsByIds;
  }
}
