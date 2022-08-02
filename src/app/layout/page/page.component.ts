import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

export type Layout = 'normal' | 'simple';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: [],
})
export class PageComponent implements OnInit {
  @Input() title: string = '';
  @Input() layout: Layout = 'normal';

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
    return this.layout === 'normal';
  }
}
