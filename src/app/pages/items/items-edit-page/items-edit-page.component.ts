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

import { lastValueFrom, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

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
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-items-edit-page',
  templateUrl: './items-edit-page.component.html',
  styleUrls: [],
})
export class ItemsEditPageComponent implements OnInit {
  public id: number = 0;
  public item: IItem|null = null;
  public selectItems: any = {};
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

  public displayActionsProperty: {[key: number]: boolean} = {};

  public formControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public formPropertiesControls = new FormGroup({});

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
            message: '',
          };
        }
        this.item = res;
        this.getDisplay();
        this.item.properties.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.udpateDateDistance();
        this.loopUdpateDateDistance();
        this.formControls.controls.name.setValue(res.name);
        const formProp: {[key: string]: any} = {};
        for (const prop of res.properties) {
          this.displayActionsProperty[prop.id] = false;
          // formProp.push(new FormControl(prop.value));
          // if (prop.valuetype === 'itemlink') {
          //   // get the data
          //   this.getItemsOfPropertyItemlink(prop)
          //     .then((res) => {
          //       prop.listvalues = res;
          //     });
          // }
          // try with new code:
          if (['itemlink', 'itemlinks'].includes(prop.valuetype)) {
            for (const shortItem of prop.allowedtypes) {
              this.getItemsForType(shortItem.internalname);
            }
            formProp['prop' + prop.id.toString()] = new FormControl(prop.value);
            if (prop.valuetype === 'itemlinks' && prop.value !== null) {
              const listIds = [];
              for (const itemOfValue of prop.value) {
                listIds.push(itemOfValue.id);
              }
              formProp['prop' + prop.id.toString()] = new FormControl(listIds);
            }
            if (prop.valuetype === 'itemlink' && prop.value !== null) {
              formProp['prop' + prop.id.toString()] = new FormControl(prop.value.id);
            }
          } else if (prop.valuetype === 'list') {
            if (prop.value !== null && prop.value.id !== undefined) {
              formProp['prop' + prop.id.toString()] = new FormControl(prop.value.id);
            } else {
              formProp['prop' + prop.id.toString()] = new FormControl(prop.value);
            }
          } else {
            formProp['prop' + prop.id.toString()] = new FormControl(prop.value);
          }
        }
        this.formPropertiesControls = new FormGroup(formProp);
        this.typesApi.get(res.type_id)
          .subscribe((resType) => {
            this.type = resType;
          });
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
    console.log(event);
    let value: any = '';
    if (['number', 'list', 'itemlink'].includes(property.valuetype)) {
      value = event.id;
    } else if (property.valuetype === 'itemlinks') {
      value = event;
    } else {
      value = event.target.value;
    }
    if (this.item !== null) {
      if (property.valuetype === 'boolean') {
        if (value === 'on') {
          value = true;
        } else {
          value = false;
        }
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

  public updatePropertyItemlinks (event: IItem[], property: IItemproperty) {
    const listIds = event.map(({ id }) => id);
    this.updateProperty(listIds, property);
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
    // Object { message: "yolo le message", name: "incidentmessage", options: [] }
    const message = this.timelineMessages.messages.find(obj => {
      return obj.name === event.name;
    });
    if (message !== undefined && this.type !== null && this.item !== null) {
      const typeId = this.settingsService.getTypeIdByInternalname(message.name);
      this.itemsApi.create(message.name, {
        name: this.type.name + '-' + this.item.id,
        type_id: typeId,
      })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The item has been created successfully.`);
          for (const panel of this.panels) {
            if (panel.displaytype === 'timeline') {
              console.log(message);
              for (const item of panel.items) {
                console.log(item);
                if (message.property_id === item.property_id && item.timeline_message !== null) {
                  const dataProp = {
                    value: event.message,
                  };
                  // add message in prop of this item
                  this.itemsApi.updateProperty(result.id, item.timeline_message, dataProp)
                    .subscribe(resProp => {
                      console.log(resProp);
                    });
                  // add item created to itemlink(s) property of this item
                  this.itemsApi.createItemlink(this.id, item.property_id, result.id)
                    .subscribe(resPropMess => {
                      console.log(resPropMess);
                      this.loadItem();
                    });
                  return;
                }
              }
            }
          }
        });
    }
  }

  public parseIcon (icon: any) {
    if (icon === null) {
      return null;
    } else if (icon.includes('[')) {
      return JSON.parse(icon);
    } else {
      return icon;
    }
  }

  public standardPanels () {
    return this.panels.filter((panel) => {
      return panel.displaytype === 'default' && panel.items.length > 0;
    });
  }

  // public async getItemsOfPropertyItemlink (prop: any) {
  //   // get type have same internalname than property
  //   // const request = this.typesApi.get(this.settingsService.getTypeIdByInternalname(prop.internalname)).pipe(take(1));
  //   // const type = await lastValueFrom<any>(request);
  //   // get all items of this type
  //   const listvalues: {
  //     id: number;
  //     value: string|number;
  //   }[] = [];
  //   const request = this.itemsApi.list(prop.internalname).pipe();
  //   const items = await lastValueFrom<any>(request);
  //   items.forEach((item: IItem) => {
  //     listvalues.push({
  //       id: item.id,
  //       value: item.name,
  //     });
  //   });
  //   return listvalues;
  // }

  public getItemsOfSelect (property: IItemproperty) {
    let items: IItem[] = [];
    for (const shortItem of property.allowedtypes) {
      if (shortItem.internalname in this.selectItems) {
        items = items.concat(this.selectItems[shortItem.internalname]);
      }
    }
    return items;
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

  /**
   * Set messages to pass to the timelime
   * @returns
   */
  private setMessages () {
    // get the panel with type timeline
    let newValue: string = '';
    for (const panel of this.panels) {
      if (panel.displaytype === 'timeline') {
        for (const item of panel.items) {
          // get property
          const property = this.item?.properties.find(obj => {
            return obj.id === item.property_id;
          });
          if (property !== undefined) {
            // add message
            this.timelineMessages.messages.push(
              {
                label: property.name,
                name: 'incidentmessage', // in listvalue
                property_id: property.id,
                options: [],
              },
            );
            this.timelineMessages.defaultNane = 'incidentmessage';
            if (this.item === null) {
              continue;
            }
            // get values and put in changes for display
            for (const val of property.value) {
              if (val === null) {
                continue;
              }
              // convert new_value to json string
              newValue = JSON.stringify({ id: val.id, name: val.name });
              const message = val.properties.find((obj: IItemproperty) => {
                return obj.id === item.timeline_message;
              });
              const functions = ['user', 'tech'];
              for (const change of this.item.changes) {
                if (change.new_value === newValue) {
                  const randomNumber = Math.floor(Math.random() * functions.length);
                  let func: 'user'|'tech' = 'user';
                  if (functions[randomNumber] === 'tech') {
                    func = 'tech';
                  }
                  let customIcon: IconProp = 'user';
                  if (func === 'tech') {
                    customIcon = 'headset';
                  }
                  change.customdata = {
                    user: {
                      avatar: null,
                      function: func,
                    },
                    icon: customIcon,
                    sourceMessage: 'envelope',
                    dateDistance: formatDistanceToNowStrict(new Date(change.created_at), { addSuffix: true }),
                    type: 'message',
                    private: false,
                    solution: false,
                    message: message.value,
                  };
                }
              }
            }
          }
        }
      }
    }
    // const typeId = this.settingsService.getTypeIdByInternalname('incidentmessage');
    // if (typeId !== null) {
    //   this.typesApi.get(typeId)
    //     .subscribe(res => {
    //       this.timelineMessages.messages.push(
    //         {
    //           label: res.name,
    //           name: res.internalname,
    //           options: [
    //             {
    //               label: 'Private message',
    //               name: 'incidentmessageprivate',
    //               type: 'checkbox',
    //               selectValues: [],
    //               selectDefault: '',
    //               checkboxDefault: false,
    //             },
    //           ],
    //         },
    //       );
    //       this.timelineMessages.defaultNane = res.internalname;
    //     });
    // }
  }

  private getDisplay () {
    if (this.item !== null) {
      this.typepanelsApi.list(this.item.type_id)
        .subscribe((res) => {
          this.panels = res;
          for (const panel of res) {
            if (panel.displaytype === 'timeline') {
              this.timelineView = true;
            }
          }
          this.setMessages();
        });
    }
  }

  private getItemsForType (typeInternalname: string) {
    if (typeInternalname in this.selectItems) {
      return;
    }
    this.itemsApi.list(typeInternalname)
      .subscribe((result: IItem[]) => {
        this.selectItems[typeInternalname] = result;
      });
  }
}
