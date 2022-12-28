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
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';

@Component({
  selector: 'app-types-list-page',
  templateUrl: './types-list-page.component.html',
  styleUrls: [],
})
export class TypesListPageComponent implements OnInit {
  public typesLoaded = false;
  public types: IType[] = [];
  public deleteForm = new FormGroup({});

  private typesByIds: {[index: number]: IType} = {};

  constructor (
    private typesApi: TypesApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.typesApi.list()
      .subscribe((result: IType[]) => {
        const types = result;
        this.types = types;
        this.typesByIds = this.indexTypes(this.types);
        this.typesLoaded = true;
      });
  }

  public deleteType (type: IType) {
    if (!window.confirm($localize `Do you really want to delete the type “${type.name}”?`)) {
      return;
    }
    this.typesApi.delete(type.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.typesByIds = this.indexTypes(this.types);

        this.notificationsService.success($localize `The type has been deleted successfully.`);
      });
  }

  private indexTypes (types: IType[]) {
    const propsByIds: {[index: number]: IType} = {};
    types.forEach((type) => {
      propsByIds[type.id] = type;
    });
    return propsByIds;
  }
}
