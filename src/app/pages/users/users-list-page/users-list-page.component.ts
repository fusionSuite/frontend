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
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { UsersApi } from 'src/app/api/users';
import { IItem } from 'src/app/interfaces/item';
import { User } from 'src/app/models/user';
import { RolesApi } from 'src/app/api/roles';
import { IRole } from 'src/app/interfaces/role';

@Component({
  selector: 'app-users-list-page',
  templateUrl: './users-list-page.component.html',
  styleUrls: [],
})
export class UsersListPageComponent implements OnInit {
  usersLoaded = false;
  users: User[] = [];
  usersRoles: any = {};

  deleteForm = new FormGroup({});

  constructor (
    private usersApi: UsersApi,
    private notificationsService: NotificationsService,
    private rolesApi: RolesApi,
  ) { }

  ngOnInit (): void {
    this.usersApi.list()
      .subscribe((result: IItem[]) => {
        this.users = result.map((userItem) => new User(userItem));
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.usersLoaded = true;
        for (const user of this.users) {
          this.usersRoles[user.id] = [];
        }
        this.loadRoles();
      });
  }

  private loadRoles () {
    this.rolesApi.list()
      .subscribe((result: IRole[]) => {
        for (const role of result) {
          for (const user of role.users) {
            const myuser = this.users.find(item => item.id === user.id);
            if (myuser !== undefined) {
              this.usersRoles[user.id].push({
                id: role.id,
                name: role.name,
              });
            }
          }
        }
      });
  }

  deleteUser (user: User) {
    if (!window.confirm($localize `Do you really want to delete the user “${user.name}”?`)) {
      return;
    }

    this.usersApi.delete(user.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.users = this.users.filter((u) => {
          return user.id !== u.id;
        });

        this.notificationsService.success($localize `The user has been deleted successfully.`);
      });
  }
}
