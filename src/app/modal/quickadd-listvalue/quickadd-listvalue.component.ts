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
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { PropertiesApi } from 'src/app/api/properties';
import { NotificationsService } from 'src/app/notifications/notifications.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'modal-quickadd-listvalue',
  templateUrl: './quickadd-listvalue.component.html',
  styleUrls: [],
})
export class QuickaddListvalueComponent implements OnChanges {
  public formControls = new FormGroup({
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  @Input() propertyId: number = 0;
  @Output() newValuelist = new EventEmitter<any>();

  constructor (
    private propertiesApi: PropertiesApi,
    private notificationsService: NotificationsService,
    private authService: AuthService,
  ) {
  }

  ngOnChanges (): void {
  }

  public close () {
    this.newValuelist.emit('test');
  }

  public addValue () {
    const value = this.formControls.get('value');
    if (value !== null) {
      this.propertiesApi.createListvalue(this.propertyId, value.value)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The valuelist has been created successfully.`);
          this.newValuelist.emit('test');
        });
    }
  }
}
