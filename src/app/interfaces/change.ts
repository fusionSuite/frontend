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

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IShortUser } from './short-user';

export interface IChange {
  id: number;
  username: string;
  set_by_rule: boolean;
  message: string;
  old_value: string;
  new_value: string;
  created_at: string;
  user: IShortUser|null;
  customdata?: {
    user: {
      avatar: string|null;
      function: 'user'|'tech';
    };
    icon: IconProp;
    sourceMessage: IconProp|null,
    dateDistance: string;
    type: 'event'|'message';
    private: boolean,
    solution: boolean,
    message: string;
  };
}
