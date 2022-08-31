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

import { IItem } from 'src/app/interfaces/item';
import { IProperty } from 'src/app/interfaces/property';

export class Item {
  item: IItem;

  id: number;
  parentId: number;
  treepath: string;
  name: string;
  propertiesIndexedByInternalname: {[key: string]: IProperty} = {};

  constructor (item: IItem) {
    this.item = item;
    this.id = item.id;
    this.parentId = item.parent_id != null ? item.parent_id : -1;
    this.treepath = item.treepath != null ? item.treepath : '';
    this.name = item.name;
    this.item.properties.forEach((property) => {
      this.propertiesIndexedByInternalname[property.internalname] = property;
    });
  }

  getPropValueByInternalname (internalname: string, defaultValue: any = null) {
    if (this.propertiesIndexedByInternalname[internalname]) {
      return this.propertiesIndexedByInternalname[internalname].value;
    } else {
      return defaultValue;
    }
  }

  get organizationName () {
    return this.item.organization.name;
  }
}
