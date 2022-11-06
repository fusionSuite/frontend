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

import { TicketsCreatePageComponent } from './tickets-create-page/tickets-create-page.component';
import { TicketsListPageComponent } from './tickets-list-page/tickets-list-page.component';
import { TicketsEditPageComponent } from './tickets-edit-page/tickets-edit-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `Tickets`,
    component: TicketsListPageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'new',
    title: $localize `New ticket`,
    component: TicketsCreatePageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: ':id',
    title: $localize `Edit ticket`,
    component: TicketsEditPageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule { }
