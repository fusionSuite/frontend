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
import { IFormElement } from 'src/app/interfaces/form-element';
import { ItemsApi } from 'src/app/api/items';
import { ActivatedRoute } from '@angular/router';
import { ICreateItem } from 'src/app/interfaces/create/item';
import { TypesApi } from 'src/app/api/types';
import { SettingsService } from 'src/app/services/settings.service';
import { IType } from 'src/app/interfaces/type';
import { ITypepanel } from 'src/app/interfaces/typepanel';
import { TypepanelsApi } from 'src/app/api/typepanel';
import { IPanel } from 'src/app/interfaces/panel';
import { IFonticon } from 'src/app/interfaces/fonticon';
import { icons } from 'src/app/modal/iconchoice/iconlists';
import { ITypepanelitem } from 'src/app/interfaces/typepanelitem';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-create-page',
  templateUrl: './items-create-page.component.html',
  styleUrls: [],
})
export class ItemsCreatePageComponent implements OnInit {
  public properties: IItemproperty[] = [];
  public internalname: string = '';
  public typeId: number|null = null;
  public type: IType|null = null;
  public panels: ITypepanel[] = [];
  public icons: IFonticon[] = icons;

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

  private itemData: ICreateItem = {
    name: '',
    type_id: 0,
    properties: [],
  };

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
    private typepanelsApi: TypepanelsApi,
  ) { }

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const internalname = params.get('internalname');
      if (internalname !== null) {
        this.internalname = internalname;
        this.typesApi.get(this.settingsService.getTypeIdByInternalname(internalname))
          .subscribe((type: IType) => {
            this.typeId = type.id;
            this.type = type;
            this.itemData.type_id = type.id;

            // get panels
            this.typepanelsApi.list(this.typeId)
              .subscribe((res: any) => {
                this.panels = res.filter((panel: IPanel) => {
                  return panel.items.length > 0;
                });
                for (const panel of this.panels) {
                  panel.properties = this.groupProperties(panel.items);
                }
              });
          });
      };
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

  public parseIcon (icon: any) {
    if (icon === null) {
      return '';
    } else if (icon.includes('[')) {
      return JSON.parse(icon);
    } else {
      // search icon for label in list
      const myicon = this.icons.find(item => item.label === icon);
      if (myicon === undefined) {
        return '';
      }
      return myicon.name;
    }
  }

  // Get properties in the panel (+ in the property search if defined)
  public groupProperties (items: ITypepanelitem[]) {
    if (this.type !== null) {
      const properties: IItemproperty[] = [];
      items.sort((a, b) => a.position - b.position);
      for (const item of items) {
        const prop = this.type.properties.find((prop) => {
          return prop.id === item.property_id;
        });
        if (prop !== undefined) {
          properties.push({
            id: prop.id,
            name: prop.name,
            internalname: prop.internalname,
            valuetype: prop.valuetype,
            value: prop.default,
            unit: prop.unit,
            listvalues: prop.listvalues,
            default: prop.default,
            allowedtypes: prop.allowedtypes,
          });
        }
      }
      return properties;
    }
    return [];
  }

  public setName (ev: any) {
    this.itemData.name = ev.target.value;
  }

  public setPropertyValue (ev: any, property: IItemproperty) {
    this.itemData.properties?.push({
      property_id: property.id,
      value: ev,
    });
  }

  public createItem () {
    this.itemsApi.create(this.internalname, this.itemData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formStatus = 'Initial';
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        // Reset the form to its initial state
        this.notificationsService.success($localize `The item has been created successfully.`);
      });
  }
}
