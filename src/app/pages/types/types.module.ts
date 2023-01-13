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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LayoutModule } from 'src/app/layout/layout.module';

import { TypesRoutingModule } from './types-routing.module';

import { TypesListPageComponent } from './types-list-page/types-list-page.component';
import { TypesCreatePageComponent } from './types-create-page/types-create-page.component';
import { TypesImportPageComponent } from './types-import-page/types-import-page.component';
import { TypesEditPageComponent } from './types-edit-page/types-edit-page.component';
import { TimelineModule } from 'src/app/timeline/timeline.module';
import { SortbypipeModule } from 'src/app/utils/sortbypipe.module';
import { DragdropfileDirective } from 'src/app/directive/dragdropfile.directive';
import { IconchoiceModule } from 'src/app/modal/iconchoice/timelineiconchoice.module';
import { SortablejsModule } from 'ngx-sortablejs';

@NgModule({
  declarations: [
    TypesListPageComponent,
    TypesCreatePageComponent,
    TypesImportPageComponent,
    TypesEditPageComponent,
    DragdropfileDirective,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LayoutModule,
    TypesRoutingModule,
    ReactiveFormsModule,
    TimelineModule,
    SortbypipeModule,
    FormsModule,
    IconchoiceModule,
    SortablejsModule,
  ],
})
export class TypesModule { }
