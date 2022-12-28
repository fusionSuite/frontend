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
import { FormStatus } from 'src/app/utils/form-status';
import { IType } from 'src/app/interfaces/type';
import { ICreateType } from 'src/app/interfaces/create/type';
import { IFormElement } from 'src/app/interfaces/form-element';
import { OrganizationsApi } from 'src/app/api/organizations';
import { IItem } from 'src/app/interfaces/item';

@Component({
  selector: 'app-types-create-page',
  templateUrl: './types-create-page.component.html',
  styleUrls: [],
})
export class TypesCreatePageComponent implements OnInit {
  public types: IType[] = [];
  public organizations: IItem[] = [];

  public newTypeForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    internalname: new FormControl(null, {
      nonNullable: false,
      validators: [],
    }),
    organization_id: new FormControl(0, {
      nonNullable: true,
      validators: [],
    }),
    sub_organization: new FormControl(false, {
      nonNullable: true,
      validators: [],
    }),
    tree: new FormControl(false, {
      nonNullable: true,
      validators: [],
    }),
    allowtreemultipleroots: new FormControl(false, {
      nonNullable: true,
      validators: [],
    }),
    unique_name: new FormControl(false, {
      nonNullable: true,
      validators: [],
    }),
  });

  public elementsForm: IFormElement[] = [
    {
      name: 'name',
      label: $localize `Type name`,
      type: 'input',
      nonNullable: true,
      required: true,
    },
    {
      name: 'internalname',
      label: $localize `Internal name`,
      type: 'input',
      nonNullable: false,
      required: false,
    },
    {
      name: 'organization_id',
      label: $localize `Organization`,
      type: 'select',
      nonNullable: true,
      required: false,
    },
    {
      name: 'sub_organization',
      label: $localize `Type available on sub organizations`,
      type: 'switch',
      nonNullable: true,
      required: false,
    },
    {
      name: 'tree',
      label: $localize `Tree type`,
      type: 'switch',
      nonNullable: true,
      required: false,
    },
    {
      name: 'allowtreemultipleroots',
      label: $localize `Allow to have multiple roots`,
      type: 'switch',
      nonNullable: true,
      required: false,
      dependency: {
        name: 'tree',
        value: true,
      },
    },
    {
      name: 'unique_name',
      label: $localize `Define the name of items unique`,
      type: 'switch',
      nonNullable: true,
      required: false,
    },
  ];

  private formSubmitted = false;
  private formStatus: FormStatus = 'Initial';

  constructor (
    private typesApi: TypesApi,
    private notificationsService: NotificationsService,
    private organizationsApi: OrganizationsApi,
  ) { }

  ngOnInit (): void {
    this.loadOrganizations();
  }

  public loadOrganizations () {
    this.organizationsApi.list()
      .subscribe((organizations: IItem[]) => {
        this.organizations = organizations;
        this.formControls.organization_id.setValue(organizations[0].id);
      });
  }

  onFormSubmit () {
    this.formSubmitted = true;

    if (this.newTypeForm.invalid) {
      return;
    }

    this.formStatus = 'Pending';

    const data: ICreateType = {
      name: this.formControls.name.value,
      organization_id: this.formControls.organization_id.value,
      sub_organization: this.formControls.sub_organization.value,
      tree: this.formControls.tree.value,
      allowtreemultipleroots: this.formControls.allowtreemultipleroots.value,
      unique_name: this.formControls.unique_name.value,
    };

    this.typesApi.create(data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formStatus = 'Initial';
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      )
      .subscribe((result: any) => {
        // Reset the form to its initial state
        this.formStatus = 'Initial';
        this.newTypeForm.reset();
        this.formSubmitted = false;
        this.notificationsService.success($localize `The type has been created successfully.`);
      });
  }

  get formControls () {
    return this.newTypeForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial' &&
      !this.elementIsInvalid
    );
  }

  public elementIsInvalid (formName: string) {
    const prop = this.newTypeForm.get(formName);
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
    const prop = this.newTypeForm.get(formName);
    if (prop === undefined || prop === null) {
      return false;
    } else {
      return prop.hasError('required');
    }
  }

  public resetToNull (formName: string) {
    const prop = this.newTypeForm.get(formName);
    if (prop !== null) {
      prop.setValue(null);
    }
  }

  public dependencyCheck (name: string, value: any) {
    const control = this.newTypeForm.get(name);
    if (control === null) {
      return false;
    } else if (control.value === value) {
      return true;
    }
    return false;
  }
}
