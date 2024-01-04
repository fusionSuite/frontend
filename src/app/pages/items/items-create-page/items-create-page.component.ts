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
import { FormStatus } from 'src/app/utils/form-status';
import { IProperty } from 'src/app/interfaces/property';
import { IFormElement } from 'src/app/interfaces/form-element';
import { ItemsApi } from 'src/app/api/items';
import { ActivatedRoute } from '@angular/router';
import { ICreateItem } from 'src/app/interfaces/create/item';
import { TypesApi } from 'src/app/api/types';
import { SettingsService } from 'src/app/services/settings.service';
import { IType } from 'src/app/interfaces/type';

@Component({
  selector: 'app-items-create-page',
  templateUrl: './items-create-page.component.html',
  styleUrls: [],
})
export class ItemsCreatePageComponent implements OnInit {
  public properties: IProperty[] = [];
  public internalname: string = '';
  public typeId: number|null = null;

  public newItemForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public elementsForm: IFormElement[] = [
    {
      name: 'name',
      label: 'Item name',
      type: 'input',
      nonNullable: true,
      required: true,
    },
  ];

  formSubmitted = false;
  formStatus: FormStatus = 'Initial';
  // public types = {
  //   string: 'string',
  //   integer: 'integer',
  //   decimal: 'decimal',
  //   text: 'text',
  //   boolean: 'boolean',
  //   datetime: 'datetime',
  //   date: 'date',
  //   time: 'time',
  //   number: 'number',
  //   itemlink: 'itemlink',
  //   itemlinks: 'itemlinks',
  //   typelink: 'typelink',
  //   typelinks: 'typelinks',
  //   propertylink: 'propertylink',
  //   list: 'list',
  //   password: 'password',
  //   passwordhash: 'passwordhash',
  // };

  constructor (
    private itemsApi: ItemsApi,
    private typesApi: TypesApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    protected settingsService: SettingsService,
  ) { }

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const internalname = params.get('internalname');
      if (internalname !== null) {
        this.internalname = internalname;
        this.typesApi.get(this.settingsService.getTypeIdByInternalname(internalname))
          .subscribe((type: IType) => {
            this.typeId = type.id;
          });
      }
    });
  }

  onFormSubmit () {
    this.formSubmitted = true;

    if (!this.canSubmit) {
      return;
    }
    if (this.typeId === null) {
      return;
    }

    this.formStatus = 'Pending';

    const data: ICreateItem = {
      name: this.formControls.name.value,
      type_id: this.typeId,
    };

    this.itemsApi.create(this.internalname, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formStatus = 'Initial';
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        // Reset the form to its initial state
        this.formStatus = 'Initial';
        this.newItemForm.reset();
        this.formSubmitted = false;
        this.notificationsService.success($localize `The item has been created successfully.`);
      });
  }

  get formControls () {
    return this.newItemForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial'
      // &&
      // !this.elementIsInvalid
    );
  }

  public elementIsInvalid (formName: string) {
    const item = this.newItemForm.get(formName);
    if (item === undefined || item === null) {
      return false;
    } else {
      return item.invalid && (
        item.touched ||
        this.formSubmitted
      );
    }
  }

  public elementHasError (formName: string, error: string) {
    const item = this.newItemForm.get(formName);
    if (item === undefined || item === null) {
      return false;
    } else {
      return item.hasError('required');
    }
  }

  public resetToNull (formName: string) {
    const item = this.newItemForm.get(formName);
    if (item !== null) {
      item.setValue(null);
    }
  }
}
