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

/*
  Usages:

  * ngFor="let c of oneDimArray | sortBy:'asc'"
  * ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/

import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'sortBy' })

export class SortByPipe implements PipeTransform {
  transform (value: any[], order: 'asc'|'desc' = 'asc', column: string = ''): any[] {
    if (!value || !order) {
      return value;
    }
    if (value.length <= 1) {
      return value;
    }
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    } // sort 1d array
    return orderBy(value, [value => value[column].toLowerCase()], [order]);
  }
}
