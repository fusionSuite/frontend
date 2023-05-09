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

import { IWorkflowaction } from './workflowaction';
import { IWorkflowengine } from './workflowengine';

export interface IWorkflowtrigger {
  id: number;
  name: string;
  trigger_type: string;
  async: boolean;
  x: number;
  y: number;
  comment: string;
  child_engine_connections: IWorkflowengine[];
  child_action_connections: IWorkflowaction[];
}
