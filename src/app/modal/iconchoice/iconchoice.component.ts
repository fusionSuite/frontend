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

import { Component, EventEmitter, OnChanges, Output } from '@angular/core';
import { IFonticon } from 'src/app/interfaces/fonticon';
import { icons } from './iconlists';

@Component({
  selector: 'modal-iconchoice',
  templateUrl: './iconchoice.component.html',
  styleUrls: [],
})
export class Iconchoice implements OnChanges {
  @Output() newIcon = new EventEmitter<any>();

  public icons: IFonticon[] = icons;
  public search: string = '';

  constructor (
  ) { }

  ngOnChanges (): void {
  }

  public updateSearch (event: any) {
    this.search = event.target.value;
  }

  public filterIcons () {
    if (this.search === '') {
      return this.icons;
    } else {
      return this.icons.filter((icon) => {
        return icon.label.toLowerCase().includes(this.search.toLowerCase());
      });
    }
  }

  public chooseIcon (name: any) {
    this.newIcon.emit(name);
  }
}
