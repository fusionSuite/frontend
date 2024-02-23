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

import { IChange } from './change';
import { IItemproperty } from './itemproperty';
import { IShortOrganization } from './short-organization';
import { IShortUser } from './short-user';

export interface IItem {
  id: number;
  id_bytype: number;
  type_id: number;
  name: string;
  checked: boolean;
  parent_id: number|null;
  treepath: string|null;
  organization: IShortOrganization;
  properties: IItemproperty[];
  created_at: string;
  updated_at: string|null;
  deleted_at: string|null;
  created_by: IShortUser|null;
  updated_by: IShortUser|null;
  deleted_by: IShortUser|null;
  changes: IChange[];
}
