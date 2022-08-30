import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { UsersApi } from 'src/app/api/users';
import { IItem } from 'src/app/interfaces/item';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-users-list-page',
  templateUrl: './users-list-page.component.html',
  styleUrls: [],
})
export class UsersListPageComponent implements OnInit {
  usersLoaded = false;
  users: User[] = [];

  deleteForm = new FormGroup({});

  constructor (
    private usersApi: UsersApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.usersApi.list()
      .subscribe((result: IItem[]) => {
        this.users = result.map((userItem) => new User(userItem));
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.usersLoaded = true;
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
