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

import { ApiV1 } from './v1';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsApi extends ApiV1 {
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
}
