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

import { ItemsRoutingModule } from './items-routing.module';

import { TimelineModule } from 'src/app/timeline/timeline.module';
import { SortbypipeModule } from 'src/app/utils/sortbypipe.module';
import { ItemsListPageComponent } from './items-list-page/items-list-page.component';
import { ItemsCreatePageComponent } from './items-create-page/items-create-page.component';
import { ItemsEditPageComponent } from './items-edit-page/items-edit-page.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ItemsFieldsListComponent } from './fields/list/items-fields-list.component';
import { ItemsFieldsItemlinkComponent } from './fields/itemlink/items-fields-itemlink.component';
import { ItemsFieldsBooleanComponent } from './fields/boolean/items-fields-boolean.component';
import { ItemsFieldsItemlinksComponent } from './fields/itemlinks/items-fields-itemlinks.component';
import { ItemsFieldsStringComponent } from './fields/string/items-fields-string.component';
import { ItemsFieldsTextComponent } from './fields/text/items-fields-text.component';
import { ItemsFieldsDateComponent } from './fields/date/items-fields-date.component';
import { ItemsFieldsDatetimeComponent } from './fields/datetime/items-fields-datetime.component';
import { ItemsFieldsTypelinkComponent } from './fields/typelink/items-fields-typelink.component';
import { ItemsFieldsTypelinksComponent } from './fields/typelinks/items-fields-typelinks.component';
import { ItemsFieldsDecimalComponent } from './fields/decimal/items-fields-decimal.component';
import { ItemsFieldsIntegerComponent } from './fields/integer/items-fields-integer.component';
import { ItemsFieldsNumberComponent } from './fields/number/items-fields-number.component';
import { ItemsFieldsPropertylinkComponent } from './fields/propertylink/items-fields-propertylink.component';
import { ItemsFieldsTimeComponent } from './fields/time/items-fields-time.component';
import { QuickaddListvalueModule } from 'src/app/modal/quickadd-listvalue/quickadd_listvalue.module';

@NgModule({
  declarations: [
    ItemsListPageComponent,
    ItemsCreatePageComponent,
    ItemsEditPageComponent,
    ItemsFieldsListComponent,
    ItemsFieldsItemlinkComponent,
    ItemsFieldsItemlinksComponent,
    ItemsFieldsBooleanComponent,
    ItemsFieldsStringComponent,
    ItemsFieldsTextComponent,
    ItemsFieldsDateComponent,
    ItemsFieldsDatetimeComponent,
    ItemsFieldsTimeComponent,
    ItemsFieldsTypelinkComponent,
    ItemsFieldsTypelinksComponent,
    ItemsFieldsDecimalComponent,
    ItemsFieldsIntegerComponent,
    ItemsFieldsNumberComponent,
    ItemsFieldsPropertylinkComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LayoutModule,
    ItemsRoutingModule,
    ReactiveFormsModule,
    TimelineModule,
    SortbypipeModule,
    NgSelectModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    QuickaddListvalueModule,
  ],
})
export class ItemsModule { }
