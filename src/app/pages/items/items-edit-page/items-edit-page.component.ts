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
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { IItem } from 'src/app/interfaces/item';
import { ItemsApi } from 'src/app/api/items';
import { IType } from 'src/app/interfaces/type';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import { ICreateMessages } from 'src/app/interfaces/create/messages';
import { SettingsService } from 'src/app/services/settings.service';
import { TypesApi } from 'src/app/api/types';
import { TypepanelsApi } from 'src/app/api/typepanel';
import { ITypepanel } from 'src/app/interfaces/typepanel';
import { ITypepanelitem } from 'src/app/interfaces/typepanelitem';

@Component({
  selector: 'app-items-edit-page',
  templateUrl: './items-edit-page.component.html',
  styleUrls: [],
})
export class ItemsEditPageComponent implements OnInit {
  public id: number = 0;
  public item: IItem|null = null;
  public itemLoaded = false;
  public createdAt :string = '';
  public updatedAt :string = '';
  public panels: ITypepanel[] = [];
  public editionmode: boolean = false;
  public internalname: string = '';
  public type: IType|null = null;
  public timelineView: boolean = false;
  public timelineMessages: ICreateMessages = {
    messages: [],
    defaultNane: '',
  };

  public formControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public formPropertiesControls = new FormGroup({
    properties: new FormArray<FormControl>([]),
  });

  constructor (
    private itemsApi: ItemsApi,
    private typesApi: TypesApi,
    private typepanelsApi: TypepanelsApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    protected settingsService: SettingsService,
  ) {}

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.id = +id;
        this.loadItem();
      }
    });
  }

  public loadItem () {
    this.itemsApi.get(this.id)
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
        this.item = res;
        this.getDisplay();
        this.item.properties.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.udpateDateDistance();
        this.loopUdpateDateDistance();
        this.formControls.controls.name.setValue(res.name);
        for (const prop of res.properties) {
          const formProp = this.formPropertiesControls.controls.properties;
          formProp.push(new FormControl(prop.value));
        }
        this.setMessages();
        this.itemLoaded = true;
      });
  }

  public updateField (fieldName: string) {
    if (this.item !== null) {
      const control = this.formControls.get(fieldName);
      if (control !== null) {
        this.itemsApi.update(this.item.id, { [fieldName]: control.value })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            // Reset the form to its initial state
            this.loadItem();
            this.notificationsService.success($localize `The item has been updated successfully.`);
          });
      }
    }
  }

  // public updateProperty (index: number) {
  //   if (this.item !== null) {
  //     this.itemsApi.updateProperty(this.item?.id, this.item?.properties[index].id, { value: this.formPropertiesControls.controls.properties.at(index).value })
  //       .pipe(
  //         catchError((error: HttpErrorResponse) => {
  //           this.notificationsService.error(error.error.message);
  //           return throwError(() => new Error(error.error.message));
  //         }),
  //       ).subscribe((result: any) => {
  //         // Reset the form to its initial state
  //         this.loadItem();
  //         this.notificationsService.success($localize `The property has been updated successfully.`);
  //       });
  //   }
  // }
  public updateProperty (event: any, property: IItemproperty) {
    let value = event.target.value;
    if (this.item !== null) {
      if (['number', 'list'].includes(property.valuetype)) {
        value = parseInt(value);
      }
      this.itemsApi.updateProperty(this.item?.id, property.id, { value })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          // Reset the form to its initial state
          this.loadItem();
          this.notificationsService.success($localize `The property has been updated successfully.`);
        });
    }
  }

  public copyToClipboard (value: any) {
    if (value.value !== undefined) {
      navigator.clipboard.writeText(value.value);
    } else {
      navigator.clipboard.writeText(value);
    }
    this.notificationsService.success($localize `The value has been copied in clipboard successfully.`);
  }

  public groupProperties (items: ITypepanelitem[]) {
    const properties: number[] = [];
    for (const item of items) {
      properties.push(item.property_id);
    }

    if (this.item !== null) {
      return this.item.properties.filter((prop) => {
        return properties.includes(prop.id);
      });
    }
    return [];
  }

  /**
   * add the message in right
   *
   * @param event
   */
  public addMessage (event: any) {
    console.log(event);
    const message = this.timelineMessages.messages.find(obj => {
      return obj.name === event.name;
    });
    if (message !== undefined) {
      const typeId = this.settingsService.getTypeIdByInternalname(message.name);
      this.itemsApi.create(message.name, {
        name: 'test',
        type_id: typeId,
      })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The item has been created successfully.`);

          // add message in prop of this item
          // attach item to this itemlink(s)
        });
    }
  }

  private loopUdpateDateDistance () {
    setTimeout(() => {
      this.udpateDateDistance();
      this.loopUdpateDateDistance();
    }, 60000);
  }

  private udpateDateDistance () {
    if (this.item !== null) {
      this.createdAt = formatDistanceToNow(new Date(this.item.created_at), { addSuffix: true });
      if (this.item.updated_at !== null) {
        this.updatedAt = formatDistanceToNow(new Date(this.item.updated_at), { addSuffix: true });
      }
    }
  }

  private setMessages () {
    const typeId = this.settingsService.getTypeIdByInternalname('incidentmessage');
    if (typeId !== null) {
      this.typesApi.get(typeId)
        .subscribe(res => {
          this.timelineMessages.messages.push(
            {
              label: res.name,
              name: res.internalname,
              options: [
                {
                  label: 'Private message',
                  name: 'incidentmessageprivate',
                  type: 'checkbox',
                  selectValues: [],
                  selectDefault: '',
                  checkboxDefault: false,
                },
              ],
            },
          );
          this.timelineMessages.defaultNane = res.internalname;
        });
    }
  }

  private getDisplay () {
    if (this.item !== null) {
      this.typepanelsApi.list(this.item.type_id)
        .subscribe((res) => {
          this.panels = res;
          console.log(res);
          for (const panel of res) {
            if (panel.displaytype === 'timeline') {
              this.timelineView = true;
            }
          }
        });
    }
  }
}
