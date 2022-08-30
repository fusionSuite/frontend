import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';

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

  constructor (
    private apiService: ApiService,
  ) { }

  ngOnInit (): void {
    this.apiService.userList()
      .subscribe((result: IItem[]) => {
        this.users = result.map((userItem) => new User(userItem));
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.usersLoaded = true;
      });
  }
}
