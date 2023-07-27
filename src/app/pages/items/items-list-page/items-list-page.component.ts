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
import { PropertiesApi } from 'src/app/api/properties';
import { IProperty } from 'src/app/interfaces/property';
import { ActivatedRoute } from '@angular/router';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';
import { ItemsApi } from 'src/app/api/items';
import { IItem } from 'src/app/interfaces/item';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-items-list-page',
  templateUrl: './items-list-page.component.html',
  styleUrls: [],
})
export class ItemsListPageComponent implements OnInit {
  itemsLoaded = false;
  items: IItem[] = [];
  // propertiesByIds: {[index: number]: IProperty} = {};
  public type: IType|null = null;
  public id: number = 0;
  public internalname: string = '';

  deleteForm = new FormGroup({});

  constructor (
    private typesApi: TypesApi,
    private itemsApi: ItemsApi,
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
            this.type = type;
            this.id = type.id;
          });

        this.loadItems();
      }
    });
  }

  private loadItems () {
    // load items
    this.itemsApi.list(this.internalname)
      .subscribe((result: IItem[]) => {
        this.items = result;
        this.itemsLoaded = true;
      });
  }

  deleteItem (item: IItem) {
    if (!window.confirm($localize `Do you really want to delete the item “${item.name}”?`)) {
      return;
    }
    this.itemsApi.delete(item.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.itemsLoaded = false;
        this.loadItems();

        this.notificationsService.success($localize `The item has been deleted successfully.`);
      });
  }

  // indexProperties (properties: IProperty[]) {
  //   const propsByIds: {[index: number]: IProperty} = {};
  //   properties.forEach((property) => {
  //     propsByIds[property.id] = property;
  //   });
  //   return propsByIds;
  // }
}
