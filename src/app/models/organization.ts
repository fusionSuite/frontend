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

import { Item } from './item';

export class Organization extends Item {
  public indentName (baseIndentation: number) {
    // Treepath length is a multiple of 4. We remove baseIndentation so the
    // root organization is not indented.
    const indentationLength = Math.max(0, this.treepath.length - baseIndentation);
    // Prepend *non-breakable* spaces to the organization name.
    return ' '.repeat(indentationLength) + this.name;
  }
}
