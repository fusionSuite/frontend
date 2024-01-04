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
import { FormStatus } from 'src/app/utils/form-status';
import { IProperty } from 'src/app/interfaces/property';
import { ICreateProperty } from 'src/app/interfaces/create/property';
import { IFormElement } from 'src/app/interfaces/form-element';

@Component({
  selector: 'app-properties-create-page',
  templateUrl: './properties-create-page.component.html',
  styleUrls: [],
})
export class PropertiesCreatePageComponent implements OnInit {
  properties: IProperty[] = [];

  newPropertyForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    internalname: new FormControl(null, {
      nonNullable: false,
      validators: [],
    }),
    valuetype: new FormControl<'string'|'integer'|'decimal'|'text'|'boolean'|'datetime'|'date'|
    'time'|'number'|'itemlink'|'itemlinks'|'typelink'|'typelinks'|
    'propertylink'|'list'|'password'|'passwordhash'>('string', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unit: new FormControl(null, {
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
  });

  public elementsForm: IFormElement[] = [
    {
      name: 'name',
      label: 'Property name',
      type: 'input',
      nonNullable: true,
      required: true,
    },
    {
      name: 'internalname',
      label: 'Internal name',
      type: 'input',
      nonNullable: false,
      required: false,
    },
    {
      name: 'valuetype',
      label: 'Type of value',
      type: 'select',
      nonNullable: true,
      required: true,
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'input',
      nonNullable: false,
      required: false,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'input',
      nonNullable: false,
      required: false,
    },
    {
      name: 'canbenull',
      label: 'Property can be null',
      type: 'switch',
      nonNullable: true,
      required: false,
    },
    {
      name: 'setcurrentdate',
      label: 'Define the current date as value',
      type: 'switch',
      nonNullable: false,
      required: false,
    },
    {
      name: 'default',
      label: 'Default value',
      type: 'input',
      nonNullable: false,
      required: false,
    },
  ];

  formSubmitted = false;
  formStatus: FormStatus = 'Initial';
  public types = {
    string: 'string',
    integer: 'integer',
    decimal: 'decimal',
    text: 'text',
    boolean: 'boolean',
    datetime: 'datetime',
    date: 'date',
    time: 'time',
    number: 'number',
    itemlink: 'itemlink',
    itemlinks: 'itemlinks',
    typelink: 'typelink',
    typelinks: 'typelinks',
    propertylink: 'propertylink',
    list: 'list',
    password: 'password',
    passwordhash: 'passwordhash',
  };

  constructor (
    private propertiesApi: PropertiesApi,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit (): void {
  }

  onFormSubmit () {
    this.formSubmitted = true;

    if (!this.canSubmit) {
      return;
    }

    this.formStatus = 'Pending';

    const data: ICreateProperty = {
      name: this.formControls.name.value,
      // internalname: this.formControls.internalname.value,
      valuetype: this.formControls.valuetype.value,
      unit: this.formControls.unit.value,
      description: this.formControls.description.value,
      canbenull: this.formControls.canbenull.value,
      setcurrentdate: this.formControls.setcurrentdate.value,
      regexformat: this.formControls.regexformat.value,
      listvalues: [],
      default: this.formControls.default.value,
      allowedtypes: [],
      // organization_id: 1,
      // sub_organization: true,
    };

    this.propertiesApi.create(
      data,
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.formStatus = 'Initial';
        this.notificationsService.error(error.error.message);
        return throwError(() => new Error(error.error.message));
      }),
    ).subscribe((result: any) => {
      // Reset the form to its initial state
      this.formStatus = 'Initial';
      this.newPropertyForm.reset();
      this.newPropertyForm.get('name')?.setValue('');
      this.newPropertyForm.get('internalname')?.setValue(null);
      this.newPropertyForm.get('valuetype')?.setValue('string');
      this.newPropertyForm.get('unit')?.setValue(null);
      this.newPropertyForm.get('description')?.setValue('');
      this.newPropertyForm.get('canbenull')?.setValue(true);
      this.newPropertyForm.get('setcurrentdate')?.setValue(false);
      this.newPropertyForm.get('regexformat')?.setValue('');
      this.newPropertyForm.get('default')?.setValue(null);
      this.formSubmitted = false;
      this.notificationsService.success($localize `The property has been created successfully.`);
    });
  }

  get formControls () {
    return this.newPropertyForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial'
      // &&
      // !this.elementIsInvalid
    );
  }

  public elementIsInvalid (formName: string) {
    const prop = this.newPropertyForm.get(formName);
    if (prop === undefined || prop === null) {
      return false;
    } else {
      return prop.invalid && (
        prop.touched ||
        this.formSubmitted
      );
    }
  }

  public elementHasError (formName: string, error: string) {
    const prop = this.newPropertyForm.get(formName);
    if (prop === undefined || prop === null) {
      return false;
    } else {
      return prop.hasError('required');
    }
  }

  public resetToNull (formName: string) {
    const prop = this.newPropertyForm.get(formName);
    if (prop !== null) {
      prop.setValue(null);
    }
  }
}
