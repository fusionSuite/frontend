import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';

import { IItem } from 'src/app/interfaces/item';

@Component({
  selector: 'app-users-list-page',
  templateUrl: './users-list-page.component.html',
  styleUrls: [],
})
export class UsersListPageComponent implements OnInit {
  usersLoaded = false;
  users: IItem[] = [];

  constructor (
    private apiService: ApiService,
  ) { }

  ngOnInit (): void {
    this.apiService.userList()
      .subscribe((result: IItem[]) => {
        this.users = result;
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.usersLoaded = true;
      });
  }
}
