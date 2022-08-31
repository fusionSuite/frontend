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
import { Router } from '@angular/router';

import { OrganizationsApi } from 'src/app/api/organizations';
import { AuthService } from 'src/app/services/auth.service';
import { IItem } from 'src/app/interfaces/item';

@Component({
  selector: '[app-page-menu]',
  templateUrl: './page-menu.component.html',
  styleUrls: [],
})
export class PageMenuComponent implements OnInit {
  organization: IItem|null = null;

  constructor (
    private authService: AuthService,
    private organizationsApi: OrganizationsApi,
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.organizationsApi.get(this.organizationId)
      .subscribe((result: IItem) => {
        this.organization = result;
      });
  }

  get displayName () {
    const tokenPayload = this.authService.getTokenPayload();
    if (tokenPayload.firstname && tokenPayload.lastname) {
      return tokenPayload.firstname + ' ' + tokenPayload.lastname;
    } else {
      return $localize `Anonymous`;
    }
  }

  get organizationId () {
    const tokenPayload = this.authService.getTokenPayload();
    if (tokenPayload.organization_id) {
      return tokenPayload.organization_id;
    } else {
      return '';
    }
  }

  logout () {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
