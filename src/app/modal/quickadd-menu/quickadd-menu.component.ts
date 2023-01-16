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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MenusApi } from 'src/app/api/menus';
import { IMenu } from 'src/app/interfaces/menu';
import { NotificationsService } from 'src/app/notifications/notifications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'modal-quickadd-menu',
  templateUrl: './quickadd-menu.component.html',
  styleUrls: [],
})
export class QuickaddMenuComponent implements OnChanges {
  public showIcons: boolean = false;
  public menu: IMenu[] = [];
  public iconChosen = null;
  public formControls = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  @Output() menuAdded = new EventEmitter<any>();

  constructor (
    private menusApi: MenusApi,
    private notificationsService: NotificationsService,
    private authService: AuthService,
  ) {
    this.iconChosen = null;
  }

  ngOnChanges (): void {
    this.menu = this.authService.menu;
    this.iconChosen = null;
  }

  public PanelIcon () {
    this.showIcons = true;
  }

  public updateIcon (event: any) {
    console.log(event);
    this.iconChosen = event;
    this.showIcons = false;
  }

  public close () {
    this.menuAdded.emit('test');
  }

  public chooseNewIcon () {
    this.iconChosen = null;
  }

  public addMenu () {
    const name = this.formControls.get('name');
    if (name !== null) {
      const data: any = {
        name: name.value,
      };
      if (this.iconChosen !== null) {
        data.icon = JSON.stringify(this.iconChosen);
      }
      this.menusApi.create(data)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The menu has been created successfully.`);
          this.menuAdded.emit('test');
        });
    }
  }
}
