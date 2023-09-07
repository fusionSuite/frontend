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

import { Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';
import { ItemsApi } from 'src/app/api/items';
import { IItem } from 'src/app/interfaces/item';
import { SettingsService } from 'src/app/services/settings.service';
import { Title } from '@angular/platform-browser';

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
  public xTotalCount = 0;
  public links: any = {};
  public contentRange = '';
  public search: string = '';
  public searchUpdate = new Subject<string>();
  public pages = [1];
  public currentPageNumber = 1;

  deleteForm = new FormGroup({});

  constructor (
    private typesApi: TypesApi,
    private itemsApi: ItemsApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    protected settingsService: SettingsService,
    private titleService: Title,
  ) {
    this.searchUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        if (value === '') {
          this.loadItems();
        } else {
          this.loadItems('name=' + value);
          this.currentPageNumber = 1;
        }
      });
  }

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const internalname = params.get('internalname');
      if (internalname !== null) {
        this.internalname = internalname;
        this.typesApi.get(this.settingsService.getTypeIdByInternalname(internalname))
          .subscribe((type: IType) => {
            this.type = type;
            this.id = type.id;
            this.titleService.setTitle(type.name);
          });

        this.loadItems();
      }
    });
  }

  public loadItems (suffix: string = '') {
    // load items
    this.itemsApi.listWithHeaders(this.internalname, suffix)
      .subscribe((result: any) => {
        const body: IItem[] = result.body;
        this.xTotalCount = result.headers.get('x-total-count');
        this.pages = Array(Math.ceil(this.xTotalCount / 100)).fill(1).map((x, i) => i + 1);
        this.parseLink(result.headers.get('link'));
        this.parseContentRange(result.headers.get('content-range'));
        this.items = body;
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

  private parseLink (link: string) {
    this.links = {};
    const links = link.split(', ');
    console.log(links);
    for (const mylink of links) {
      const parts = mylink.match(/([\w\d=&]+)>; rel="(\w+)"$/);
      if (parts !== undefined && parts?.length === 3 && parts[1] !== null && parts[2] !== null) {
        this.links[parts[2]] = parts[1];
      }
    }
  }

  private parseContentRange (contentRange: string) {
    contentRange = contentRange.replace('items', '');
    contentRange = contentRange.replace('/', ' of ');
    this.contentRange = contentRange;
  }

  // indexProperties (properties: IProperty[]) {
  //   const propsByIds: {[index: number]: IProperty} = {};
  //   properties.forEach((property) => {
  //     propsByIds[property.id] = property;
  //   });
  //   return propsByIds;
  // }

  public changePage (pageNumber: number) {
    let suffix = 'per_page=100&page=' + pageNumber;
    if (this.search !== '') {
      suffix += '&name=' + this.search;
    }
    this.loadItems(suffix);
  }
}
