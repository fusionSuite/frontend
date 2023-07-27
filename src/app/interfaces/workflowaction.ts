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

export interface IWorkflowaction {
  id: number;
  name: string;
  category: 'actionscript'|'createitem'|'updateitem'|'fusioninventorytoanothertype'|'associateitemtoproperty'|'createventdatetime';
  x: number;
  y: number;
  comment: string;
  multiplegroups: boolean;
  groups: any[];
  children: {
    id: number;
    name: string;
    type: 'action';
    category: string;
  }[];
  children_error: {
    id: number;
    name: string;
    type: 'action';
    category: string;
  }[];
}
