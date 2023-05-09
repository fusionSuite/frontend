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

import { IWorkflowengine } from './workflowengine';

export interface IWorkflowaction {
  id: number;
  name: string;
  action_type: string;
  x: number;
  y: number;
  comment: string;
  child_engine_connections_validate: IWorkflowengine[];
  child_engine_connections_notvalidate: IWorkflowengine[];
  child_action_connections_validate: IWorkflowaction[];
  child_action_connections_notvalidate: IWorkflowaction[];
  definitions: {
    id: number;
    field: string;
    value: string;
  }[];
}
