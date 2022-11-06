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

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IItem } from './item';

export interface IPanel {
  title: string;
  icon: IconProp;
  values: {
    title: string;
    value: string[];
    type: 'single'|'multiple'|'status'|'progressbar';
    listvalues?: any;
  }[];
}

export interface IPanelNew {
  title: string;
  icon: IconProp;
  items: {
    title: string;
    id: number;
    type: 'single'|'multiple'|'status'|'progressbar';
    valuetype: 'string'|'integer'|'decimal'|'text'|'boolean'|'datetime'|'date'|'time'|'number'|'itemlink'|'itemlinks'|'typelink'|'typelinks'|'propertylink'|'list'|'password';
    valueString?: string;
    valueInteger?: number;
    valueDecimal?: number;
    valueText?: string;
    valueBoolean?: boolean;
    valueDatetime?: string;
    valueDate?: string;
    valueTime?: string;
    valueNumber?: number;
    valueItemlink?: IItem;
    valueItemlinks?: IItem[];
    valueTypelink?: {
      // TODO
    }[];
    valueTypelinks?: {
      // TODO - item?
    }[];
    valuePropertylink?: {
      // TODO?
    }[];
    valueList?: {
      id: number;
      value: string;
    };
    valuePassword?: string;

    listvalues: {
      id: number;
      value: string;
    }[];
  }[];
}
