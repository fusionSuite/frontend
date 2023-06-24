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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/guards/logged-in.guard';

import { TypesListPageComponent } from './types-list-page/types-list-page.component';
import { TypesCreatePageComponent } from './types-create-page/types-create-page.component';
import { TypesEditPageComponent } from './types-edit-page/types-edit-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `Types`,
    component: TypesListPageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'new',
    title: $localize `New type`,
    component: TypesCreatePageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: ':id',
    title: $localize `Edit type`,
    component: TypesEditPageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypesRoutingModule { }
