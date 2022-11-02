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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { IItemResult } from '../interfaces/item-result';

import { ApiV1 } from './v1';

@Injectable({
  providedIn: 'root',
})
export class ItemsApi extends ApiV1 {
  public list () {
    return this.listItems('organization');
  }

  public get (id: number) {
    return this.getItem(id);
  }

  public create (name: string, parentId: number) {
    return this.postItem('organization', name, {
      parent_id: parentId,
    });
  }

  public delete (id: number) {
    return this.deleteItem(id);
  }

  public async postItemAndLink(typelink: any, item: any) {

    let itemId: number|undefined = 0;
    itemId = await this.postItem(typelink.internalName, typelink.name, {properties: typelink.properties})
      .pipe()
      .pipe(map((res) => {
        return res.id;
      }))
      .toPromise();
    let linkId: any;
    if (itemId !== undefined) {
      await this.postTypelinkToItem(item.id, item.propertyId, itemId)
        .pipe()
        .pipe(map((res) => {
          console.log(res);
        }))
        .toPromise();
    }

      // .subscribe((res) => {
      //   console.log(res);
      //   // we got the id of the item
      //   this.postTypelinkToItem(item.id, item.propertyId, res.id)
      //     .subscribe((resLink) => {
      //       console.log(resLink);
      //     })
      //     ;
      // });
  }
}
