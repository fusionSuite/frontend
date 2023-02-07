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
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';
import { MenucustomsApi } from 'src/app/api/menucustoms';
import { MenusApi } from 'src/app/api/menus';
import { IMenu } from 'src/app/interfaces/menu';
import { NotificationsService } from 'src/app/notifications/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { IMenucustom } from 'src/app/interfaces/menucustom';

@Component({
  selector: '[app-page-menu]',
  templateUrl: './page-menu.component.html',
  styleUrls: [],
})
export class PageMenuComponent implements OnInit {
  public organization: IItem|null = null;
  public types: IType[] = [];
  public view: 'personal'|'business' = 'personal';
  public menu: IMenu[] = [];
  public menuCustom: IMenucustom[] = [];
  public customitemsList: number[] = [];
  public search: string = '';
  public currentRoute: string = '/';
  public configurationExpanded: boolean = false;

  constructor (
    private authService: AuthService,
    private organizationsApi: OrganizationsApi,
    private typesApi: TypesApi,
    private menusApi: MenusApi,
    private menucustomsApi: MenucustomsApi,
    private router: Router,
    private notificationsService: NotificationsService,
  ) {
    this.currentRoute = this.router.url;
  }

  ngOnInit (): void {
    this.view = this.authService.view;
    if (this.authService.menucustom.length > 0) {
      this.menuCustom = this.authService.menucustom;
      for (const item of this.menuCustom) {
        this.customitemsList.push(item.menuitem.id);
      }
    }
    if (this.authService.menu.length > 0) {
      this.menu = this.authService.menu;
    }
    this.organizationsApi.get(this.organizationId)
      .subscribe((result: IItem) => {
        this.organization = result;
      });
    this.typesApi.list()
      .subscribe((result: IType[]) => {
        this.types = result;
        this.types.sort((u1, u2) => u1.name.localeCompare(u2.name));
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

  public changeView (view: 'personal'|'business') {
    this.view = view;
    this.authService.view = view;
  }

  public addMenuitemToCustom (item: any) {
    if (item.id !== undefined) {
      this.menucustomsApi.create(item.id)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The menu item has been added to your personal menu.`);
          this.authService.menucustom = [];
          this.menuCustom = [];
          this.getCustomitemmenu();
        });
    }
  }

  public deletMenuitemToCustom (item: any) {
    if (item.id !== undefined) {
      this.menucustomsApi.delete(item.id)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          this.notificationsService.success($localize `The menu item has been removed from your personal menu.`);
          this.authService.menucustom = [];
          this.menuCustom = [];
          this.getCustomitemmenu();
        });
    }
  }

  public updateSearch (event: any) {
    this.search = event.target.value;
  }

  public menuWithItems () {
    return this.menu.filter((menu) => {
      return menu.items.length > 0;
    });
  }

  public filtered (items: any[]) {
    return items.filter((item) => {
      if (this.search === '') {
        return item;
      }
      return item.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  public menuExpand (menu: IMenu) {
    if (menu.expanded === undefined || !menu.expanded) {
      menu.expanded = true;
      // need disable expanded to all other menus
      for (const mymenu of this.menu) {
        if (mymenu.id !== menu.id) {
          mymenu.expanded = false;
        }
      }
    } else {
      menu.expanded = false;
    }
  }

  public changeRoute (currentRoute: string) {
    this.currentRoute = currentRoute;
  }

  public parseIcon (icon: any) {
    if (icon.includes('[')) {
      return JSON.parse(icon);
    } else {
      return icon;
    }
  }

  private getCustomitemmenu () {
    this.menucustomsApi.list()
      .subscribe((res: IMenucustom[]) => {
        for (const item of res) {
          this.menuCustom.push(item);
          this.customitemsList.push(item.menuitem.id);
        }
      });
  }

  logout () {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
