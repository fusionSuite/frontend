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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortbypipeModule } from '../utils/sortbypipe.module';
import { WorkflowComponent } from './workflow.component';
import { DndModule } from 'ngx-drag-drop';
import { WorkflowTriggerComponent } from './triggers/workflowTrigger.component';
import { WorkflowActionComponent } from './actions/workflowAction.component';
import { WorkflowEngineComponent } from './engines/workflowEngine.component';
import { WorkflowTriggerPanelComponent } from './triggers/workflowTriggerPanel.component';
import { WorkflowActionPanelComponent } from './actions/workflowActionPanel.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkflowCheckcriteriaPanelComponent } from './engines/workflowCheckcriteriaPanel.component';
import { WorkflowGetdataPanelComponent } from './engines/workflowGetdataPanel.component';
import { WorkflowSearchitemPanelComponent } from './engines/workflowSearchitemPanel.component';
import { WorkflowTransformdataPanelComponent } from './engines/workflowTransformdataPanel.component';
import { WorkflowFusioninventoryPanelComponent } from './triggers/workflowFusioninventoryPanel.component';

@NgModule({
  declarations: [
    WorkflowComponent,
    WorkflowTriggerComponent,
    WorkflowActionComponent,
    WorkflowEngineComponent,
    WorkflowCheckcriteriaPanelComponent,
    WorkflowGetdataPanelComponent,
    WorkflowSearchitemPanelComponent,
    WorkflowTransformdataPanelComponent,
    WorkflowTriggerPanelComponent,
    WorkflowActionPanelComponent,
    WorkflowFusioninventoryPanelComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    SortbypipeModule,
    DndModule,
  ],
  exports: [
    WorkflowComponent,
  ],
})
export class WorkflowModule { }
