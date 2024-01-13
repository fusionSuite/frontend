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

import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

export type Layout = 'normal' | 'simple' | 'login';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: [],
})
export class PageComponent implements OnInit {
  @Input('page-title') pageTitle: string = '';
  @Input('page-layout') pageLayout: Layout = 'normal';

  constructor (
    private router: Router,
  ) { }

  ngOnInit (): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const page = document.querySelector('#page-focus') as HTMLElement | null;
      if (page) {
        page.focus();
      }
    });
  }

  focusContent () {
    const content = document.querySelector('#content-focus') as HTMLElement | null;
    if (content) {
      content.focus();
    }
  }

  shouldShowNavigation () {
    return this.pageLayout === 'normal';
  }
}
