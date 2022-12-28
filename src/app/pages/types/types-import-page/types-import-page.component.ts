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

import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';

@Component({
  selector: 'app-types-import-page',
  templateUrl: './types-import-page.component.html',
  styleUrls: [],
})
export class TypesImportPageComponent implements OnInit {
  public types: IType[] = [];

  constructor (
    private typesApi: TypesApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
  }

  public onFileDropped (files:any) {
    this.manageUploadedFile(files);
  }

  public handleFileInput (files: any) {
    this.manageUploadedFile(files.srcElement.files);
  }

  private async readFile (file: any) {
    return await file.text();
  }

  private manageUploadedFile (files: any) {
    if (files[0].type && files[0].type !== 'application/json') {
      this.notificationsService.error($localize `File is not a JSON file`);
      return;
    }

    const fileContent = this.readFile(files[0]);
    fileContent.then((filecont: string) => {
      this.typesApi.importTemplate(filecont)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The tempalte has been imported successfully.`);
        });
    });
  }
}
