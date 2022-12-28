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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';
import { ActivatedRoute } from '@angular/router';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { IPanel } from 'src/app/interfaces/panel';
import { IProperty } from 'src/app/interfaces/property';
import { PropertiesApi } from 'src/app/api/properties';

@Component({
  selector: 'app-types-edit-page',
  templateUrl: './types-edit-page.component.html',
  styleUrls: [],
})
export class TypesEditPageComponent implements OnInit {
  public id: number = 0;
  public type: IType|null = null;
  public typeLoaded = false;
  public createdAt :string = '';
  public updatedAt :string = '';
  public panels: IPanel[] = [];
  public editionmode: boolean = false;
  public deletePropertyForm = new FormGroup({});
  public properties: IProperty[] = [];
  public selectAddProperty: number = -1;
  public formControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor (
    private typesApi: TypesApi,
    private propertiesApi: PropertiesApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.id = +id;
        this.loadType();
      }
    });
  }

  public loadType () {
    this.typesApi.get(this.id)
      .subscribe(res => {
        for (const change of res.changes) {
          change.customdata = {
            user: {
              avatar: null,
              function: 'user',
            },
            icon: 'user',
            sourceMessage: null,
            dateDistance: formatDistanceToNowStrict(new Date(change.created_at), { addSuffix: true }),
            type: 'event',
            private: false,
            solution: false,
          };
        }
        this.type = res;
        this.udpateDateDistance();
        this.loopUdpateDateDistance();
        this.formControls.controls.name.setValue(res.name);

        this.typeLoaded = true;
        this.loadProperties();
      });
  }

  public loadProperties () {
    this.propertiesApi.list()
      .subscribe((properties: IProperty[]) => {
        const propertyIdsUsed: number[] = [];
        if (this.type !== null) {
          for (const prop of this.type.properties) {
            propertyIdsUsed.push(prop.id);
          }
        }
        this.properties = properties.filter((prop) => {
          return !propertyIdsUsed.includes(prop.id);
        });
        this.properties.sort((u1, u2) => u1.name.localeCompare(u2.name));
      });
  }

  public updateField (fieldName: string) {
    if (this.type !== null) {
      const control = this.formControls.get(fieldName);
      if (control !== null) {
        this.typesApi.update(this.type.id, { [fieldName]: control.value })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.loadType();
            this.notificationsService.success($localize `The type has been updated successfully.`);
          });
      }
    }
  }

  public addProperty (event: any) {
    const propertyId = event.target.value;
    if (propertyId !== undefined) {
      this.typesApi.associateProperty(this.id, propertyId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            this.selectAddProperty = -1;
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          // Reset the form to its initial state
          this.loadType();
          this.notificationsService.success($localize `The property has been associated successfully.`);
          this.loadProperties();
          this.selectAddProperty = -1;
        });
    }
  }

  public deleteProperty (property: IProperty) {
    this.typesApi.removeProperty(this.id, property.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        // Reset the form to its initial state
        this.loadType();
        this.notificationsService.success($localize `The property has been removed successfully.`);
        this.loadProperties();
      });
  }

  private loopUdpateDateDistance () {
    setTimeout(() => {
      this.udpateDateDistance();
      this.loopUdpateDateDistance();
    }, 60000);
  }

  private udpateDateDistance () {
    if (this.type !== null) {
      this.createdAt = formatDistanceToNow(new Date(this.type.created_at), { addSuffix: true });
      if (this.type.updated_at !== null) {
        this.updatedAt = formatDistanceToNow(new Date(this.type.updated_at), { addSuffix: true });
      }
    }
  }
}
