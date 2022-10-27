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

import { IProperty } from 'src/app/interfaces/property';
import { IType } from 'src/app/interfaces/type';

interface Configuration {
  backendUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public configuration: Configuration = {
    backendUrl: '/api',
  };

  private propertiesIndexedByInternalname: {[key: string]: IProperty} = {};
  private typesIndexedByInternalname: {[key: string]: IType} = {};

  constructor (
  ) { }

  get backendUrl () {
    return this.configuration.backendUrl;
  }

  public resetTypes () {
    this.typesIndexedByInternalname = {};
  }

  public resetProperties () {
    this.propertiesIndexedByInternalname = {};
  }

  public setTypeIndex (internalname :string, data :any) {
    this.typesIndexedByInternalname[internalname] = data;
  }

  public setPropertyIndex (internalname :string, data :any) {
    this.propertiesIndexedByInternalname[internalname] = data;
  }

  public getTypeIdByInternalname (internalname: string) {
    return this.typesIndexedByInternalname[internalname]?.id;
  }

  public getPropertyIdByInternalname (internalname: string) {
    return this.propertiesIndexedByInternalname[internalname]?.id;
  }
}
