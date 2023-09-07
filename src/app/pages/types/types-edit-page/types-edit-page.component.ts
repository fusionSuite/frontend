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
import { IProperty } from 'src/app/interfaces/property';
import { PropertiesApi } from 'src/app/api/properties';
import { AuthService } from 'src/app/services/auth.service';
import { IMenu } from 'src/app/interfaces/menu';
import { MenuitemsApi } from 'src/app/api/menuitems';
import { MenusApi } from 'src/app/api/menus';
import { ITypepanel } from 'src/app/interfaces/typepanel';
import { TypepanelsApi } from 'src/app/api/typepanel';
import * as Sortable from 'sortablejs';
import { TypepanelitemsApi } from 'src/app/api/typepanelitem';
import { icons } from 'src/app/modal/iconchoice/iconlists';
import { IFonticon } from 'src/app/interfaces/fonticon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { InitappService } from 'src/app/services/initapp.service';
import { Title } from '@angular/platform-browser';

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
  public panels: ITypepanel[] = [];
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

  public menu: IMenu[] = [];
  public showIcons: boolean = false;
  public showPanelAddForm: boolean = false;
  public showQuickAddMenu: boolean = false;
  public menuItemIcon: IconProp|null = null;
  public panelOptions: Sortable.Options = {
    group: 'testxx',
    // onUpdate: (event: any) => {
    //   this.sortPanelitems(event);
    // },
    onAdd: (event: any) => {
      this.sortPanelitems(event);
    },
    // onRemove: (event: any) => {
    //   this.sortPanelitems(event);
    // },
  };

  public panelSort: any = [];
  public panelItems: any = {};
  public icons: IFonticon[] = icons;

  public formPanelControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    icon: new FormControl('', {
      nonNullable: true,
      validators: [],
    }),
    timeline: new FormControl(false, {
      nonNullable: true,
      validators: [],
    }),
  });

  public formMenuChoice = new FormGroup({
    menuId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public shortcuts = [
    {
      name: 'Properties',
      link: 'properties',
    },
    {
      name: 'Panels',
      link: 'panels',
    },
    {
      name: 'Menu',
      link: 'menu',
    },
    {
      name: 'Workflow',
      link: 'workflow',
    },
    {
      name: 'Timeline',
      link: 'timeline',
    },
  ];

  constructor (
    private typesApi: TypesApi,
    private menusApi: MenusApi,
    private menuitemsApi: MenuitemsApi,
    private propertiesApi: PropertiesApi,
    private typepanelsApi: TypepanelsApi,
    private typepanelitemsApi: TypepanelitemsApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private initappService: InitappService,
    private titleService: Title,
  ) {}

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.id = +id;
        this.loadMenus();
        this.loadType();
        this.loadPanels();
      }
    });
  }

  public loadType () {
    this.typesApi.get(this.id)
      .subscribe(res => {
        this.titleService.setTitle('Edit type: ' + res.name);
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

  public addProperty (prop: IProperty) {
    this.typesApi.associateProperty(this.id, prop.id)
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
        this.loadPanels();
      });
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
        this.loadPanels();
      });
  }

  public menuChoice () {
    const menuItem = this.getMenuItemOfThisType();
    if (menuItem === undefined) {
      // add it
      const data = {
        name: this.type?.name,
        icon: 'signs-post',
        type_id: this.type?.id,
        menu_id: this.formMenuChoice.controls.menuId.value,
      };
      this.menuitemsApi.create(data)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The type has been added to the menu successfully.`);
          this.initappService.loadMenu().then(() => {
            this.initappService.loadMenuCustom().then(() => {
              this.authService.menuChanges();
              this.loadMenus();
            });
          });
        });
    } else {
      if (this.formMenuChoice.controls.menuId.value === 0) {
        // delete it
        this.menuitemsApi.delete(menuItem.id)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            this.notificationsService.success($localize `The type has been deleted from the menu successfully.`);
            this.initappService.loadMenu().then(() => {
              this.initappService.loadMenuCustom().then(() => {
                this.authService.menuChanges();
                this.loadMenus();
              });
            });
          });
      } else {
        // update it
        const data = {
          menu_id: this.formMenuChoice.controls.menuId.value,
        };
        this.menuitemsApi.update(menuItem.id, data)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.notificationsService.error(error.error.message);
              return throwError(() => new Error(error.error.message));
            }),
          ).subscribe((result: any) => {
            this.notificationsService.success($localize `The type has been modified to the menu successfully.`);
            this.initappService.loadMenu().then(() => {
              this.initappService.loadMenuCustom().then(() => {
                this.authService.menuChanges();
                this.loadMenus();
              });
            });
          });
      }
    }
  }

  public addMenu (event: any) {
    if (event.key === 'Enter') {
      const data = {
        name: event.target.value,
        icon: '',
      };
      this.menusApi.create(data)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The menu has been created successfully.`);
          this.loadType();
        });
    }
  }

  public updateIcon (event: any) {
    if (event === null) {
      this.showIcons = false;
      return;
    }
    // update formcrontrol value
    this.formPanelControls.controls.icon.setValue(event);
    this.showIcons = false;
  }

  public addPanel () {
    console.log(this.formPanelControls.controls);
    let displaytype = 'default';
    if (this.formPanelControls.controls.timeline.value) {
      displaytype = 'timeline';
    }
    const data = {
      name: this.formPanelControls.controls.name.value,
      icon: this.formPanelControls.controls.icon.value,
      type_id: this.id,
      displaytype,
    };
    this.typepanelsApi.create(data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.loadPanels();
        this.showPanelAddForm = false;
        this.notificationsService.success($localize `The panel has been create successfully.`);
        // reinit the form
        this.formPanelControls.controls.name.setValue('');
        this.formPanelControls.controls.icon.setValue('');
        this.formPanelControls.controls.timeline.setValue(false);
      });
  }

  public getPropertyNameById (id: number) {
    if (this.type !== null) {
      const myProp = this.type.properties.find(prop => {
        return prop.id === this.panelItems[id].property_id;
      });
      if (myProp === undefined) {
        return '??';
      }
      return myProp?.name;
    }
    return '';
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

  /**
   * update the menu item icon of this type
   */
  public udpateMenuTypeIcon () {
    // update icon
    console.log(this.menuItemIcon);
    const menuItem = this.getMenuItemOfThisType();
    if (menuItem !== undefined) {
      this.menuitemsApi.update(menuItem.id, { icon: this.menuItemIcon })
        .subscribe((res) => {
          this.initappService.loadMenu().then(() => {
            this.initappService.loadMenuCustom().then(() => {
              this.authService.menuChanges();
            });
          });
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
    if (this.type !== null) {
      this.createdAt = formatDistanceToNow(new Date(this.type.created_at), { addSuffix: true });
      if (this.type.updated_at !== null) {
        this.updatedAt = formatDistanceToNow(new Date(this.type.updated_at), { addSuffix: true });
      }
    }
  }

  private loadPanels () {
    if (this.id > 0) {
      this.typepanelsApi.list(this.id)
        .subscribe((res) => {
          this.panels = res;
          this.panelSort = [];
          this.panelItems = {};
          for (const panel of res) {
            const ids = [];
            for (const item of panel.items) {
              this.panelItems[item.id] = item;
              ids.push(item.id);
            }
            this.panelSort.push(ids);
          }
        });
    }
  }

  private sortPanelitems (event: any) {
    const panelitemId = parseInt(event.item.id.replace('panelitem-', ''));
    const typepanelId = parseInt(event.to.id.replace('panel-', ''));
    this.typepanelitemsApi.update(panelitemId, { typepanel_id: typepanelId })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.notificationsService.success($localize `The property has been moved successfully.`);
        // this.loadPanels();
      });
  }

  private getMenuItemOfThisType () {
    let menuItem;
    for (const menu of this.menu) {
      menuItem = menu.items.find(item => {
        return item.type.id === this.id;
      });
      if (menuItem !== undefined) {
        return menuItem;
      }
    }
    return menuItem;
  }

  reloadMenu (event: any) {
    this.authService.menuChanges();
    this.loadMenus();
    this.showQuickAddMenu = false;
  }

  test (index: number) {
    console.log(index);
    console.log(this.panelSort[index]);
  }

  private loadMenus () {
    this.menu = this.authService.menu;
    this.menu.unshift({
      id: 0,
      name: 'not in menu',
      icon: 'bars',
      position: 0,
      items: [],
    });
    const menuItem = this.getMenuItemOfThisType();
    if (menuItem !== undefined) {
      this.formMenuChoice.controls.menuId.setValue(menuItem.menu_id);
      this.menuItemIcon = menuItem.icon;
    }
  }
}
