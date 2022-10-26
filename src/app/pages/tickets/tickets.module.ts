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

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { LayoutModule } from 'src/app/layout/layout.module';

import { TicketsRoutingModule } from './tickets-routing.module';

import { TicketsCreatePageComponent } from './tickets-create-page/tickets-create-page.component';
import { TicketsListPageComponent } from './tickets-list-page/tickets-list-page.component';
import { TicketsEditPageComponent } from './tickets-edit-page/tickets-edit-page.component';

@NgModule({
  declarations: [
    TicketsCreatePageComponent,
    TicketsListPageComponent,
    TicketsEditPageComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    FontAwesomeModule,
    LayoutModule,
    TicketsRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
    },
  ],
})
export class TicketsModule { }
