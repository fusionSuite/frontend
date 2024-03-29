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

import { Injectable } from '@angular/core';
import { ICreateItem } from '../interfaces/create/item';

import { ApiV1 } from './v1';
import { forkJoin, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsApi extends ApiV1 {
  public list (internalName: string) {
    // return this.listItems(internalName);

    return this.listItemsResponse(internalName)
      .pipe(
        switchMap((res) => {
          const totalCount = res.headers.get('x-total-count');
          let totalPages: number = 0;
          if (totalCount !== null) {
            totalPages = Math.ceil(parseInt(totalCount) / 100);
          }
          const req$ = Array(totalPages).fill(1).map((_, index) =>
            this.listItems(internalName, index + 1),
          );
          return forkJoin(req$);
        }),
      // ).subscribe({
      //   next: (res: any) => {
      //     let all: IItem[] = [];
      //     for (let page = 0; page < res.length; page++) {
      //       all = all.concat(res[page]);
      //     }
      //     return all;
      //   },
      //   error: (e) => {
      //     console.log('Error Fetching Items');
      //   },
      // },
      );
  }

  public listWithHeaders (internalName: string, suffix: string = '') {
    return this.listItemsWithHeaders(internalName, suffix);
  }

  public get (id: number) {
    return this.getItem(id);
  }

  public create (internalName: string, item: ICreateItem) {
    return this.postItem(internalName, item.name, item);
  }

  public update (id: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/items/' + id, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public delete (id: number) {
    return this.http.delete(this.settingsService.backendUrl + '/v1/items/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public updateProperty (id: number, propertyId: number, data: any) {
    return this.http.patch(this.settingsService.backendUrl + '/v1/items/' + id + '/property/' + propertyId, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public createItemlink (id: number, propertyId: number, itemlinkId: number) {
    return this.http.post(
      this.settingsService.backendUrl + '/v1/items/' + id + '/property/' + propertyId + '/itemlinks',
      { value: itemlinkId },
      {
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
        },
      });
  }
}
