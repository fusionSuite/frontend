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

import { IShortType } from './short-type';

export interface IItemproperty {
  id: number;
  name: string;
  internalname: string;
  property_id: number,
  valuetype: 'string'|'integer'|'decimal'|'text'|'boolean'|'datetime'|'date'|
             'time'|'number'|'itemlink'|'itemlinks'|'typelink'|'typelinks'|
             'propertylink'|'list'|'password'|'passwordhash';
  value: any;
  listvalues: {
    id: number;
    value: string|number;
  }[]|null;
  allowedtypes: IShortType[];
}
