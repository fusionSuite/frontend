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
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LayoutModule } from 'src/app/layout/layout.module';

import { OrganizationsRoutingModule } from './organizations-routing.module';

import { OrganizationsCreatePageComponent } from './organizations-create-page/organizations-create-page.component';
import { OrganizationsListPageComponent } from './organizations-list-page/organizations-list-page.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    OrganizationsCreatePageComponent,
    OrganizationsListPageComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LayoutModule,
    OrganizationsRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
})
export class OrganizationsModule { }
