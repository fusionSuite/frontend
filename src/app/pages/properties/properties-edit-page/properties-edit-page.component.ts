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
import { PropertiesApi } from 'src/app/api/properties';
import { IProperty } from 'src/app/interfaces/property';
import { ActivatedRoute } from '@angular/router';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { IPanel } from 'src/app/interfaces/panel';
import { SettingsService } from 'src/app/services/settings.service';
import { IType } from 'src/app/interfaces/type';

@Component({
  selector: 'app-properties-edit-page',
  templateUrl: './properties-edit-page.component.html',
  styleUrls: [],
})
export class PropertiesEditPageComponent implements OnInit {
  public id: number = 0;
  public property: IProperty|null = null;
  public propertyLoaded = false;
  public createdAt :string = '';
  public updatedAt :string = '';
  public panels: IPanel[] = [];
  public editionmode: boolean = false;
  public types: IType[] = [];
  public formControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unit: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    description: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    canbenull: new FormControl(true, {
      nonNullable: true,
      validators: [],
    }),
    setcurrentdate: new FormControl(false, {
      nonNullable: false,
      validators: [],
    }),
    regexformat: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    default: new FormControl(null, {
      nonNullable: false,
      validators: [],
    }),
    allowedtypes: new FormControl(<number[]>[], {
      nonNullable: true,
      validators: [],
    }),
  });

  constructor (
    private propertiesApi: PropertiesApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
  ) {}

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.id = +id;
        this.loadProperty();
        this.types = this.settingsService.getAllTypes();
      }
    });
  }

  public loadProperty () {
    this.propertiesApi.get(this.id)
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
            message: '',
          };
        }
        this.property = res;
        this.udpateDateDistance();
        this.loopUdpateDateDistance();
        this.formControls.controls.name.setValue(res.name);
        this.formControls.controls.unit.setValue(res.unit);
        this.formControls.controls.description.setValue(res.description);
        this.formControls.controls.canbenull.setValue(res.canbenull);
        this.formControls.controls.setcurrentdate.setValue(res.setcurrentdate);
        this.formControls.controls.regexformat.setValue(res.regexformat);
        this.formControls.controls.default.setValue(res.default);
        const allowedtypesIds = res.allowedtypes.map(({ id }) => id);
        this.formControls.controls.allowedtypes.setValue(allowedtypesIds);

        this.propertyLoaded = true;
      });
  }

  public updateField (fieldName: string) {
    if (this.property !== null) {
      const control = this.formControls.get(fieldName);
      if (control !== null) {
        this.propertiesApi.update(this.property.id, { [fieldName]: control.value })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.loadProperty();
            this.notificationsService.success($localize `The property has been updated successfully.`);
          });
      }
    }
  }

  private loopUdpateDateDistance () {
    setTimeout(() => {
      this.udpateDateDistance();
      this.loopUdpateDateDistance();
    }, 60000);
  }

  private udpateDateDistance () {
    if (this.property !== null) {
      this.createdAt = formatDistanceToNow(new Date(this.property.created_at), { addSuffix: true });
      if (this.property.updated_at !== null) {
        this.updatedAt = formatDistanceToNow(new Date(this.property.updated_at), { addSuffix: true });
      }
    }
  }
}
