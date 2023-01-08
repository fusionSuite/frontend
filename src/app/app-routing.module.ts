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

import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `FusionSuite`,
    component: HomePageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'login',
    title: $localize `Log in to FusionSuite`,
    component: LoginPageComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'organizations',
    loadChildren: () => import('./pages/organizations/organizations.module').then(m => m.OrganizationsModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'items',
    loadChildren: () => import('./pages/items/items.module').then(m => m.ItemsModule),
  },
  {
    path: 'config/properties',
    loadChildren: () => import('./pages/properties/properties.module').then(m => m.PropertiesModule),
  },
  {
    path: 'config/types',
    loadChildren: () => import('./pages/types/types.module').then(m => m.TypesModule),
  },
  {
    path: '**',
    title: $localize `Page not found`,
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
